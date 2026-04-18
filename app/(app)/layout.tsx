import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Sidebar from '@/components/Sidebar'
import MobileNav from '@/components/MobileNav'
import WelcomeToast from '@/components/WelcomeToast'

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('plan')
    .eq('id', user.id)
    .single()

  const plan = profile?.plan ?? 'free'

  return (
    <div className="flex min-h-screen bg-[#0A0A0A]">
      <Sidebar plan={plan} />
      <main className="flex-1 px-4 sm:px-8 py-6 pb-24 md:pb-6">
        <div className="max-w-4xl mx-auto">
          {children}
        </div>
      </main>
      <MobileNav />
    </div>
  )
}
