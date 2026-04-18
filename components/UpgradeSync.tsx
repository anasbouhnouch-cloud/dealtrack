'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

/**
 * Invisible component mounted on the dashboard when ?upgraded=1 is present.
 * Calls /api/stripe/sync-plan to confirm the subscription with Stripe and
 * update the plan in Supabase, then refreshes the page so the server
 * components re-render with the new plan (sidebar badge, etc.).
 */
export default function UpgradeSync() {
  const router = useRouter()

  useEffect(() => {
    fetch('/api/stripe/sync-plan', { method: 'POST' })
      .then(r => r.json())
      .then(data => {
        if (data.plan === 'pro') {
          // Hard-refresh the server component tree so the sidebar
          // re-reads the plan from Supabase and shows "Pro Plan ✓"
          router.refresh()
        }
      })
      .catch(() => {/* silent — webhook may have already handled it */})
  }, [router])

  return null
}
