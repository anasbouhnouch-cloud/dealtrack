import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import DealForm from '@/components/DealForm'

export default async function NewDealPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

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
      <h1 className="text-xl font-bold text-zinc-900 mb-6">New deal</h1>
      <DealForm userId={user.id} plan={plan} activeDealsCount={activeDealsCount} />
    </div>
  )
}
