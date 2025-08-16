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
              <span className="text-[10px] font-medium text-gray-700">Suitpax</span>
              <span className="text-[10px] text-gray-500">Terms</span>
            </div>
            <h1 className="mt-4 text-4xl font-medium tracking-tighter text-black">Terms of Service</h1>
          </div>

          <div className="mt-8 space-y-6 text-sm text-gray-700">
            <section>
              <h2 className="text-lg font-medium text-gray-900 mb-2">1. Acceptance</h2>
              <p>By accessing or using Suitpax, you agree to these Terms. If you do not agree, do not use the services.</p>
            </section>
            <section>
              <h2 className="text-lg font-medium text-gray-900 mb-2">2. Services</h2>
              <p>Suitpax provides AI-powered business travel tools, including search, booking assistance, policy automation, analytics, and integrations.</p>
            </section>
            <section>
              <h2 className="text-lg font-medium text-gray-900 mb-2">3. Accounts</h2>
              <p>You are responsible for maintaining the confidentiality of your account and for all activities under your account.</p>
            </section>
            <section>
              <h2 className="text-lg font-medium text-gray-900 mb-2">4. Acceptable Use</h2>
              <p>Do not misuse the services, attempt unauthorized access, or violate applicable laws. We may suspend accounts for abuse.</p>
            </section>
            <section>
              <h2 className="text-lg font-medium text-gray-900 mb-2">5. Data & Privacy</h2>
              <p>We handle personal data per our Privacy Policy. You grant us the rights necessary to operate and improve the services.</p>
            </section>
            <section>
              <h2 className="text-lg font-medium text-gray-900 mb-2">6. Intellectual Property</h2>
              <p>Suitpax and its content are protected by intellectual property laws. You retain rights to your own content.</p>
            </section>
            <section>
              <h2 className="text-lg font-medium text-gray-900 mb-2">7. Warranties & Liability</h2>
              <p>Services are provided “as is”. To the extent permitted by law, Suitpax is not liable for indirect or consequential damages.</p>
            </section>
            <section>
              <h2 className="text-lg font-medium text-gray-900 mb-2">8. Termination</h2>
              <p>We may suspend or terminate access for violations. You may stop using the services at any time.</p>
            </section>
            <section>
              <h2 className="text-lg font-medium text-gray-900 mb-2">9. Changes</h2>
              <p>We may update these Terms. Continued use after changes constitutes acceptance.</p>
            </section>
            <section>
              <h2 className="text-lg font-medium text-gray-900 mb-2">10. Contact</h2>
              <p>For questions, contact: hello@suitpax.com</p>
            </section>
          </div>
        </div>
      </section>
    </main>
  )
}