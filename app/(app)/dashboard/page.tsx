import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Plus, TrendingUp, Clock, AlertCircle, CheckCircle2 } from 'lucide-react'
import { formatCurrency, formatDate, daysUntil, isOverdue, statusColor, statusLabel } from '@/lib/utils'
import { Deal } from '@/types'
import { startOfMonth, endOfMonth } from 'date-fns'

function StatCard({ title, value, sub, icon }: { title: string; value: string; sub?: string; icon: React.ReactNode }) {
  return (
    <div className="bg-white border border-zinc-200 rounded-xl p-5">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm text-zinc-500">{title}</span>
        <span className="text-zinc-400">{icon}</span>
      </div>
      <div className="text-2xl font-bold text-zinc-900">{value}</div>
      {sub && <div className="text-xs text-zinc-400 mt-1">{sub}</div>}
    </div>
  )
}

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: deals } = await supabase
    .from('deals')
    .select('*')
    .eq('user_id', user!.id)
    .order('created_at', { ascending: false })

  const allDeals: Deal[] = deals ?? []
  const now = new Date()
  const monthStart = startOfMonth(now).toISOString().split('T')[0]
  const monthEnd = endOfMonth(now).toISOString().split('T')[0]

  // Financial summary (USD only for simplicity — group by currency)
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
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-zinc-900">Dashboard</h1>
        <Link
          href="/deals/new"
          className="flex items-center gap-1.5 bg-zinc-900 text-white text-sm px-3 py-2 rounded-lg hover:bg-zinc-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          New deal
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
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
          title="Overdue payments"
          value={String(overdueDeals.length)}
          sub={overdueDeals.length > 0 ? 'needs follow-up' : 'all good'}
          icon={<AlertCircle className="w-4 h-4" />}
        />
      </div>

      {/* Urgent / Overdue alerts */}
      {(urgentDeals.length > 0 || overdueDeals.length > 0) && (
        <div className="mb-6 space-y-2">
          {urgentDeals.map(deal => (
            <Link
              key={deal.id}
              href={`/deals/${deal.id}`}
              className="flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 hover:bg-amber-100 transition-colors"
            >
              <Clock className="w-4 h-4 text-amber-600 shrink-0" />
              <span className="text-sm text-amber-800">
                <strong>{deal.brand_name}</strong> delivery due in <strong>{daysUntil(deal.delivery_deadline)} days</strong> — {formatDate(deal.delivery_deadline)}
              </span>
            </Link>
          ))}
          {overdueDeals.map(deal => (
            <Link
              key={deal.id}
              href={`/deals/${deal.id}`}
              className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-lg px-4 py-3 hover:bg-red-100 transition-colors"
            >
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              <span className="text-sm text-red-800">
                <strong>{deal.brand_name}</strong> payment overdue — was due {formatDate(deal.payment_deadline)}
              </span>
            </Link>
          ))}
        </div>
      )}

      {/* Active deals list */}
      <div>
        <h2 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider mb-3">Active deals</h2>
        {activeDeals.length === 0 ? (
          <div className="text-center py-16 bg-white border border-zinc-200 rounded-xl">
            <p className="text-zinc-400 text-sm mb-3">No active deals yet</p>
            <Link href="/deals/new" className="text-sm text-zinc-900 font-medium hover:underline">
              Add your first deal →
            </Link>
          </div>
        ) : (
          <div className="space-y-2">
            {activeDeals.map(deal => (
              <Link
                key={deal.id}
                href={`/deals/${deal.id}`}
                className="flex items-center gap-4 bg-white border border-zinc-200 rounded-xl px-4 py-3.5 hover:border-zinc-300 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="font-medium text-zinc-900 text-sm truncate">{deal.brand_name}</span>
                    <span className="text-xs text-zinc-400">{deal.platform}</span>
                  </div>
                  <div className="text-xs text-zinc-400">
                    Delivery: {formatDate(deal.delivery_deadline)}
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="font-semibold text-zinc-900 text-sm">{formatCurrency(deal.amount, deal.currency)}</div>
                  <span className={`text-xs border px-2 py-0.5 rounded-full ${statusColor(deal.status)}`}>
                    {statusLabel(deal.status)}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
