'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function ResetPasswordPage() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (password !== confirm) {
      setError('Passwords do not match.')
      return
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }
    setError('')
    setLoading(true)
    const supabase = createClient()
    const { error } = await supabase.auth.updateUser({ password })
    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      router.push('/dashboard')
      router.refresh()
    }
  }

  const inputClass = 'w-full bg-[#0A0A0A] border border-white/[0.08] rounded-lg px-3 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/40 transition-all duration-200'
  const labelClass = 'block text-sm font-medium text-zinc-400 mb-1.5'

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Link href="/" className="text-xl font-bold tracking-tight">
            <span className="text-white">Deal</span><span className="text-[#7C3AED]">Track</span>
          </Link>
          <p className="text-sm text-zinc-500 mt-1.5">Choose a new password</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-[#111111] border border-white/[0.08] rounded-xl p-6 space-y-4">
          {error && (
            <div className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
              {error}
            </div>
          )}
          <div>
            <label className={labelClass}>New password</label>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={e => setPassword(e.target.value)}
              className={inputClass}
              placeholder="••••••••"
            />
          </div>
          <div>
            <label className={labelClass}>Confirm password</label>
            <input
              type="password"
              required
              minLength={6}
              value={confirm}
              onChange={e => setConfirm(e.target.value)}
              className={inputClass}
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-violet-600 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-violet-700 transition-all duration-200 disabled:opacity-50"
          >
            {loading ? 'Updating…' : 'Set new password'}
          </button>
        </form>
      </div>
    </div>
  )
}
