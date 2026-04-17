'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { LayoutDashboard, Briefcase, Settings, LogOut } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/deals', label: 'Deals', icon: Briefcase },
  { href: '/settings', label: 'Settings', icon: Settings },
]

export default function MobileNav() {
  const pathname = usePathname()
  const router = useRouter()

  async function handleSignOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-[#0F0F0F] border-t border-white/[0.08] flex items-center z-50">
      {navItems.map(({ href, label, icon: Icon }) => (
        <Link
          key={href}
          href={href}
          className={cn(
            'flex-1 flex flex-col items-center gap-1 py-3 text-xs transition-colors duration-200',
            pathname === href || pathname.startsWith(href + '/')
              ? 'text-violet-400 font-medium'
              : 'text-zinc-600 hover:text-zinc-400'
          )}
        >
          <Icon className="w-5 h-5" />
          {label}
        </Link>
      ))}
      <button
        onClick={handleSignOut}
        className="flex-1 flex flex-col items-center gap-1 py-3 text-xs text-zinc-600 hover:text-zinc-400 transition-colors duration-200"
      >
        <LogOut className="w-5 h-5" />
        Sign out
      </button>
    </nav>
  )
}
