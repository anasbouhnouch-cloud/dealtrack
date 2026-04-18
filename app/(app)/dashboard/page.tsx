import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Plus, TrendingUp, Clock, AlertCircle, CheckCircle2, Sparkles } from 'lucide-react'
import { formatCurrency, formatDate, daysUntil, isOverdue, statusColor, statusLabel } from '@/lib/utils'
import { Deal } from '@/types'
import { startOfMonth, endOfMonth } from 'date-fns'
import ReferralCard from '@/components/ReferralCard'
import OnboardingGuide from '@/components/OnboardingGuide'

function StatCard({ title, value, sub, icon }: { title: string; value: string; sub?: string; icon: React.ReactNode }) {
  return (
    <div className="bg-[#111111] border border-white/[0.08] rounded-xl p-5 hover:border-white/[0.12] transition-all duration-200">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs text-zinc-500 uppercase tracking-wider font-medium">{title}</span>
        <span className="text-zinc-600">{icon}</span>
      </div>
      <div className="text-2xl font-bold text-zinc-100">{value}</div>
      {sub && <div className="text-xs text-zinc-600 mt-1">{sub}</div>}
    </div>
  )
}

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const params = await searchParams
  const upgraded = params.upgraded === '1'

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: deals } = await supabase
    .from('deals')
    .select('*')
    .eq('user_id', user!.id)
    .order('created_at', { ascending: false })

  const { data: referrals } = await supabase
    .from('referrals')
    .select('id')
    .eq('referrer_id', user!.id)

  const allDeals: Deal[] = deals ?? []
  const referralCount = referrals?.length ?? 0
  const now = new Date()
  const monthStart = startOfMonth(now).toISOString().split('T')[0]
  const monthEnd = endOfMonth(now).toISOString().split('T')[0]

  const earnedThisMonth = allDeals
    .filter(d => d.status === 'paid' && d.payment_deadline >= monthStart && d.payment_deadline <= monthEnd)
    .reduce((sum, d) => sum + Number(d.amount), 0)

  const owedThisMonth = allDeals
    .filter(d => ['confirmed', 'delivered'].includes(d.status) && d.payment_deadline >= monthStart && d.payment_deadline <= monthEnd)
    .reduce((sum, d) => sum + Number(d.amount), 0)

  const activeDeals = allDeals.filter(d => d.status !== 'paid')
  const urgentDeals = activeDeals.filter(d => {
    const days = daysUntil(d.delivery_deadline)
    return days >= 0 && days <= 7
  })
  const overdueDeals = activeDeals.filter(d => isOverdue(d.payment_deadline))

  return (
    <div>
      <div className="flex items-center justify-between mb-7">
        <h1 className="text-xl font-bold text-zinc-100">Dashboard</h1>
        <Link
          href="/deals/new"
          className="flex items-center gap-1.5 bg-violet-600 text-white text-sm px-3.5 py-2 rounded-lg hover:bg-violet-700 transition-all duration-200 font-medium"
        >
          <Plus className="w-4 h-4" />
          New deal
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-7">
        <StatCard
          title="Active deals"
          value={String(activeDeals.length)}
          icon={<TrendingUp className="w-4 h-4" />}
        />
        <StatCard
          title="Earned this month"
          value={earnedThisMonth > 0 ? formatCurrency(earnedThisMonth, 'USD') : '—'}
          sub="paid deals"
          icon={<CheckCircle2 className="w-4 h-4" />}
        />
        <StatCard
          title="Owed this month"
          value={owedThisMonth > 0 ? formatCurrency(owedThisMonth, 'USD') : '—'}
          sub="pending payment"
          icon={<Clock className="w-4 h-4" />}
        />
        <StatCard
          title="Overdue"
          value={String(overdueDeals.length)}
          sub={overdueDeals.length > 0 ? 'needs follow-up' : 'all good'}
          icon={<AlertCircle className="w-4 h-4" />}
        />
      </div>

      {/* Alerts */}
      {(urgentDeals.length > 0 || overdueDeals.length > 0) && (
        <div className="mb-6 space-y-2">
          {urgentDeals.map(deal => (
            <Link
              key={deal.id}
              href={`/deals/${deal.id}`}
              className="flex items-center gap-3 bg-amber-500/10 border border-amber-500/20 rounded-lg px-4 py-3 hover:bg-amber-500/15 transition-all duration-200"
            >
              <Clock className="w-4 h-4 text-amber-400 shrink-0" />
              <span className="text-sm text-amber-300">
                <strong>{deal.brand_name}</strong> delivery due in <strong>{daysUntil(deal.delivery_deadline)} days</strong> — {formatDate(deal.delivery_deadline)}
              </span>
            </Link>
          ))}
          {overdueDeals.map(deal => (
            <Link
              key={deal.id}
              href={`/deals/${deal.id}`}
              className="flex items-center gap-3 bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3 hover:bg-red-500/15 transition-all duration-200"
            >
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span className="text-sm text-red-300">
                <strong>{deal.brand_name}</strong> payment overdue — was due {formatDate(deal.payment_deadline)}
              </span>
            </Link>
          ))}
        </div>
      )}

      {/* Referral */}
      <div className="mb-6">
        <ReferralCard userId={user!.id} referralCount={referralCount} />
      </div>

      {/* Active deals list */}
      <div>
        <h2 className="text-xs font-semibold text-zinc-600 uppercase tracking-wider mb-3">Active deals</h2>
        {activeDeals.length === 0 ? (
          <div className="text-center py-16 bg-[#111111] border border-white/[0.08] rounded-xl">
            <p className="text-zinc-600 text-sm mb-3">No active deals yet</p>
            <Link href="/deals/new" className="text-sm text-violet-400 font-medium hover:text-violet-300 transition-colors">
              Add your first deal →
            </Link>
          </div>
        ) : (
          <div className="space-y-1.5">
            {activeDeals.map(deal => (
              <Link
                key={deal.id}
                href={`/deals/${deal.id}`}
                className="flex items-center gap-4 bg-[#111111] border border-white/[0.08] rounded-xl px-4 py-3.5 hover:border-white/[0.15] hover:bg-[#141414] transition-all duration-200"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="font-medium text-zinc-100 text-sm truncate">{deal.brand_name}</span>
                    <span className="text-xs text-zinc-600">{deal.platform}</span>
                  </div>
                  <div className="text-xs text-zinc-600">
                    Delivery: {formatDate(deal.delivery_deadline)}
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="font-semibold text-zinc-100 text-sm mb-1">{formatCurrency(deal.amount, deal.currency)}</div>
                  <span className={`text-xs border px-2 py-0.5 rounded-full ${statusColor(deal.status)}`}>
                    {statusLabel(deal.status)}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Onboarding — shows for new users with no deals, dismissed via localStorage */}
      <OnboardingGuide show={allDeals.length === 0} />
    </div>
  )
}
