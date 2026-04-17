import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { sendDeliveryReminder, sendPaymentOverdueReminder } from '@/lib/resend'
import { formatDate } from '@/lib/utils'
import { addDays, differenceInDays, parseISO, startOfDay } from 'date-fns'

export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createAdminClient()
  const today = startOfDay(new Date())
  const in3Days = addDays(today, 3).toISOString().split('T')[0]
  const todayStr = today.toISOString().split('T')[0]
  const sevenDaysAgo = addDays(today, -7).toISOString().split('T')[0]

  let sent = 0

  // Delivery reminders: delivery_deadline is exactly 3 days from today
  const { data: deliveryDeals } = await supabase
    .from('deals')
    .select('*, profiles!inner(email, plan)')
    .eq('delivery_deadline', in3Days)
    .in('status', ['confirmed', 'negotiating'])

  for (const deal of deliveryDeals ?? []) {
    const profile = (deal as { profiles: { email: string; plan: string } }).profiles
    if (profile.plan !== 'pro') continue
    try {
      await sendDeliveryReminder(profile.email, deal.brand_name, formatDate(deal.delivery_deadline), 3)
      sent++
    } catch (e) {
      console.error('Delivery reminder failed', e)
    }
  }

  // Payment overdue: payment_deadline was exactly 7 days ago and status is not paid
  const { data: overdueDeals } = await supabase
    .from('deals')
    .select('*, profiles!inner(email, plan)')
    .eq('payment_deadline', sevenDaysAgo)
    .not('status', 'eq', 'paid')

  for (const deal of overdueDeals ?? []) {
    const profile = (deal as { profiles: { email: string; plan: string } }).profiles
    if (profile.plan !== 'pro') continue
    try {
      await sendPaymentOverdueReminder(
        profile.email,
        deal.brand_name,
        deal.amount,
        deal.currency,
        7
      )
      sent++
    } catch (e) {
      console.error('Payment overdue reminder failed', e)
    }
  }

  return NextResponse.json({ sent, timestamp: new Date().toISOString() })
}
