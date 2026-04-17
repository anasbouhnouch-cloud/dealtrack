export const metadata = { title: 'Privacy Policy — DealTrack' }

const EFFECTIVE = 'January 1, 2025'
const CONTACT_EMAIL = 'privacy@dealtrackapp.com'

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-20">
      <div className="mb-12">
        <h1 className="text-4xl font-bold tracking-tight text-zinc-100 mb-3">Privacy Policy</h1>
        <p className="text-sm text-zinc-600">Effective date: {EFFECTIVE}</p>
      </div>

      <div className="space-y-10 text-zinc-400 leading-relaxed">

        <section>
          <h2 className="text-lg font-semibold text-zinc-200 mb-3">1. Who we are</h2>
          <p>
            DealTrack ("we", "our", "us") is a sponsorship deal tracking tool for content creators. We are the data controller for the personal data described in this policy. You can contact us at{' '}
            <a href={`mailto:${CONTACT_EMAIL}`} className="text-violet-400 hover:underline">{CONTACT_EMAIL}</a>.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-zinc-200 mb-3">2. Data we collect</h2>
          <p className="mb-3">We collect the following personal data when you use DealTrack:</p>
          <ul className="space-y-2 pl-4">
            {[
              'Account data: your name and email address, provided when you register.',
              'Deal data: brand names, amounts, platforms, deadlines, and notes you enter.',
              'Payment data: handled by Stripe. We store only a Stripe customer ID — no card numbers.',
              'Usage data: pages visited and actions taken, collected via server logs for security and debugging.',
              'Communications: if you contact us, we retain that correspondence.',
            ].map(item => (
              <li key={item} className="flex items-start gap-2 text-sm">
                <span className="text-violet-500 mt-0.5 shrink-0">→</span>
                {item}
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-zinc-200 mb-3">3. How we use your data</h2>
          <p className="mb-3">We use your data to:</p>
          <ul className="space-y-2 pl-4">
            {[
              'Provide, maintain, and improve the DealTrack service.',
              'Send transactional emails: account confirmation, password reset, and deal reminders (Pro plan only).',
              'Process payments through Stripe.',
              'Respond to support requests.',
              'Comply with legal obligations.',
            ].map(item => (
              <li key={item} className="flex items-start gap-2 text-sm">
                <span className="text-violet-500 mt-0.5 shrink-0">→</span>
                {item}
              </li>
            ))}
          </ul>
          <p className="mt-3 text-sm">
            We do not sell your data to third parties. We do not use your data for advertising.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-zinc-200 mb-3">4. Legal basis (GDPR)</h2>
          <p className="mb-3">If you are in the European Economic Area (EEA), we process your data under the following legal bases:</p>
          <ul className="space-y-2 pl-4">
            {[
              'Contract performance: to provide the service you signed up for.',
              'Legitimate interests: to improve our service and prevent fraud.',
              'Legal obligation: to comply with applicable laws.',
              'Consent: for optional email communications (you may withdraw consent at any time).',
            ].map(item => (
              <li key={item} className="flex items-start gap-2 text-sm">
                <span className="text-violet-500 mt-0.5 shrink-0">→</span>
                {item}
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-zinc-200 mb-3">5. Data retention</h2>
          <p>
            We retain your account and deal data for as long as your account is active. If you delete your account, we will delete your personal data within 30 days, except where we are required to retain it by law.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-zinc-200 mb-3">6. Third-party services</h2>
          <p className="mb-3">We use the following sub-processors:</p>
          <div className="space-y-2">
            {[
              { name: 'Supabase', purpose: 'Database and authentication', location: 'EU / US' },
              { name: 'Stripe', purpose: 'Payment processing', location: 'US' },
              { name: 'Resend', purpose: 'Transactional email', location: 'US' },
              { name: 'Vercel', purpose: 'Hosting and CDN', location: 'EU / US' },
            ].map(s => (
              <div key={s.name} className="flex items-center gap-4 text-sm bg-[#111111] border border-white/[0.06] rounded-lg px-4 py-3">
                <span className="font-medium text-zinc-300 w-20 shrink-0">{s.name}</span>
                <span className="text-zinc-500 flex-1">{s.purpose}</span>
                <span className="text-zinc-600">{s.location}</span>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-zinc-200 mb-3">7. Cookies</h2>
          <p>
            DealTrack uses only essential cookies required for authentication (session management). We do not use tracking or advertising cookies. No cookie consent banner is required.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-zinc-200 mb-3">8. Your rights (GDPR)</h2>
          <p className="mb-3">If you are in the EEA, you have the right to:</p>
          <ul className="space-y-2 pl-4">
            {[
              'Access the personal data we hold about you.',
              'Rectify inaccurate data.',
              'Erase your data ("right to be forgotten").',
              'Restrict or object to processing.',
              'Data portability — receive your data in a machine-readable format.',
              'Withdraw consent at any time without affecting prior processing.',
              'Lodge a complaint with your local data protection authority.',
            ].map(item => (
              <li key={item} className="flex items-start gap-2 text-sm">
                <span className="text-violet-500 mt-0.5 shrink-0">→</span>
                {item}
              </li>
            ))}
          </ul>
          <p className="mt-3 text-sm">
            To exercise any of these rights, email us at{' '}
            <a href={`mailto:${CONTACT_EMAIL}`} className="text-violet-400 hover:underline">{CONTACT_EMAIL}</a>.
            We will respond within 30 days.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-zinc-200 mb-3">9. Security</h2>
          <p>
            We use row-level security so each user can only access their own data. Data is encrypted in transit (TLS) and at rest. We apply the principle of least privilege to all internal access.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-zinc-200 mb-3">10. Changes to this policy</h2>
          <p>
            We may update this policy from time to time. We will notify you of material changes by email or via an in-app notice. The effective date at the top of this page will always reflect the latest version.
          </p>
        </section>

        <div className="border-t border-white/[0.06] pt-8 text-sm text-zinc-600">
          Questions? Contact us at{' '}
          <a href={`mailto:${CONTACT_EMAIL}`} className="text-violet-400 hover:underline">{CONTACT_EMAIL}</a>
        </div>
      </div>
    </div>
  )
}
