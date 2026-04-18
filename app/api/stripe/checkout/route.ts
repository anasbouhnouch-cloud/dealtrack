import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { stripe } from '@/lib/stripe'
import type { Currency } from '@/lib/currency'

const VALID_CURRENCIES: Currency[] = ['USD', 'EUR', 'GBP']

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    // Parse optional currency from request body (sent by CheckoutButton)
    let currency: Currency = 'USD'
    try {
      const body = await request.json()
      if (VALID_CURRENCIES.includes(body.currency)) currency = body.currency
    } catch { /* no body or invalid JSON — default to USD */ }

    // In production always use the canonical domain so the Stripe redirect
    // lands on dealtrackapp.com, never on a Vercel preview URL.
    const appUrl = process.env.NODE_ENV === 'development'
      ? (process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000')
      : 'https://dealtrackapp.com'

    const { data: profile } = await supabase
      .from('profiles')
      .select('stripe_customer_id, email')
      .eq('id', user.id)
      .single()

    let customerId = profile?.stripe_customer_id

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: { supabase_user_id: user.id },
      })
      customerId = customer.id
      await supabase.from('profiles').update({ stripe_customer_id: customerId }).eq('id', user.id)
    }

    // Pick the price ID for the detected currency if configured, else fall back to USD price.
    // To enable EUR/GBP billing: set STRIPE_PRO_PRICE_ID_EUR / STRIPE_PRO_PRICE_ID_GBP in env.
    const priceId =
      (currency === 'EUR' && process.env.STRIPE_PRO_PRICE_ID_EUR) ||
      (currency === 'GBP' && process.env.STRIPE_PRO_PRICE_ID_GBP) ||
      process.env.STRIPE_PRO_PRICE_ID!

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      mode: 'subscription',
      success_url: `${appUrl}/dashboard?upgraded=1`,
      cancel_url: `${appUrl}/upgrade`,
      metadata: { user_id: user.id, currency },
    })

    if (!session.url) {
      return NextResponse.json({ error: 'Failed to create checkout session' }, { status: 500 })
    }

    return NextResponse.json({ url: session.url })
  } catch (err) {
    console.error('Stripe checkout error:', err)
    return NextResponse.json({ error: 'Failed to create checkout session. Please try again.' }, { status: 500 })
  }
}
