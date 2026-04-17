'use client'

import { useState } from 'react'

export default function CancelSubscriptionButton() {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  async function handleCancel() {
    if (!confirm('Cancel your Pro subscription? You will keep access until the end of the billing period.')) return
    setLoading(true)
    const res = await fetch('/api/stripe/cancel', { method: 'POST' })
    const data = await res.json()
    if (data.error) setMessage(data.error)
    else setMessage('Subscription cancelled. You will keep Pro access until the end of the period.')
    setLoading(false)
  }

  return (
    <div>
      {message && (
        <div className="text-sm text-zinc-600 bg-zinc-50 border border-zinc-200 rounded-lg px-3 py-2 mb-3">
          {message}
        </div>
      )}
      <button
        onClick={handleCancel}
        disabled={loading}
        className="text-sm text-red-500 hover:text-red-700 transition-colors disabled:opacity-50"
      >
        {loading ? 'Cancelling…' : 'Cancel subscription'}
      </button>
    </div>
  )
}
