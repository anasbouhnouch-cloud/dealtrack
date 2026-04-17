'use client'

import { useState } from 'react'
import { Copy, Check, Users } from 'lucide-react'

interface ReferralCardProps {
  userId: string
  referralCount: number
}

export default function ReferralCard({ userId, referralCount }: ReferralCardProps) {
  const [copied, setCopied] = useState(false)

  const referralUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/signup?ref=${userId}`
    : `/signup?ref=${userId}`

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(referralUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // fallback: select the input
    }
  }

  return (
    <div className="bg-[#111111] border border-white/[0.08] rounded-xl p-5">
      <div className="flex items-center gap-2 mb-1">
        <Users className="w-4 h-4 text-violet-400" />
        <h2 className="font-semibold text-zinc-200 text-sm">Refer a friend</h2>
        {referralCount > 0 && (
          <span className="ml-auto text-xs text-violet-400 bg-violet-500/10 border border-violet-500/20 px-2 py-0.5 rounded-full">
            {referralCount} referral{referralCount !== 1 ? 's' : ''}
          </span>
        )}
      </div>
      <p className="text-xs text-zinc-500 mb-4 leading-relaxed">
        Share your link — your friend gets <strong className="text-zinc-400">1 free Pro month</strong> and so do you when they subscribe.
      </p>

      <div className="flex items-center gap-2">
        <div className="flex-1 min-w-0 bg-[#0A0A0A] border border-white/[0.08] rounded-lg px-3 py-2 text-xs text-zinc-500 truncate font-mono">
          {referralUrl}
        </div>
        <button
          onClick={handleCopy}
          className={`shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 ${
            copied
              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
              : 'bg-violet-600 text-white hover:bg-violet-700'
          }`}
        >
          {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>

      {referralCount > 0 && (
        <p className="text-xs text-zinc-600 mt-3">
          Rewards are applied manually within 48 hours of a successful Pro subscription.
        </p>
      )}
    </div>
  )
}
