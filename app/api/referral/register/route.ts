import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function POST(request: Request) {
  try {
    const { referredId, referrerId } = await request.json()

    if (!referredId || !referrerId) {
      return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 })
    }

    // Can't refer yourself
    if (referredId === referrerId) {
      return NextResponse.json({ error: 'Self-referral is not allowed.' }, { status: 400 })
    }

    const supabase = createAdminClient()

    // Check the referrer exists
    const { data: referrer } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', referrerId)
      .single()

    if (!referrer) {
      return NextResponse.json({ error: 'Referrer not found.' }, { status: 404 })
    }

    // Insert referral (unique constraint on referred_id prevents duplicates)
    const { error } = await supabase.from('referrals').insert({
      referrer_id: referrerId,
      referred_id: referredId,
    })

    if (error) {
      // Unique violation = already referred, treat as success
      if (error.code === '23505') return NextResponse.json({ ok: true })
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Update profile with referred_by
    await supabase
      .from('profiles')
      .update({ referred_by: referrerId })
      .eq('id', referredId)

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 })
  }
}
