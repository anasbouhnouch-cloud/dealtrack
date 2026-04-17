import Link from 'next/link'
import { TrendingUp, Bell, Shield, Zap } from 'lucide-react'

export const metadata = { title: 'About — DealTrack' }

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-20">

      {/* Hero */}
      <div className="mb-16">
        <div className="inline-flex items-center gap-2 bg-violet-500/10 text-violet-400 border border-violet-500/20 text-xs font-medium px-3 py-1.5 rounded-full mb-6">
          Our story
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-zinc-100 mb-5 leading-tight">
          Built for creators,<br />
          <span className="bg-gradient-to-r from-violet-400 to-violet-600 bg-clip-text text-transparent">
            by creators
          </span>
        </h1>
        <p className="text-lg text-zinc-400 leading-relaxed max-w-2xl">
          DealTrack was born out of a frustration every content creator knows: tracking sponsorship deals across spreadsheets, email threads, and DMs is a mess. Deadlines slip. Payments get forgotten. Follow-ups never happen.
        </p>
      </div>

      {/* Story */}
      <div className="prose prose-invert max-w-none space-y-6 text-zinc-400 leading-relaxed mb-16">
        <p>
          We built DealTrack to give creators a single, clean place to manage every brand deal — from the first negotiation email to the final payment. No more spreadsheets. No more sticky notes. Just a clear view of every deal and where it stands.
        </p>
        <p>
          DealTrack is intentionally simple. We track what matters: the brand, the amount, the platform, the delivery deadline, and the payment deadline. Add notes, change status as deals progress, and get automatic email reminders before things go wrong.
        </p>
        <p>
          We believe your tools should stay out of your way. DealTrack is fast, focused, and designed to take 30 seconds to update — so you actually use it.
        </p>
      </div>

      {/* Values */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-16">
        {[
          {
            icon: <TrendingUp className="w-4 h-4" />,
            title: 'Simple by design',
            desc: 'Every feature earns its place. We keep DealTrack focused so it stays fast and easy to use.',
          },
          {
            icon: <Bell className="w-4 h-4" />,
            title: 'Proactive, not reactive',
            desc: 'Reminders before deadlines, not after. We help you stay ahead, not catch up.',
          },
          {
            icon: <Shield className="w-4 h-4" />,
            title: 'Privacy first',
            desc: 'Your deals are private. Row-level security means only you ever see your data.',
          },
          {
            icon: <Zap className="w-4 h-4" />,
            title: 'Built to last',
            desc: 'We\'re in this for the long run. DealTrack gets better with every release.',
          },
        ].map(v => (
          <div key={v.title} className="bg-[#111111] border border-white/[0.08] rounded-xl p-5">
            <div className="w-8 h-8 bg-violet-500/10 border border-violet-500/20 rounded-lg flex items-center justify-center mb-3 text-violet-400">
              {v.icon}
            </div>
            <h3 className="font-semibold text-zinc-200 text-sm mb-1">{v.title}</h3>
            <p className="text-sm text-zinc-500 leading-relaxed">{v.desc}</p>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="bg-[#111111] border border-white/[0.08] rounded-xl p-8 text-center">
        <h2 className="text-xl font-bold text-zinc-100 mb-2">Ready to get organised?</h2>
        <p className="text-zinc-500 text-sm mb-6">Start tracking your deals for free. No credit card required.</p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link href="/signup" className="bg-violet-600 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-violet-700 transition-all duration-200">
            Start for free
          </Link>
          <Link href="/contact" className="border border-white/[0.12] text-zinc-300 px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-white/[0.04] transition-all duration-200">
            Get in touch
          </Link>
        </div>
      </div>

    </div>
  )
}
