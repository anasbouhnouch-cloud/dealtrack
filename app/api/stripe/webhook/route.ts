import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { stripe } from '@/lib/stripe'
import { createAdminClient } from '@/lib/supabase/admin'
import Stripe from 'stripe'

export async function POST(request: Request) {
  const body = await request.text()
  const headersList = await headers()
  const sig = headersList.get('stripe-signature')!

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  const supabase = createAdminClient()

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session
      const userId = session.metadata?.user_id
      if (userId && session.subscription) {
        await supabase.from('profiles').update({
          plan: 'pro',
          stripe_subscription_id: session.subscription as string,
        }).eq('id', userId)
      }
      break
    }

    case 'customer.subscription.deleted': {
      const sub = event.data.object as Stripe.Subscription
      await supabase.from('profiles').update({
        plan: 'free',
        stripe_subscription_id: null,
      }).eq('stripe_subscription_id', sub.id)
      break
    }

    case 'customer.subscription.updated': {
      const sub = event.data.object as Stripe.Subscription
      const isActive = sub.status === 'active'
      await supabase.from('profiles').update({
        plan: isActive ? 'pro' : 'free',
      }).eq('stripe_subscription_id', sub.id)
      break
    }
  }

  return NextResponse.json({ received: true })
}
