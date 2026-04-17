'use client'

import { useState } from 'react'

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  function update(field: string, value: string) {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    const data = await res.json()
    if (!res.ok || data.error) {
      setError(data.error ?? 'Something went wrong. Please try again.')
      setLoading(false)
    } else {
      setSent(true)
    }
  }

  const inputClass = 'w-full bg-[#0A0A0A] border border-white/[0.08] rounded-lg px-3 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/40 transition-all duration-200'
  const labelClass = 'block text-sm font-medium text-zinc-400 mb-1.5'

  return (
    <div className="max-w-xl mx-auto px-4 sm:px-6 py-20">
      <div className="mb-12">
        <h1 className="text-4xl font-bold tracking-tight text-zinc-100 mb-3">Contact us</h1>
        <p className="text-zinc-500">Have a question or feedback? We'd love to hear from you.</p>
      </div>

      {sent ? (
        <div className="bg-[#111111] border border-white/[0.08] rounded-xl p-8 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto">
            <span className="text-emerald-400 text-xl">✓</span>
          </div>
          <p className="font-semibold text-zinc-200">Message sent!</p>
          <p className="text-sm text-zinc-500">Thanks for reaching out. We'll get back to you within 1–2 business days.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-[#111111] border border-white/[0.08] rounded-xl p-6 space-y-4">
          {error && (
            <div className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
              {error}
            </div>
          )}
          <div>
            <label className={labelClass}>Your name</label>
            <input
              type="text"
              required
              value={form.name}
              onChange={e => update('name', e.target.value)}
              className={inputClass}
              placeholder="Alex Johnson"
            />
          </div>
          <div>
            <label className={labelClass}>Email address</label>
            <input
              type="email"
              required
              value={form.email}
              onChange={e => update('email', e.target.value)}
              className={inputClass}
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className={labelClass}>Message</label>
            <textarea
              required
              value={form.message}
              onChange={e => update('message', e.target.value)}
              className={`${inputClass} resize-none`}
              rows={5}
              placeholder="What can we help you with?"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-violet-600 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-violet-700 transition-all duration-200 disabled:opacity-50"
          >
            {loading ? 'Sending…' : 'Send message'}
          </button>
        </form>
      )}

      <p className="text-center text-sm text-zinc-600 mt-6">
        You can also email us directly at{' '}
        <a href="mailto:support.dealtrack@gmail.com" className="text-violet-400 hover:text-violet-300 transition-colors">
          support.dealtrack@gmail.com
        </a>
      </p>
    </div>
  )
}
