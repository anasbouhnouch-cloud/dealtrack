'use client'

import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    const supabase = createClient()
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback?next=/reset-password`,
    })
    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      setSent(true)
    }
  }

  const inputClass = 'w-full bg-[#0A0A0A] border border-white/[0.08] rounded-lg px-3 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/40 transition-all duration-200'

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Link href="/" className="text-xl font-bold tracking-tight">
            <span className="text-white">Deal</span><span className="text-[#7C3AED]">Track</span>
          </Link>
          <p className="text-sm text-zinc-500 mt-1.5">Reset your password</p>
        </div>

        {sent ? (
          <div className="bg-[#111111] border border-white/[0.08] rounded-xl p-6 text-center space-y-3">
            <div className="w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto">
              <span className="text-emerald-400 text-lg">✓</span>
            </div>
            <p className="text-sm font-medium text-zinc-200">Check your email</p>
            <p className="text-sm text-zinc-500">
              We sent a password reset link to <span className="text-zinc-300">{email}</span>.
            </p>
            <Link href="/login" className="block text-sm text-violet-400 hover:text-violet-300 transition-colors mt-2">
              Back to sign in
            </Link>
          </div>
        ) : (
          <>
            <form onSubmit={handleSubmit} className="bg-[#111111] border border-white/[0.08] rounded-xl p-6 space-y-4">
              {error && (
                <div className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
                  {error}
                </div>
              )}
              <p className="text-sm text-zinc-500">
                Enter your email and we'll send you a link to reset your password.
              </p>
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1.5">Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className={inputClass}
                  placeholder="you@example.com"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-violet-600 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-violet-700 transition-all duration-200 disabled:opacity-50"
              >
                {loading ? 'Sending…' : 'Send reset link'}
              </button>
            </form>
            <p className="text-center text-sm text-zinc-500 mt-5">
              <Link href="/login" className="text-violet-400 font-medium hover:text-violet-300 transition-colors">
                ← Back to sign in
              </Link>
            </p>
          </>
        )}
      </div>
    </div>
  )
}
