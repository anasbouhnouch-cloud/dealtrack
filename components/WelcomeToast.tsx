'use client'

import { useEffect, useState } from 'react'

/**
 * Mounts invisibly inside the app layout.
 * When the URL contains ?welcome=1 (set by the login page on success),
 * shows a "Welcome back! 👋" toast, cleans the URL without a navigation,
 * then auto-dismisses after 4 seconds.
 *
 * Uses window.location directly (not useSearchParams) so no Suspense
 * boundary is needed and it works in every server-rendered layout.
 */
export default function WelcomeToast() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (params.get('welcome') !== '1') return

    // Show immediately
    setVisible(true)

    // Silently strip ?welcome=1 from the address bar
    const clean = new URL(window.location.href)
    clean.searchParams.delete('welcome')
    window.history.replaceState({}, '', clean.toString())

    // Auto-dismiss
    const t = setTimeout(() => setVisible(false), 4000)
    return () => clearTimeout(t)
  }, [])

  if (!visible) return null

  return (
    <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 bg-[#111111] border border-emerald-500/30 rounded-xl px-4 py-3.5 shadow-2xl shadow-black/60 min-w-[260px] pointer-events-none">
      <div className="w-7 h-7 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
        <span className="text-emerald-400 text-xs font-bold">✓</span>
      </div>
      <p className="text-sm font-semibold text-zinc-100">Welcome back! 👋</p>
    </div>
  )
}
