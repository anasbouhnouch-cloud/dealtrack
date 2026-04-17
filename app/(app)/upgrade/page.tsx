import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { CheckCircle } from 'lucide-react'
import CheckoutButton from '@/components/CheckoutButton'

export default async function UpgradePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('plan')
    .eq('id', user.id)
    .single()

  if (profile?.plan === 'pro') redirect('/settings')

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-xl font-bold text-zinc-900 mb-2">Upgrade to Pro</h1>
      <p className="text-zinc-500 text-sm mb-8">Unlock unlimited deals and automatic email reminders.</p>

      <div className="bg-white border-2 border-zinc-900 rounded-xl p-7">
        <div className="text-3xl font-bold text-zinc-900 mb-1">
          $9<span className="text-base font-normal text-zinc-400">/month</span>
        </div>
        <p className="text-sm text-zinc-500 mb-6">Cancel anytime</p>
        <ul className="space-y-2.5 text-sm text-zinc-700 mb-7">
          {[
            'Unlimited active deals',
            'Email reminder 3 days before delivery',
            'Email alert when payment is 7+ days overdue',
            'All platforms: YouTube, Instagram, TikTok',
            'Multi-currency support',
          ].map(f => (
            <li key={f} className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-zinc-900 shrink-0" />
              {f}
            </li>
          ))}
        </ul>
        <CheckoutButton />
      </div>
    </div>
  )
}
