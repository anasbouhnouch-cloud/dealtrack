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
        <h1 className="text-xl font-bold text-zinc-900">Deals</h1>
        {atLimit ? (
          <Link
            href="/upgrade"
            className="flex items-center gap-1.5 bg-amber-500 text-white text-sm px-3 py-2 rounded-lg hover:bg-amber-600 transition-colors"
          >
            <Lock className="w-4 h-4" />
            Upgrade for more
          </Link>
        ) : (
          <Link
            href="/deals/new"
            className="flex items-center gap-1.5 bg-zinc-900 text-white text-sm px-3 py-2 rounded-lg hover:bg-zinc-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            New deal
          </Link>
        )}
      </div>

      {plan === 'free' && (
        <div className="mb-4 text-sm text-zinc-500 bg-white border border-zinc-200 rounded-lg px-4 py-3">
          Free plan: <strong>{activeDeals.length}/{FREE_DEAL_LIMIT}</strong> active deals used.{' '}
          <Link href="/upgrade" className="text-zinc-900 font-medium hover:underline">Upgrade to Pro</Link> for unlimited.
        </div>
      )}

      {sorted.length === 0 ? (
        <div className="text-center py-20 bg-white border border-zinc-200 rounded-xl">
          <p className="text-zinc-400 text-sm mb-3">No deals yet</p>
          <Link href="/deals/new" className="text-sm text-zinc-900 font-medium hover:underline">
            Create your first deal →
          </Link>
        </div>
      ) : (
        <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden">
          <div className="hidden sm:grid grid-cols-[2fr_1fr_1fr_1fr_1fr] gap-4 px-4 py-2.5 border-b border-zinc-100 text-xs font-medium text-zinc-400 uppercase tracking-wider">
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
              className={`grid grid-cols-1 sm:grid-cols-[2fr_1fr_1fr_1fr_1fr] gap-2 sm:gap-4 px-4 py-3.5 hover:bg-zinc-50 transition-colors ${i !== 0 ? 'border-t border-zinc-100' : ''}`}
            >
              <span className="font-medium text-zinc-900 text-sm">{deal.brand_name}</span>
              <span className="text-sm text-zinc-700 font-medium">{formatCurrency(deal.amount, deal.currency)}</span>
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
