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
    <aside className="w-56 shrink-0 hidden md:flex flex-col border-r border-white/[0.08] bg-[#0A0A0A] min-h-screen px-3 py-4">
      <div className="px-2 mb-7">
        <span className="font-bold text-base tracking-tight">
          <span className="text-white">Deal</span><span className="text-[#7C3AED]">Track</span>
        </span>
      </div>

      <nav className="flex-1 space-y-0.5">
        {navItems.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              'flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm transition-all duration-200',
              pathname === href || pathname.startsWith(href + '/')
                ? 'bg-white/[0.08] text-zinc-100 font-medium'
                : 'text-zinc-500 hover:text-zinc-200 hover:bg-white/[0.04]'
            )}
          >
            <Icon className="w-4 h-4 shrink-0" />
            {label}
          </Link>
        ))}
      </nav>

      <div className="space-y-1 border-t border-white/[0.08] pt-3 mt-3">
        {plan === 'free' && (
          <Link
            href="/upgrade"
            className="flex items-center gap-2 px-2.5 py-2 rounded-lg text-sm text-violet-400 bg-violet-500/10 hover:bg-violet-500/15 border border-violet-500/20 transition-all duration-200 font-medium"
          >
            <Zap className="w-4 h-4 shrink-0" />
            Upgrade to Pro
          </Link>
        )}
        {plan === 'pro' && (
          <div className="px-2.5 py-1.5 flex items-center gap-1.5">
            <span className="text-xs bg-violet-600 text-white px-2 py-0.5 rounded-full font-medium tracking-wide">
              PRO
            </span>
          </div>
        )}
        <button
          onClick={handleSignOut}
          className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm text-zinc-500 hover:text-zinc-200 hover:bg-white/[0.04] transition-all duration-200"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          Sign out
        </button>
      </div>
    </aside>
  )
}
