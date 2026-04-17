'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { X } from 'lucide-react'

const STORAGE_KEY = 'dt_onboarded'

const STEPS = [
  {
    emoji: '✦',
    title: 'Welcome to DealTrack',
    description:
      'DealTrack helps you manage every sponsorship deal from pitch to payment — deadlines, amounts, statuses, and reminders all in one place.',
    cta: null,
  },
  {
    emoji: '📋',
    title: 'Create your first deal',
    description:
      'Click "New deal" to log a sponsorship. Add the brand name, deal amount, platform, and set delivery and payment deadlines.',
    cta: { label: 'Create a deal', href: '/deals/new' },
  },
  {
    emoji: '🔔',
    title: 'Never miss a deadline',
    description:
      'Your dashboard shows overdue payments and upcoming deliveries at a glance. Upgrade to Pro for automatic email reminders 3 days before delivery and when payments are overdue.',
    cta: null,
  },
]

interface OnboardingGuideProps {
  show: boolean
}

export default function OnboardingGuide({ show }: OnboardingGuideProps) {
  const [visible, setVisible] = useState(false)
  const [step, setStep] = useState(0)

  useEffect(() => {
    if (show && !localStorage.getItem(STORAGE_KEY)) {
      setVisible(true)
    }
  }, [show])

  function dismiss() {
    localStorage.setItem(STORAGE_KEY, '1')
    setVisible(false)
  }

  function next() {
    if (step < STEPS.length - 1) setStep(s => s + 1)
    else dismiss()
  }

  function prev() {
    setStep(s => Math.max(0, s - 1))
  }

  if (!visible) return null

  const current = STEPS[step]
  const isLast = step === STEPS.length - 1

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={dismiss}
      />

      {/* Card */}
      <div className="relative w-full max-w-md bg-[#111111] border border-white/[0.12] rounded-2xl p-6 shadow-2xl shadow-black/50">
        {/* Close */}
        <button
          onClick={dismiss}
          className="absolute top-4 right-4 text-zinc-600 hover:text-zinc-400 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Step dots */}
        <div className="flex items-center gap-1.5 mb-6">
          {STEPS.map((_, i) => (
            <div
              key={i}
              className={`h-1 rounded-full transition-all duration-300 ${
                i === step ? 'w-6 bg-violet-500' : 'w-2 bg-white/[0.12]'
              }`}
            />
          ))}
        </div>

        {/* Content */}
        <div className="mb-8">
          <div className="w-12 h-12 bg-violet-500/10 border border-violet-500/20 rounded-xl flex items-center justify-center mb-4 text-2xl">
            {current.emoji}
          </div>
          <h2 className="text-lg font-bold text-zinc-100 mb-2">{current.title}</h2>
          <p className="text-sm text-zinc-400 leading-relaxed">{current.description}</p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          {step > 0 && (
            <button
              onClick={prev}
              className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors"
            >
              ← Back
            </button>
          )}
          <div className="flex items-center gap-2 ml-auto">
            {current.cta && (
              <Link
                href={current.cta.href}
                onClick={dismiss}
                className="text-sm text-violet-400 hover:text-violet-300 transition-colors font-medium"
              >
                {current.cta.label} →
              </Link>
            )}
            <button
              onClick={next}
              className="bg-violet-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-violet-700 transition-all duration-200"
            >
              {isLast ? 'Get started' : 'Next →'}
            </button>
          </div>
        </div>

        {/* Skip */}
        {!isLast && (
          <button
            onClick={dismiss}
            className="block w-full text-center text-xs text-zinc-700 hover:text-zinc-500 mt-4 transition-colors"
          >
            Skip guide
          </button>
        )}
      </div>
    </div>
  )
}
