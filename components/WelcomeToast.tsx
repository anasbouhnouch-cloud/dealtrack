'use client'

import { useEffect, useState } from 'react'

export default function WelcomeToast() {
  // `mounted` keeps the element in the DOM during the exit transition
  const [mounted, setMounted] = useState(true)
  // `shown` drives the CSS transition (opacity + slide)
  const [shown, setShown] = useState(false)

  useEffect(() => {
    // One frame after mount → trigger enter transition
    const enterRaf = requestAnimationFrame(() => setShown(true))

    // After 3 s → trigger exit transition
    const exitTimer = setTimeout(() => setShown(false), 3000)

    // After exit transition finishes (300 ms) → remove from DOM
    const unmountTimer = setTimeout(() => setMounted(false), 3300)

    return () => {
      cancelAnimationFrame(enterRaf)
      clearTimeout(exitTimer)
      clearTimeout(unmountTimer)
    }
  }, [])

  if (!mounted) return null

  return (
    <div
      style={{
        transition: 'opacity 300ms ease, transform 300ms ease',
        opacity: shown ? 1 : 0,
        transform: shown ? 'translateY(0)' : 'translateY(-10px)',
      }}
      className="fixed top-5 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 bg-[#111111] border border-emerald-500/30 rounded-xl px-4 py-3.5 shadow-2xl shadow-black/60 min-w-[260px] pointer-events-none"
    >
      <div className="w-7 h-7 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
        <span className="text-emerald-400 text-xs font-bold">✓</span>
      </div>
      <p className="text-sm font-semibold text-zinc-100">Welcome back! 👋</p>
    </div>
  )
}
