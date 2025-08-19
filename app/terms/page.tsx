import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Terms of Service | Suitpax",
  description: "Terms and conditions for using Suitpax and its services.",
}

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-white">
      <section className="relative overflow-hidden bg-white">
        <div className="relative mx-auto max-w-3xl px-6 py-12 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-full px-3 py-1">
              <span className="text-[10px] font-medium text-gray-700">Suitpax S.L.</span>
              <span className="text-[10px] text-gray-500">Terms</span>
            </div>
            <h1 className="mt-4 text-4xl font-medium tracking-tighter text-black">Terms of Service</h1>
            <p className="mt-2 text-sm text-gray-600">Effective date: 15 March 2025</p>
          </div>

          <div className="mt-8 space-y-8 text-sm text-gray-800">
            <section>
              <h2 className="text-lg font-medium text-gray-900 mb-2">1) Who we are</h2>
              <p>These Terms govern your use of Suitpax AI business travel services operated by <strong>Suitpax S.L.</strong> (Av. Fabraquer 21, El Campello‑Muchavista, VC, Spain, 03560) ("Suitpax", "we", "our").</p>
            </section>

            <section>
              <h2 className="text-lg font-medium text-gray-900 mb-2">2) Account & eligibility</h2>
              <ul className="list-disc pl-5 space-y-1">
                <li>You must be at least 18 and have authority to bind your organization.</li>
                <li>You are responsible for credentials and all activity on your account.</li>
                <li>You must provide accurate information and keep it up-to-date.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-medium text-gray-900 mb-2">3) Services</h2>
              <p>Suitpax provides AI‑assisted business travel tooling (search, booking via partners, policy automation, analytics, and integrations). Travel fulfillment is executed by integrated partners (e.g., Duffel and airline systems) subject to their terms.</p>
            </section>

            <section>
              <h2 className="text-lg font-medium text-gray-900 mb-2">4) Acceptable use</h2>
              <ul className="list-disc pl-5 space-y-1">
                <li>No illegal activities, abuse, reverse‑engineering, or unauthorized access.</li>
                <li>No scraping of content or interference with service operations.</li>
                <li>No use that breaches applicable travel, export control, or privacy laws.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-medium text-gray-900 mb-2">5) Customer data & AI outputs</h2>
              <ul className="list-disc pl-5 space-y-1">
                <li>You retain ownership of data you submit; we process it to provide the services.</li>
                <li>We do not train foundation models on your private data. AI outputs may be imperfect; you are responsible for verifying critical results.</li>
                <li>Where you enable third‑party tools (e.g., airlines, email), you authorize data sharing with those providers under separate terms.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-medium text-gray-900 mb-2">6) Fees & billing</h2>
              <ul className="list-disc pl-5 space-y-1">
                <li>Paid plans and add‑ons are billed per the pricing page or your order form.</li>
                <li>Charges are non‑refundable except where required by law or explicitly stated.</li>
                <li>Taxes (VAT, sales tax) may apply and are your responsibility.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-medium text-gray-900 mb-2">7) Term & termination</h2>
              <ul className="list-disc pl-5 space-y-1">
                <li>Either party may terminate for convenience at the end of a billing period.</li>
                <li>We may suspend or terminate for breach, risk, or non‑payment.</li>
                <li>Upon termination, we delete or return your data per our <a className="underline" href="/privacy">Privacy Policy</a> and retention schedule.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-medium text-gray-900 mb-2">8) Warranties & disclaimers</h2>
              <p>The services are provided “as is” and “as available”. To the maximum extent permitted by law, we disclaim implied warranties (merchantability, fitness, non‑infringement) and do not guarantee uninterrupted or error‑free operation.</p>
            </section>

            <section>
              <h2 className="text-lg font-medium text-gray-900 mb-2">9) Limitation of liability</h2>
              <p>To the extent permitted by law, Suitpax will not be liable for indirect, incidental, special, consequential, or punitive damages; our aggregate liability is limited to the fees paid to us for the 12 months preceding the event.</p>
            </section>

            <section>
              <h2 className="text-lg font-medium text-gray-900 mb-2">10) Confidentiality & IP</h2>
              <ul className="list-disc pl-5 space-y-1">
                <li>Each party will protect the other’s confidential information using reasonable safeguards.</li>
                <li>We retain rights in our software, models, brand, and documentation.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-medium text-gray-900 mb-2">11) Governing law & venue</h2>
              <p>These Terms are governed by Spanish law; exclusive venue is the courts of Alicante, Spain, unless local mandatory law provides otherwise.</p>
            </section>

            <section>
              <h2 className="text-lg font-medium text-gray-900 mb-2">12) Changes</h2>
              <p>We may update these Terms; we will publish the “Effective date” above. Your continued use constitutes acceptance.</p>
            </section>

            <section>
              <h2 className="text-lg font-medium text-gray-900 mb-2">13) Contact</h2>
              <p>Legal notices: legal@suitpax.com • Privacy: privacy@suitpax.com • Postal: Av. Fabraquer 21, El Campello‑Muchavista, VC, Spain, 03560.</p>
            </section>
          </div>
        </div>
      </section>
    </main>
  )
}