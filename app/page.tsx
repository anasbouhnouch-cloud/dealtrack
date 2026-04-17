import Link from 'next/link'
import { CheckCircle, TrendingUp, Bell, Shield, Zap } from 'lucide-react'
import HeroBackground from '@/components/HeroBackground'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-zinc-100">
      {/* Nav */}
      <nav className="border-b border-white/[0.08] sticky top-0 z-50 bg-[#0A0A0A]/80 backdrop-blur-md">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <span className="font-bold text-base tracking-tight">
            <span className="text-white">Deal</span><span className="text-[#7C3AED]">Track</span>
          </span>
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="text-sm text-zinc-400 hover:text-zinc-100 transition-colors duration-200"
            >
              Log in
            </Link>
            <Link
              href="/signup"
              className="text-sm bg-violet-600 text-white px-4 py-1.5 rounded-lg hover:bg-violet-700 transition-all duration-200 font-medium"
            >
              Get started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero — animated background wrapper */}
      <div className="relative overflow-hidden">
        {/* Slow-shifting gradient */}
        <div className="hero-animated-bg absolute inset-0" />
        {/* Floating particles */}
        <HeroBackground />
        {/* Central violet bloom — very faint */}
        <div className="absolute inset-0 flex items-start justify-center pointer-events-none">
          <div
            className="w-[600px] h-[400px] rounded-full mt-[-80px]"
            style={{
              background: 'radial-gradient(ellipse at center, rgba(124,58,237,0.12) 0%, transparent 70%)',
            }}
          />
        </div>
        {/* Fade to solid black at the bottom so the rest of the page blends cleanly */}
        <div className="absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-[#0A0A0A] to-transparent pointer-events-none" />

      <section className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 pt-24 pb-20 text-center">
        <div className="inline-flex items-center gap-2 bg-violet-500/10 text-violet-400 border border-violet-500/20 text-xs font-medium px-3 py-1.5 rounded-full mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-violet-400"></span>
          Free plan available — no credit card required
        </div>
        <h1 className="text-5xl sm:text-6xl font-bold tracking-tight mb-6 leading-[1.08]">
          <span className="bg-gradient-to-r from-white via-zinc-200 to-violet-400 bg-clip-text text-transparent">
            Track your sponsorship deals
          </span>
          <br />
          <span className="bg-gradient-to-r from-zinc-300 to-zinc-500 bg-clip-text text-transparent">
            from pitch to payment
          </span>
        </h1>
        <p className="text-lg text-zinc-400 max-w-xl mx-auto mb-10 leading-relaxed">
          DealTrack keeps content creators on top of every brand deal — deadlines, payments, and reminders — so nothing slips through the cracks.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/signup"
            className="w-full sm:w-auto bg-violet-600 text-white px-7 py-3 rounded-lg font-medium hover:bg-violet-700 transition-all duration-200 shadow-[0_0_30px_rgba(124,58,237,0.3)]"
          >
            Start for free
          </Link>
          <Link
            href="/login"
            className="w-full sm:w-auto border border-white/[0.12] text-zinc-300 px-7 py-3 rounded-lg font-medium hover:bg-white/[0.04] transition-all duration-200"
          >
            Log in
          </Link>
        </div>
      </section>
      </div>{/* end hero animated wrapper */}

      {/* Features */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            {
              icon: <TrendingUp className="w-5 h-5" />,
              title: 'Deal pipeline',
              desc: 'Track every deal from negotiating to paid with clear status indicators across YouTube, Instagram, TikTok, and more.',
            },
            {
              icon: <Bell className="w-5 h-5" />,
              title: 'Automatic reminders',
              desc: 'Get email alerts 3 days before a delivery deadline and when a payment is 7+ days overdue. Never miss a follow-up.',
            },
            {
              icon: <Zap className="w-5 h-5" />,
              title: 'Financial summary',
              desc: 'See your total earned vs. total owed this month at a glance across all currencies.',
            },
            {
              icon: <Shield className="w-5 h-5" />,
              title: 'Secure by default',
              desc: 'Your data is private. Row-level security ensures you only ever see your own deals.',
            },
          ].map((f) => (
            <div
              key={f.title}
              className="border border-white/[0.08] rounded-xl p-6 bg-[#111111] hover:border-violet-500/30 hover:shadow-[0_0_40px_rgba(124,58,237,0.06)] transition-all duration-300 group"
            >
              <div className="w-9 h-9 bg-violet-500/10 border border-violet-500/20 rounded-lg flex items-center justify-center mb-4 text-violet-400 group-hover:bg-violet-500/15 transition-colors duration-300">
                {f.icon}
              </div>
              <h3 className="font-semibold text-zinc-100 mb-2">{f.title}</h3>
              <p className="text-sm text-zinc-500 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-16 border-t border-white/[0.06]">
        <h2 className="text-2xl font-bold text-center text-zinc-100 mb-3">Simple pricing</h2>
        <p className="text-center text-zinc-500 text-sm mb-12">No surprises. Cancel anytime.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-2xl mx-auto">
          {/* Free */}
          <div className="border border-white/[0.08] rounded-xl p-7 bg-[#111111]">
            <div className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-2">Free</div>
            <div className="text-4xl font-bold text-zinc-100 mb-5">$0</div>
            <ul className="space-y-2.5 text-sm text-zinc-400 mb-7">
              {[
                { text: 'Up to 3 active deals', included: true },
                { text: 'All deal fields', included: true },
                { text: 'Financial summary', included: true },
                { text: 'Email reminders', included: false },
              ].map(i => (
                <li key={i.text} className="flex items-center gap-2.5">
                  <CheckCircle className={`w-4 h-4 shrink-0 ${i.included ? 'text-zinc-500' : 'text-zinc-700'}`} />
                  <span className={i.included ? '' : 'text-zinc-600 line-through'}>{i.text}</span>
                </li>
              ))}
            </ul>
            <Link
              href="/signup"
              className="block text-center border border-white/[0.12] text-zinc-300 px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-white/[0.04] transition-all duration-200"
            >
              Get started
            </Link>
          </div>

          {/* Pro */}
          <div className="border border-violet-500/40 rounded-xl p-7 bg-[#111111] relative shadow-[0_0_50px_rgba(124,58,237,0.1)]">
            <div className="absolute -top-3 left-6 bg-violet-600 text-white text-xs px-3 py-0.5 rounded-full font-medium">
              Popular
            </div>
            <div className="text-xs font-medium text-violet-400 uppercase tracking-wider mb-2">Pro</div>
            <div className="text-4xl font-bold text-zinc-100 mb-1">
              $9<span className="text-lg font-normal text-zinc-500">/mo</span>
            </div>
            <p className="text-xs text-zinc-600 mb-5">Cancel anytime</p>
            <ul className="space-y-2.5 text-sm text-zinc-400 mb-7">
              {[
                'Unlimited active deals',
                'All deal fields',
                'Financial summary',
                'Automatic email reminders',
              ].map(i => (
                <li key={i} className="flex items-center gap-2.5">
                  <CheckCircle className="w-4 h-4 text-violet-500 shrink-0" />
                  {i}
                </li>
              ))}
            </ul>
            <Link
              href="/signup"
              className="block text-center bg-violet-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-violet-700 transition-all duration-200"
            >
              Start free trial
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-white/[0.06] py-8 text-center text-sm text-zinc-600">
        © {new Date().getFullYear()} DealTrack
      </footer>
    </div>
  )
}
