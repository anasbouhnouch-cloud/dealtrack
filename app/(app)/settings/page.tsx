import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import CancelSubscriptionButton from '@/components/CancelSubscriptionButton'

export default async function SettingsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  const plan = profile?.plan ?? 'free'

  return (
    <div className="max-w-xl">
      <h1 className="text-xl font-bold text-zinc-100 mb-7">Settings</h1>

      <div className="space-y-4">
        {/* Account */}
        <div className="bg-[#111111] border border-white/[0.08] rounded-xl p-6">
          <h2 className="font-semibold text-zinc-200 mb-5">Account</h2>
          <div className="space-y-4 text-sm">
            <div className="flex justify-between items-center py-2 border-b border-white/[0.06]">
              <span className="text-zinc-500">Email</span>
              <span className="text-zinc-300">{user.email}</span>
            </div>
            <div className="flex justify-between items-center pt-1">
              <span className="text-zinc-500">Name</span>
              <span className="text-zinc-300">{profile?.full_name ?? '—'}</span>
            </div>
          </div>
        </div>

        {/* Subscription */}
        <div className="bg-[#111111] border border-white/[0.08] rounded-xl p-6">
          <h2 className="font-semibold text-zinc-200 mb-5">Subscription</h2>
          <div className="flex items-center justify-between text-sm mb-5">
            <span className="text-zinc-500">Current plan</span>
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
              plan === 'pro'
                ? 'bg-violet-500/15 text-violet-400 border border-violet-500/25'
                : 'bg-white/[0.06] text-zinc-400 border border-white/[0.08]'
            }`}>
              {plan === 'pro' ? 'Pro' : 'Free'}
            </span>
          </div>
          {plan === 'free' ? (
            <Link
              href="/upgrade"
              className="block text-center bg-violet-600 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-violet-700 transition-all duration-200"
            >
              Upgrade to Pro — $9/month
            </Link>
          ) : (
            <CancelSubscriptionButton />
          )}
        </div>
      </div>
    </div>
  )
}
