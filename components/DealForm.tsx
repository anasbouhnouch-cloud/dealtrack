'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Deal, DealFormData, Platform, Currency, DealStatus } from '@/types'

const PLATFORMS: Platform[] = ['YouTube', 'Instagram', 'TikTok', 'Other']
const CURRENCIES: Currency[] = ['USD', 'EUR', 'GBP', 'CAD', 'AUD']
const STATUSES: DealStatus[] = ['negotiating', 'confirmed', 'delivered', 'paid']

interface DealFormProps {
  deal?: Deal
  userId: string
  plan: string
  activeDealsCount: number
}

export default function DealForm({ deal, userId, plan, activeDealsCount }: DealFormProps) {
  const router = useRouter()
  const isEdit = !!deal

  const [form, setForm] = useState<DealFormData>({
    brand_name: deal?.brand_name ?? '',
    amount: deal?.amount ?? 0,
    currency: deal?.currency ?? 'USD',
    platform: deal?.platform ?? 'YouTube',
    delivery_deadline: deal?.delivery_deadline ?? '',
    payment_deadline: deal?.payment_deadline ?? '',
    status: deal?.status ?? 'negotiating',
    notes: deal?.notes ?? '',
  })

  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const FREE_LIMIT = 3
  const isActiveStatus = (s: DealStatus) => s !== 'paid'
  const wouldExceedLimit = !isEdit && plan === 'free' && isActiveStatus(form.status) && activeDealsCount >= FREE_LIMIT

  function update(field: keyof DealFormData, value: string | number) {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (wouldExceedLimit) return
    setError('')
    setLoading(true)

    const supabase = createClient()
    const payload = { ...form, amount: Number(form.amount) }

    if (isEdit) {
      const { error } = await supabase.from('deals').update(payload).eq('id', deal.id)
      if (error) { setError(error.message); setLoading(false); return }
    } else {
      const { error } = await supabase.from('deals').insert({ ...payload, user_id: userId })
      if (error) { setError(error.message); setLoading(false); return }
    }

    router.push('/deals')
    router.refresh()
  }

  async function handleDelete() {
    if (!isEdit || !confirm(`Delete deal with ${deal.brand_name}? This cannot be undone.`)) return
    setLoading(true)
    const supabase = createClient()
    const { error } = await supabase.from('deals').delete().eq('id', deal.id)
    if (error) { setError(error.message); setLoading(false); return }
    router.push('/deals')
    router.refresh()
  }

  const inputClass = 'w-full bg-[#0A0A0A] border border-white/[0.08] rounded-lg px-3 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/40 transition-all duration-200'
  const labelClass = 'block text-sm font-medium text-zinc-400 mb-1.5'

  return (
    <form onSubmit={handleSubmit} className="bg-[#111111] border border-white/[0.08] rounded-xl p-6 space-y-5 max-w-2xl">
      {error && (
        <div className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
          {error}
        </div>
      )}

      {wouldExceedLimit && (
        <div className="text-sm text-amber-400 bg-amber-500/10 border border-amber-500/20 rounded-lg px-3 py-2">
          Free plan limit reached ({FREE_LIMIT} active deals).{' '}
          <a href="/upgrade" className="font-medium underline hover:text-amber-300 transition-colors">
            Upgrade to Pro
          </a>{' '}
          for unlimited.
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2">
          <label className={labelClass}>Brand name</label>
          <input
            type="text"
            required
            value={form.brand_name}
            onChange={e => update('brand_name', e.target.value)}
            className={inputClass}
            placeholder="Acme Corp"
          />
        </div>

        <div>
          <label className={labelClass}>Amount</label>
          <input
            type="number"
            required
            min={0}
            step={0.01}
            value={form.amount || ''}
            onChange={e => update('amount', e.target.value)}
            className={inputClass}
            placeholder="1000"
          />
        </div>

        <div>
          <label className={labelClass}>Currency</label>
          <select value={form.currency} onChange={e => update('currency', e.target.value)} className={inputClass}>
            {CURRENCIES.map(c => <option key={c}>{c}</option>)}
          </select>
        </div>

        <div>
          <label className={labelClass}>Platform</label>
          <select value={form.platform} onChange={e => update('platform', e.target.value)} className={inputClass}>
            {PLATFORMS.map(p => <option key={p}>{p}</option>)}
          </select>
        </div>

        <div>
          <label className={labelClass}>Status</label>
          <select value={form.status} onChange={e => update('status', e.target.value as DealStatus)} className={inputClass}>
            {STATUSES.map(s => (
              <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
            ))}
          </select>
        </div>

        <div>
          <label className={labelClass}>Delivery deadline</label>
          <input
            type="date"
            required
            value={form.delivery_deadline}
            onChange={e => update('delivery_deadline', e.target.value)}
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass}>Payment deadline</label>
          <input
            type="date"
            required
            value={form.payment_deadline}
            onChange={e => update('payment_deadline', e.target.value)}
            className={inputClass}
          />
        </div>

        <div className="sm:col-span-2">
          <label className={labelClass}>
            Notes <span className="text-zinc-600 font-normal">(optional)</span>
          </label>
          <textarea
            value={form.notes}
            onChange={e => update('notes', e.target.value)}
            className={`${inputClass} resize-none`}
            rows={3}
            placeholder="Contract terms, contact info, etc."
          />
        </div>
      </div>

      <div className="flex items-center gap-3 pt-1">
        <button
          type="submit"
          disabled={loading || wouldExceedLimit}
          className="bg-violet-600 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-violet-700 transition-all duration-200 disabled:opacity-50"
        >
          {loading ? 'Saving…' : isEdit ? 'Save changes' : 'Create deal'}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors duration-200"
        >
          Cancel
        </button>
        {isEdit && (
          <button
            type="button"
            onClick={handleDelete}
            disabled={loading}
            className="ml-auto text-sm text-red-500/70 hover:text-red-400 transition-colors duration-200"
          >
            Delete deal
          </button>
        )}
      </div>
    </form>
  )
}
