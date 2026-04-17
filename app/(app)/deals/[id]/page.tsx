import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import DealForm from '@/components/DealForm'
import { Deal } from '@/types'

export default async function EditDealPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: deal } = await supabase
    .from('deals')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (!deal) notFound()

  const { data: profile } = await supabase
    .from('profiles')
    .select('plan')
    .eq('id', user.id)
    .single()

  const { data: activeDeals } = await supabase
    .from('deals')
    .select('id')
    .eq('user_id', user.id)
    .neq('status', 'paid')

  const plan = profile?.plan ?? 'free'
  const activeDealsCount = activeDeals?.length ?? 0

  return (
    <div>
      <h1 className="text-xl font-bold text-zinc-100 mb-6">Edit deal</h1>
      <DealForm deal={deal as Deal} userId={user.id} plan={plan} activeDealsCount={activeDealsCount} />
    </div>
  )
}
