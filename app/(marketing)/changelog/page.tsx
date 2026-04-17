export const metadata = { title: 'Changelog — DealTrack' }

const entries = [
  {
    version: 'v1.3',
    date: 'April 2025',
    tag: 'New',
    tagColor: 'text-violet-400 bg-violet-500/10 border-violet-500/20',
    items: [
      'Animated hero background on landing page — subtle gradient shift and floating particles',
      'Two-tone DealTrack logo across all pages',
      'Premium dark email templates for delivery and payment reminders',
      'Referral program — share your link, both you and your friend get 1 free Pro month',
      'Onboarding guide for new users — 3-step walkthrough on first login',
      'Forgot password and reset password flow',
    ],
  },
  {
    version: 'v1.2',
    date: 'March 2025',
    tag: 'Improvement',
    tagColor: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
    items: [
      'Full premium dark theme redesign — Linear-inspired, #0A0A0A background, violet accent',
      'Redesigned sidebar, mobile nav, and all app pages',
      'Status badges updated for dark backgrounds (amber / blue / violet / emerald)',
      'Smooth hover transitions across all interactive elements',
    ],
  },
  {
    version: 'v1.1',
    date: 'February 2025',
    tag: 'Improvement',
    tagColor: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
    items: [
      'Automatic email reminders 3 days before delivery deadline (Pro)',
      'Automatic payment overdue alerts after 7 days (Pro)',
      'Multi-currency support: USD, EUR, GBP, CAD, AUD',
      'Monthly financial summary on dashboard (earned vs owed)',
      'Upgrade flow with Stripe checkout',
    ],
  },
  {
    version: 'v1.0',
    date: 'January 2025',
    tag: 'Launch',
    tagColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    items: [
      'Initial launch of DealTrack',
      'Deal pipeline: track from negotiating → confirmed → delivered → paid',
      'Support for YouTube, Instagram, TikTok, and more',
      'Free plan (3 active deals) and Pro plan (unlimited)',
      'Dashboard with active deals, overdue alerts, and urgent reminders',
      'Row-level security — your data is always private',
    ],
  },
]

export default function ChangelogPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-20">
      <div className="mb-14">
        <h1 className="text-4xl font-bold tracking-tight text-zinc-100 mb-3">Changelog</h1>
        <p className="text-zinc-500">What's new in DealTrack — improvements, fixes, and new features.</p>
      </div>

      <div className="space-y-12">
        {entries.map((entry) => (
          <div key={entry.version} className="relative pl-6 border-l border-white/[0.08]">
            {/* Timeline dot */}
            <div className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full bg-violet-600 border-2 border-[#0A0A0A]" />

            <div className="flex items-center gap-3 mb-4">
              <span className="text-lg font-bold text-zinc-100">{entry.version}</span>
              <span className={`text-xs font-medium border px-2 py-0.5 rounded-full ${entry.tagColor}`}>
                {entry.tag}
              </span>
              <span className="text-sm text-zinc-600 ml-auto">{entry.date}</span>
            </div>

            <ul className="space-y-2">
              {entry.items.map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-sm text-zinc-400">
                  <span className="text-violet-500 mt-0.5 shrink-0">→</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  )
}
