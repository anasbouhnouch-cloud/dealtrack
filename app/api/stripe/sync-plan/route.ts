import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { stripe } from '@/lib/stripe'

/**
 * POST /api/stripe/sync-plan
 *
 * Manual fallback for when the webhook hasn't fired yet.
 * Called from the dashboard when ?upgraded=1 is present.
 * Queries Stripe directly for active subscriptions and updates
 * the user's plan in Supabase if one is found.
 */
export async function POST() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { data: profile } = await supabase
      .from('profiles')
      .select('stripe_customer_id, plan')
      .eq('id', user.id)
      .single()

    // Already on pro — nothing to do
    if (profile?.plan === 'pro') {
      return NextResponse.json({ plan: 'pro', updated: false })
    }

    // No Stripe customer yet — can't check
    if (!profile?.stripe_customer_id) {
      return NextResponse.json({ plan: 'free', updated: false })
    }

    // Ask Stripe for any active or trialing subscriptions
    const subscriptions = await stripe.subscriptions.list({
      customer: profile.stripe_customer_id,
      status: 'active',
      limit: 1,
    })

    if (subscriptions.data.length === 0) {
      // Also check trialing
      const trialing = await stripe.subscriptions.list({
        customer: profile.stripe_customer_id,
        status: 'trialing',
        limit: 1,
      })
      if (trialing.data.length === 0) {
        return NextResponse.json({ plan: 'free', updated: false })
      }
      subscriptions.data.push(...trialing.data)
    }

    const sub = subscriptions.data[0]

    // Use admin client to bypass RLS and update the plan
    const admin = createAdminClient()
    const { error } = await admin
      .from('profiles')
      .update({ plan: 'pro', stripe_subscription_id: sub.id })
      .eq('id', user.id)

    if (error) {
      console.error('[sync-plan] Failed to update plan:', error)
      return NextResponse.json({ error: 'DB update failed' }, { status: 500 })
    }

    console.log(`[sync-plan] User ${user.id} synced to pro (sub: ${sub.id})`)
    return NextResponse.json({ plan: 'pro', updated: true })
  } catch (err) {
    console.error('[sync-plan] Error:', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
