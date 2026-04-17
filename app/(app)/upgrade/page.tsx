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
      <h1 className="text-xl font-bold text-zinc-100 mb-2">Upgrade to Pro</h1>
      <p className="text-zinc-500 text-sm mb-8">Unlock unlimited deals and automatic email reminders.</p>

      <div className="bg-[#111111] border border-violet-500/40 rounded-xl p-7 shadow-[0_0_50px_rgba(124,58,237,0.1)]">
        <div className="text-xs font-medium text-violet-400 uppercase tracking-wider mb-2">Pro</div>
        <div className="text-4xl font-bold text-zinc-100 mb-1">
          $9<span className="text-lg font-normal text-zinc-500">/month</span>
        </div>
        <p className="text-xs text-zinc-600 mb-7">Cancel anytime</p>
        <ul className="space-y-3 text-sm text-zinc-400 mb-7">
          {[
            'Unlimited active deals',
            'Email reminder 3 days before delivery',
            'Email alert when payment is 7+ days overdue',
            'All platforms: YouTube, Instagram, TikTok',
            'Multi-currency support',
          ].map(f => (
            <li key={f} className="flex items-center gap-2.5">
              <CheckCircle className="w-4 h-4 text-violet-500 shrink-0" />
              {f}
            </li>
          ))}
        </ul>
        <CheckoutButton />
      </div>
    </div>
  )
}
