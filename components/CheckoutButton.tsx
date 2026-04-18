'use client'

import { useState } from 'react'

export default function CheckoutButton() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleCheckout() {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/stripe/checkout', { method: 'POST' })
      let data: { url?: string; error?: string }
      try {
        data = await res.json()
      } catch {
        throw new Error('Unexpected server response. Please try again.')
      }
      if (!res.ok || data.error) {
        throw new Error(data.error ?? 'Failed to start checkout. Please try again.')
      }
      if (!data.url) {
        throw new Error('No checkout URL returned. Please try again.')
      }
      window.location.href = data.url
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div>
      {error && (
        <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2 mb-3">
          {error}
        </p>
      )}
      <button
        onClick={handleCheckout}
        disabled={loading}
        className="w-full bg-violet-600 text-white py-3 rounded-lg text-sm font-semibold hover:bg-violet-700 transition-all duration-200 disabled:opacity-50"
      >
        {loading ? 'Redirecting to checkout…' : 'Subscribe for $9/month'}
      </button>
    </div>
  )
}
