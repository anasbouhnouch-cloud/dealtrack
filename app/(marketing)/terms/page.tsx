export const metadata = { title: 'Terms of Service — DealTrack' }

const EFFECTIVE = 'January 1, 2025'
const CONTACT_EMAIL = 'support.dealtrack@gmail.com'

export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-20">
      <div className="mb-12">
        <h1 className="text-4xl font-bold tracking-tight text-zinc-100 mb-3">Terms of Service</h1>
        <p className="text-sm text-zinc-600">Effective date: {EFFECTIVE}</p>
      </div>

      <div className="space-y-10 text-zinc-400 leading-relaxed">

        <section>
          <h2 className="text-lg font-semibold text-zinc-200 mb-3">1. Acceptance of terms</h2>
          <p>
            By creating an account or using DealTrack ("Service"), you agree to these Terms of Service ("Terms"). If you do not agree, do not use the Service. These Terms form a binding agreement between you and DealTrack.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-zinc-200 mb-3">2. Description of service</h2>
          <p>
            DealTrack is a web application that allows content creators to track sponsorship deals, deadlines, and payments. The Service is provided on a subscription basis with a Free tier and a Pro tier.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-zinc-200 mb-3">3. Account registration</h2>
          <p>
            You must provide accurate and complete information when registering. You are responsible for maintaining the security of your account credentials and for all activity that occurs under your account. Notify us immediately at{' '}
            <a href={`mailto:${CONTACT_EMAIL}`} className="text-violet-400 hover:underline">{CONTACT_EMAIL}</a>{' '}
            if you suspect unauthorised access.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-zinc-200 mb-3">4. Free and Pro plans</h2>
          <ul className="space-y-2 pl-4">
            {[
              'Free plan: limited to 3 active deals. No automatic email reminders.',
              'Pro plan: unlimited active deals, automatic email reminders. Billed monthly at $9/month.',
              'Prices may change with 30 days\' notice to existing subscribers.',
              'All payments are processed by Stripe. By subscribing, you also agree to Stripe\'s terms.',
            ].map(item => (
              <li key={item} className="flex items-start gap-2 text-sm">
                <span className="text-violet-500 mt-0.5 shrink-0">→</span>
                {item}
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-zinc-200 mb-3">5. Cancellation and refunds</h2>
          <p>
            You may cancel your Pro subscription at any time from the Settings page. You will retain Pro access until the end of the current billing period. We do not offer partial refunds for unused time, except where required by applicable law.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-zinc-200 mb-3">6. Referral programme</h2>
          <p>
            DealTrack may offer a referral programme where both the referrer and the referred user receive rewards (such as free Pro months). Rewards are subject to eligibility verification. We reserve the right to modify or terminate the referral programme at any time. Abuse of the referral programme (e.g. self-referrals, fake accounts) will result in account termination.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-zinc-200 mb-3">7. Acceptable use</h2>
          <p className="mb-3">You agree not to:</p>
          <ul className="space-y-2 pl-4">
            {[
              'Use the Service for any illegal purpose.',
              'Attempt to access another user\'s data.',
              'Reverse-engineer, scrape, or copy the Service.',
              'Upload malicious code or interfere with the Service\'s operation.',
              'Resell or sublicense access to the Service.',
            ].map(item => (
              <li key={item} className="flex items-start gap-2 text-sm">
                <span className="text-violet-500 mt-0.5 shrink-0">→</span>
                {item}
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-zinc-200 mb-3">8. Intellectual property</h2>
          <p>
            The DealTrack name, logo, design, and software are owned by DealTrack and protected by intellectual property law. You retain ownership of the deal data you enter. By using the Service, you grant us a limited licence to store and process your data solely to provide the Service.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-zinc-200 mb-3">9. Data and privacy</h2>
          <p>
            Your use of the Service is also governed by our{' '}
            <a href="/privacy" className="text-violet-400 hover:underline">Privacy Policy</a>,
            which is incorporated into these Terms by reference.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-zinc-200 mb-3">10. Disclaimer of warranties</h2>
          <p>
            The Service is provided "as is" without warranty of any kind, express or implied. We do not guarantee that the Service will be uninterrupted, error-free, or that data will never be lost. Use the Service at your own risk.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-zinc-200 mb-3">11. Limitation of liability</h2>
          <p>
            To the maximum extent permitted by law, DealTrack shall not be liable for any indirect, incidental, consequential, or punitive damages, including loss of profits or data, arising from your use of the Service. Our total liability shall not exceed the amount you paid us in the 12 months preceding the claim.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-zinc-200 mb-3">12. Termination</h2>
          <p>
            We may suspend or terminate your account at any time if you breach these Terms. You may delete your account from the Settings page at any time. Upon termination, your data will be deleted in accordance with our Privacy Policy.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-zinc-200 mb-3">13. Governing law</h2>
          <p>
            These Terms are governed by the laws of the jurisdiction in which DealTrack operates, without regard to conflict of law provisions. If you are based in the EU, you may also benefit from mandatory consumer protection provisions of your country.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-zinc-200 mb-3">14. Changes to terms</h2>
          <p>
            We may update these Terms from time to time. We will notify you of material changes by email or in-app notice at least 14 days before they take effect. Continued use after the effective date constitutes acceptance of the updated Terms.
          </p>
        </section>

        <div className="border-t border-white/[0.06] pt-8 text-sm text-zinc-600">
          Questions about these Terms? Contact us at{' '}
          <a href={`mailto:${CONTACT_EMAIL}`} className="text-violet-400 hover:underline">{CONTACT_EMAIL}</a>
        </div>
      </div>
    </div>
  )
}
