import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Plus, Lock } from 'lucide-react'
import { formatCurrency, formatDate, statusColor, statusLabel } from '@/lib/utils'
import { Deal } from '@/types'

const FREE_DEAL_LIMIT = 3

export default async function DealsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: profile } = await supabase
    .from('profiles')
    .select('plan')
    .eq('id', user!.id)
    .single()

  const { data: deals } = await supabase
    .from('deals')
    .select('*')
    .eq('user_id', user!.id)
    .order('created_at', { ascending: false })

  const allDeals: Deal[] = deals ?? []
  const plan = profile?.plan ?? 'free'
  const activeDeals = allDeals.filter(d => d.status !== 'paid')
  const atLimit = plan === 'free' && activeDeals.length >= FREE_DEAL_LIMIT

  const statusOrder: Record<string, number> = { negotiating: 0, confirmed: 1, delivered: 2, paid: 3 }
  const sorted = [...allDeals].sort((a, b) => statusOrder[a.status] - statusOrder[b.status])

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-zinc-100">Deals</h1>
        {atLimit ? (
          <Link
            href="/upgrade"
            className="flex items-center gap-1.5 bg-amber-500/10 text-amber-400 border border-amber-500/20 text-sm px-3.5 py-2 rounded-lg hover:bg-amber-500/15 transition-all duration-200 font-medium"
          >
            <Lock className="w-4 h-4" />
            Upgrade for more
          </Link>
        ) : (
          <Link
            href="/deals/new"
            className="flex items-center gap-1.5 bg-violet-600 text-white text-sm px-3.5 py-2 rounded-lg hover:bg-violet-700 transition-all duration-200 font-medium"
          >
            <Plus className="w-4 h-4" />
            New deal
          </Link>
        )}
      </div>

      {plan === 'free' && (
        <div className="mb-4 text-sm text-zinc-500 bg-[#111111] border border-white/[0.08] rounded-lg px-4 py-3">
          Free plan: <strong className="text-zinc-300">{activeDeals.length}/{FREE_DEAL_LIMIT}</strong> active deals used.{' '}
          <Link href="/upgrade" className="text-violet-400 font-medium hover:text-violet-300 transition-colors">
            Upgrade to Pro
          </Link>{' '}
          for unlimited.
        </div>
      )}

      {sorted.length === 0 ? (
        <div className="text-center py-20 bg-[#111111] border border-white/[0.08] rounded-xl">
          <p className="text-zinc-600 text-sm mb-3">No deals yet</p>
          <Link href="/deals/new" className="text-sm text-violet-400 font-medium hover:text-violet-300 transition-colors">
            Create your first deal →
          </Link>
        </div>
      ) : (
        <div className="bg-[#111111] border border-white/[0.08] rounded-xl overflow-hidden">
          <div className="hidden sm:grid grid-cols-[2fr_1fr_1fr_1fr_1fr] gap-4 px-4 py-3 border-b border-white/[0.06] text-xs font-medium text-zinc-600 uppercase tracking-wider">
            <span>Brand</span>
            <span>Amount</span>
            <span>Platform</span>
            <span>Delivery</span>
            <span>Status</span>
          </div>
          {sorted.map((deal, i) => (
            <Link
              key={deal.id}
              href={`/deals/${deal.id}`}
              className={`grid grid-cols-1 sm:grid-cols-[2fr_1fr_1fr_1fr_1fr] gap-2 sm:gap-4 px-4 py-3.5 hover:bg-white/[0.03] transition-all duration-200 ${i !== 0 ? 'border-t border-white/[0.06]' : ''}`}
            >
              <span className="font-medium text-zinc-100 text-sm">{deal.brand_name}</span>
              <span className="text-sm text-zinc-300 font-medium">{formatCurrency(deal.amount, deal.currency)}</span>
              <span className="text-sm text-zinc-500">{deal.platform}</span>
              <span className="text-sm text-zinc-500">{formatDate(deal.delivery_deadline)}</span>
              <span>
                <span className={`text-xs border px-2 py-0.5 rounded-full ${statusColor(deal.status)}`}>
                  {statusLabel(deal.status)}
                </span>
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
