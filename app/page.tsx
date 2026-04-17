import Link from 'next/link'
import { CheckCircle, TrendingUp, Bell, Shield } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="border-b border-zinc-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <span className="font-semibold text-lg tracking-tight">DealTrack</span>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm text-zinc-600 hover:text-zinc-900 transition-colors">
              Log in
            </Link>
            <Link
              href="/signup"
              className="text-sm bg-zinc-900 text-white px-4 py-2 rounded-lg hover:bg-zinc-700 transition-colors"
            >
              Get started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 pt-20 pb-16 text-center">
        <div className="inline-flex items-center gap-2 bg-zinc-100 text-zinc-600 text-xs font-medium px-3 py-1 rounded-full mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
          Free plan available — no credit card required
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-zinc-900 mb-5 leading-tight">
          Track your sponsorship deals<br />from pitch to payment
        </h1>
        <p className="text-lg text-zinc-500 max-w-xl mx-auto mb-8">
          DealTrack keeps content creators on top of every brand deal — deadlines, payments, and reminders — so nothing slips through the cracks.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/signup"
            className="w-full sm:w-auto bg-zinc-900 text-white px-6 py-3 rounded-lg font-medium hover:bg-zinc-700 transition-colors"
          >
            Start for free
          </Link>
          <Link
            href="/login"
            className="w-full sm:w-auto border border-zinc-200 text-zinc-700 px-6 py-3 rounded-lg font-medium hover:bg-zinc-50 transition-colors"
          >
            Log in
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
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
              icon: <TrendingUp className="w-5 h-5" />,
              title: 'Financial summary',
              desc: 'See your total earned vs. total owed this month at a glance across all currencies.',
            },
            {
              icon: <Shield className="w-5 h-5" />,
              title: 'Secure by default',
              desc: 'Your data is private. Row-level security ensures you only ever see your own deals.',
            },
          ].map((f) => (
            <div key={f.title} className="border border-zinc-100 rounded-xl p-6">
              <div className="w-9 h-9 bg-zinc-100 rounded-lg flex items-center justify-center mb-4 text-zinc-700">
                {f.icon}
              </div>
              <h3 className="font-semibold text-zinc-900 mb-1">{f.title}</h3>
              <p className="text-sm text-zinc-500 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-16 border-t border-zinc-100">
        <h2 className="text-2xl font-bold text-center text-zinc-900 mb-10">Simple pricing</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
          {/* Free */}
          <div className="border border-zinc-200 rounded-xl p-7">
            <div className="text-sm font-medium text-zinc-500 mb-1">Free</div>
            <div className="text-3xl font-bold text-zinc-900 mb-4">$0</div>
            <ul className="space-y-2 text-sm text-zinc-600 mb-6">
              {['Up to 3 active deals', 'All deal fields', 'Financial summary', 'No email reminders'].map(i => (
                <li key={i} className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-zinc-400 shrink-0" />
                  {i}
                </li>
              ))}
            </ul>
            <Link
              href="/signup"
              className="block text-center border border-zinc-300 text-zinc-700 px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-zinc-50 transition-colors"
            >
              Get started
            </Link>
          </div>

          {/* Pro */}
          <div className="border-2 border-zinc-900 rounded-xl p-7 relative">
            <div className="absolute -top-3 left-6 bg-zinc-900 text-white text-xs px-2.5 py-0.5 rounded-full">Popular</div>
            <div className="text-sm font-medium text-zinc-500 mb-1">Pro</div>
            <div className="text-3xl font-bold text-zinc-900 mb-4">$9<span className="text-base font-normal text-zinc-400">/mo</span></div>
            <ul className="space-y-2 text-sm text-zinc-600 mb-6">
              {['Unlimited active deals', 'All deal fields', 'Financial summary', 'Automatic email reminders'].map(i => (
                <li key={i} className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-zinc-900 shrink-0" />
                  {i}
                </li>
              ))}
            </ul>
            <Link
              href="/signup"
              className="block text-center bg-zinc-900 text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-zinc-700 transition-colors"
            >
              Start free trial
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-zinc-100 py-8 text-center text-sm text-zinc-400">
        © {new Date().getFullYear()} DealTrack
      </footer>
    </div>
  )
}
