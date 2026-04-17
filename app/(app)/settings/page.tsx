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
      <h1 className="text-xl font-bold text-zinc-900 mb-6">Settings</h1>

      <div className="space-y-4">
        {/* Account */}
        <div className="bg-white border border-zinc-200 rounded-xl p-6">
          <h2 className="font-semibold text-zinc-900 mb-4">Account</h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-zinc-500">Email</span>
              <span className="text-zinc-900">{user.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500">Name</span>
              <span className="text-zinc-900">{profile?.full_name ?? '—'}</span>
            </div>
          </div>
        </div>

        {/* Subscription */}
        <div className="bg-white border border-zinc-200 rounded-xl p-6">
          <h2 className="font-semibold text-zinc-900 mb-4">Subscription</h2>
          <div className="flex items-center justify-between text-sm mb-4">
            <span className="text-zinc-500">Current plan</span>
            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${plan === 'pro' ? 'bg-zinc-900 text-white' : 'bg-zinc-100 text-zinc-700'}`}>
              {plan === 'pro' ? 'Pro' : 'Free'}
            </span>
          </div>
          {plan === 'free' ? (
            <Link
              href="/upgrade"
              className="block text-center bg-zinc-900 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-zinc-700 transition-colors"
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
