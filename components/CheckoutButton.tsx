'use client'

import { useState } from 'react'

export default function CheckoutButton() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleCheckout() {
    setLoading(true)
    setError('')
    const res = await fetch('/api/stripe/checkout', { method: 'POST' })
    const data = await res.json()
    if (data.error) { setError(data.error); setLoading(false); return }
    // Redirect to Stripe Checkout URL
    window.location.href = data.url
  }

  return (
    <div>
      {error && <p className="text-sm text-red-600 mb-3">{error}</p>}
      <button
        onClick={handleCheckout}
        disabled={loading}
        className="w-full bg-zinc-900 text-white py-3 rounded-lg text-sm font-medium hover:bg-zinc-700 transition-colors disabled:opacity-50"
      >
        {loading ? 'Loading…' : 'Subscribe for $9/month'}
      </button>
    </div>
  )
}
