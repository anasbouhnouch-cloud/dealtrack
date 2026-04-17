'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { LayoutDashboard, Briefcase, Settings, LogOut, Zap } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { cn } from '@/lib/utils'
import { Plan } from '@/types'

interface SidebarProps {
  plan: Plan
}

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/deals', label: 'Deals', icon: Briefcase },
  { href: '/settings', label: 'Settings', icon: Settings },
]

export default function Sidebar({ plan }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()

  async function handleSignOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <aside className="w-56 shrink-0 hidden md:flex flex-col border-r border-zinc-100 bg-white min-h-screen px-3 py-4">
      <div className="px-2 mb-6">
        <span className="font-bold text-zinc-900 text-lg tracking-tight">DealTrack</span>
      </div>

      <nav className="flex-1 space-y-0.5">
        {navItems.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              'flex items-center gap-2.5 px-2 py-2 rounded-lg text-sm transition-colors',
              pathname === href || pathname.startsWith(href + '/')
                ? 'bg-zinc-100 text-zinc-900 font-medium'
                : 'text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50'
            )}
          >
            <Icon className="w-4 h-4 shrink-0" />
            {label}
          </Link>
        ))}
      </nav>

      <div className="space-y-1 border-t border-zinc-100 pt-3 mt-3">
        {plan === 'free' && (
          <Link
            href="/upgrade"
            className="flex items-center gap-2 px-2 py-2 rounded-lg text-sm text-amber-700 bg-amber-50 hover:bg-amber-100 transition-colors font-medium"
          >
            <Zap className="w-4 h-4 shrink-0" />
            Upgrade to Pro
          </Link>
        )}
        {plan === 'pro' && (
          <div className="px-2 py-1.5 flex items-center gap-1.5">
            <span className="text-xs bg-zinc-900 text-white px-1.5 py-0.5 rounded-full font-medium">PRO</span>
          </div>
        )}
        <button
          onClick={handleSignOut}
          className="w-full flex items-center gap-2.5 px-2 py-2 rounded-lg text-sm text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50 transition-colors"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          Sign out
        </button>
      </div>
    </aside>
  )
}
