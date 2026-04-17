'use client'

import { Suspense, useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

function SignupForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const ref = searchParams.get('ref')

  // Redirect already-authenticated users straight to the dashboard
  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) router.replace('/dashboard')
    })
  }, [router])

  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    const supabase = createClient()
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } },
    })
    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      if (ref && data.user) {
        await fetch('/api/referral/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ referredId: data.user.id, referrerId: ref }),
        }).catch(() => {})
      }
      router.push('/dashboard')
      router.refresh()
    }
  }

  const inputClass = 'w-full bg-[#0A0A0A] border border-white/[0.08] rounded-lg px-3 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/40 transition-all duration-200'
  const labelClass = 'block text-sm font-medium text-zinc-400 mb-1.5'

  return (
    <div className="w-full max-w-sm">
      <div className="text-center mb-8">
        <Link href="/" className="text-xl font-bold tracking-tight">
          <span className="text-white">Deal</span><span className="text-[#7C3AED]">Track</span>
        </Link>
        <p className="text-sm text-zinc-500 mt-1.5">Create your account</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-[#111111] border border-white/[0.08] rounded-xl p-6 space-y-4">
        {error && (
          <div className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
            {error}
          </div>
        )}
        <div>
          <label className={labelClass}>Full name</label>
          <input
            type="text"
            required
            value={fullName}
            onChange={e => setFullName(e.target.value)}
            className={inputClass}
            placeholder="Alex Johnson"
          />
        </div>
        <div>
          <label className={labelClass}>Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={e => setEmail(e.target.value)}
            className={inputClass}
            placeholder="you@example.com"
          />
        </div>
        <div>
          <label className={labelClass}>Password</label>
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
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-violet-600 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-violet-700 transition-all duration-200 disabled:opacity-50 mt-1"
        >
          {loading ? 'Creating account…' : 'Create account'}
        </button>
      </form>

      <p className="text-center text-sm text-zinc-500 mt-5">
        Already have an account?{' '}
        <Link href="/login" className="text-violet-400 font-medium hover:text-violet-300 transition-colors">
          Sign in
        </Link>
      </p>
    </div>
  )
}

export default function SignupPage() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center px-4">
      <Suspense fallback={<div className="w-full max-w-sm animate-pulse"><div className="h-8 bg-white/[0.04] rounded-lg mb-8 mx-auto w-32" /><div className="bg-[#111111] border border-white/[0.08] rounded-xl p-6 h-64" /></div>}>
        <SignupForm />
      </Suspense>
    </div>
  )
}
