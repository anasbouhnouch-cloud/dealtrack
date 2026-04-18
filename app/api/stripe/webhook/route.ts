import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { stripe } from '@/lib/stripe'
import { createAdminClient } from '@/lib/supabase/admin'
import Stripe from 'stripe'

// Must be a Node.js route — Stripe requires the raw request body for
// signature verification and Next.js Edge runtime doesn't support it.
export const runtime = 'nodejs'

// Helper: look up our internal user ID from a Stripe customer ID.
// Falls back to customer metadata when the profiles lookup fails.
async function getUserIdByCustomer(
  supabase: ReturnType<typeof createAdminClient>,
  customerId: string,
): Promise<string | null> {
  // 1. Look up by stripe_customer_id in profiles (most reliable)
  const { data } = await supabase
    .from('profiles')
    .select('id')
    .eq('stripe_customer_id', customerId)
    .single()
  if (data?.id) return data.id

  // 2. Fall back: read supabase_user_id from Stripe customer metadata
  try {
    const customer = await stripe.customers.retrieve(customerId)
    if (!customer.deleted) {
      const meta = (customer as Stripe.Customer).metadata?.supabase_user_id
      if (meta) return meta
    }
  } catch {
    // ignore Stripe lookup errors
  }

  return null
}

// Helper: upgrade a user to Pro by user ID
async function upgradeToPro(
  supabase: ReturnType<typeof createAdminClient>,
  userId: string,
  subscriptionId: string,
) {
  const { error } = await supabase
    .from('profiles')
    .update({ plan: 'pro', stripe_subscription_id: subscriptionId })
    .eq('id', userId)

  if (error) {
    console.error(`[webhook] Failed to upgrade user ${userId} to pro:`, error)
  } else {
    console.log(`[webhook] User ${userId} upgraded to pro (sub: ${subscriptionId})`)
  }
}

export async function POST(request: Request) {
  const body = await request.text()
  const headersList = await headers()
  const sig = headersList.get('stripe-signature')

  if (!sig) {
    console.error('[webhook] Missing stripe-signature header')
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 })
  }

  if (!process.env.STRIPE_WEBHOOK_SECRET || process.env.STRIPE_WEBHOOK_SECRET === 'your_stripe_webhook_secret') {
    console.error('[webhook] STRIPE_WEBHOOK_SECRET is not configured')
    return NextResponse.json({ error: 'Webhook secret not configured' }, { status: 500 })
  }

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET)
  } catch (err) {
    console.error('[webhook] Signature verification failed:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  console.log(`[webhook] Received event: ${event.type}`)

  const supabase = createAdminClient()

  try {
    switch (event.type) {
      // ── Primary trigger: checkout completed ──────────────────────────────
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session

        // Only process paid subscription checkouts
        if (session.mode !== 'subscription' || session.payment_status !== 'paid') break

        const subscriptionId = session.subscription as string | null
        if (!subscriptionId) {
          console.error('[webhook] checkout.session.completed: no subscription ID')
          break
        }

        // Prefer user_id from our metadata; fall back to customer lookup
        let userId = session.metadata?.user_id ?? null
        if (!userId && session.customer) {
          userId = await getUserIdByCustomer(supabase, session.customer as string)
        }

        if (!userId) {
          console.error('[webhook] checkout.session.completed: cannot resolve user_id', {
            metadata: session.metadata,
            customer: session.customer,
          })
          break
        }

        await upgradeToPro(supabase, userId, subscriptionId)
        break
      }

      // ── Secondary trigger: invoice paid (fires on renewal too) ───────────
      case 'invoice.paid': {
        const invoice = event.data.object as Stripe.Invoice
        const subscriptionId = (invoice as any).subscription as string | null
        const customerId = invoice.customer as string | null

        if (!subscriptionId || !customerId) break

        const userId = await getUserIdByCustomer(supabase, customerId)
        if (!userId) {
          console.error('[webhook] invoice.paid: cannot resolve user_id', { customerId })
          break
        }

        await upgradeToPro(supabase, userId, subscriptionId)
        break
      }

      // ── Subscription cancelled ───────────────────────────────────────────
      case 'customer.subscription.deleted': {
        const sub = event.data.object as Stripe.Subscription
        const { error } = await supabase
          .from('profiles')
          .update({ plan: 'free', stripe_subscription_id: null })
          .eq('stripe_subscription_id', sub.id)

        if (error) console.error('[webhook] subscription.deleted update failed:', error)
        else console.log(`[webhook] Subscription ${sub.id} deleted → plan set to free`)
        break
      }

      // ── Subscription status changed (paused, past_due, etc.) ─────────────
      case 'customer.subscription.updated': {
        const sub = event.data.object as Stripe.Subscription
        const isActive = sub.status === 'active'
        const { error } = await supabase
          .from('profiles')
          .update({ plan: isActive ? 'pro' : 'free' })
          .eq('stripe_subscription_id', sub.id)

        if (error) console.error('[webhook] subscription.updated update failed:', error)
        else console.log(`[webhook] Subscription ${sub.id} updated → plan: ${isActive ? 'pro' : 'free'}`)
        break
      }
    }
  } catch (err) {
    console.error('[webhook] Unhandled error processing event:', err)
    // Still return 200 so Stripe doesn't retry — log the error instead
  }

  return NextResponse.json({ received: true })
}
