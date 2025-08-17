import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Privacy Policy | Suitpax",
  description: "How Suitpax collects, uses, and protects your data.",
}

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-white">
      <section className="relative overflow-hidden bg-white">
        <div className="relative mx-auto max-w-3xl px-6 py-12 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-full px-3 py-1">
              <span className="text-[10px] font-medium text-gray-700">Suitpax S.L.</span>
              <span className="text-[10px] text-gray-500">Privacy</span>
            </div>
            <h1 className="mt-4 text-4xl font-medium tracking-tighter text-black">Privacy Policy</h1>
            <p className="mt-2 text-sm text-gray-600">Effective date: 15 March 2025</p>
          </div>

          <div className="mt-8 space-y-8 text-sm text-gray-800">
            <section>
              <h2 className="text-lg font-medium text-gray-900 mb-2">1) Overview</h2>
              <p>We respect your privacy. This policy describes how <strong>Suitpax S.L.</strong> (Av. Fabraquer 21, El Campello‑Muchavista, VC, Spain, 03560) collects, uses, shares, and retains information in connection with our AI‑powered business travel services.</p>
            </section>

            <section>
              <h2 className="text-lg font-medium text-gray-900 mb-2">2) What we collect</h2>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>Account</strong>: name, email, company, role.</li>
                <li><strong>Product data</strong>: prompts, chat logs, preferences, policy settings, usage metrics.</li>
                <li><strong>Travel data</strong>: itineraries, passenger info, loyalty, bookings (via partners).</li>
                <li><strong>Billing</strong>: plan, invoices, payment metadata (processed by payment providers).</li>
                <li><strong>Device</strong>: IP, device, browser, approximate location (for security and analytics).</li>
                <li><strong>Optional voice</strong>: audio you choose to record for voice features.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-medium text-gray-900 mb-2">3) How we use data</h2>
              <ul className="list-disc pl-5 space-y-1">
                <li>Provide and operate the services (search, booking assistance, policy enforcement, analytics).</li>
                <li>Security and abuse prevention (fraud detection, rate limiting, incident response).</li>
                <li>Improve the product (aggregate analytics, experiments, troubleshooting).</li>
                <li>Communications (service notices, account, support). Marketing only with consent.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-medium text-gray-900 mb-2">4) Legal bases (GDPR)</h2>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>Contract</strong>: to provide services you request (e.g., bookings, accounts).</li>
                <li><strong>Legitimate interests</strong>: product safety and improvement, minimal analytics.</li>
                <li><strong>Consent</strong>: marketing emails, optional voice features.</li>
                <li><strong>Legal obligation</strong>: tax/accounting retention.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-medium text-gray-900 mb-2">5) Sharing</h2>
              <p>We do not sell personal data. We share data with processors under DPAs to deliver the service and with integrations you enable. Main categories:</p>
              <ul className="list-disc pl-5 space-y-1 mt-1">
                <li><strong>AI</strong>: Anthropic (LLM processing).</li>
                <li><strong>Travel</strong>: Duffel (airline connectivity), airlines (fulfillment).</li>
                <li><strong>Infra</strong>: Vercel (hosting), Cloudflare (edge/CDN).</li>
                <li><strong>Data</strong>: Supabase (auth/database).</li>
                <li><strong>Voice</strong>: ElevenLabs (TTS/voice features, if enabled).</li>
                <li><strong>Payments</strong>: Stripe (billing).</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-medium text-gray-900 mb-2">6) International transfers</h2>
              <p>Where data is transferred outside the EEA/UK, we rely on Standard Contractual Clauses and additional safeguards.</p>
            </section>

            <section>
              <h2 className="text-lg font-medium text-gray-900 mb-2">7) Retention</h2>
              <ul className="list-disc pl-5 space-y-1">
                <li>Account data: for the life of the account and up to 90 days after closure.</li>
                <li>Chat logs: 90 days by default (configurable for enterprise).</li>
                <li>Booking data: 7 years (accounting/legal).</li>
                <li>Telemetry: 30–180 days (security/performance).</li>
                <li>Voice data: off by default; if enabled, retained up to 30 days unless requested earlier deletion.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-medium text-gray-900 mb-2">8) Your rights</h2>
              <ul className="list-disc pl-5 space-y-1">
                <li>Access, rectification, deletion, portability, restriction, objection.</li>
                <li>Contact: privacy@suitpax.com. We respond within 30 days.</li>
                <li>You can lodge a complaint with your local authority (AEPD in Spain).</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-medium text-gray-900 mb-2">9) Security</h2>
              <ul className="list-disc pl-5 space-y-1">
                <li>Encryption in transit and at rest, least‑privilege access, audit logging.</li>
                <li>Incident response with notification obligations; regular vulnerability management.</li>
                <li>SOC 2/ISO 27001 roadmap; subprocessors reviewed for security posture.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-medium text-gray-900 mb-2">10) AI transparency</h2>
              <ul className="list-disc pl-5 space-y-1">
                <li>We do not train foundation models on your private data.</li>
                <li>Enterprise tenants may opt for data isolation and custom retention.</li>
                <li>Tool use is auditable with context captured for safety.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-medium text-gray-900 mb-2">11) Changes & contact</h2>
              <p>We will update this policy as needed and post the effective date. Contact: privacy@suitpax.com • Postal: Av. Fabraquer 21, El Campello‑Muchavista, VC, Spain, 03560.</p>
            </section>
          </div>
        </div>
      </section>
    </main>
  )
}