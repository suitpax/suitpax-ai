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
              <span className="text-[10px] font-medium text-gray-700">Suitpax</span>
              <span className="text-[10px] text-gray-500">Privacy</span>
            </div>
            <h1 className="mt-4 text-4xl font-medium tracking-tighter text-black">Privacy Policy</h1>
          </div>

          <div className="mt-8 space-y-6 text-sm text-gray-700">
            <section>
              <h2 className="text-lg font-medium text-gray-900 mb-2">Overview</h2>
              <p>We respect your privacy. This policy explains what data we collect, how we use it, and the choices you have.</p>
            </section>
            <section>
              <h2 className="text-lg font-medium text-gray-900 mb-2">Information We Collect</h2>
              <ul className="list-disc pl-5 space-y-1">
                <li>Account information (name, email)</li>
                <li>Usage data (interactions, device, browser)</li>
                <li>Travel & expense data you provide for business use</li>
              </ul>
            </section>
            <section>
              <h2 className="text-lg font-medium text-gray-900 mb-2">How We Use Information</h2>
              <ul className="list-disc pl-5 space-y-1">
                <li>Provide and improve Suitpax services</li>
                <li>Security, fraud prevention, and compliance</li>
                <li>Product analytics and personalized experiences</li>
              </ul>
            </section>
            <section>
              <h2 className="text-lg font-medium text-gray-900 mb-2">Sharing</h2>
              <p>We do not sell your data. We share data with processors and integrations you enable, under strict contracts.</p>
            </section>
            <section>
              <h2 className="text-lg font-medium text-gray-900 mb-2">Data Security</h2>
              <p>We use industry‑standard security (SOC2, encryption in transit/at rest, access controls) to protect your data.</p>
            </section>
            <section>
              <h2 className="text-lg font-medium text-gray-900 mb-2">Your Rights</h2>
              <p>You can access, correct, or delete your data. Contact us at privacy@suitpax.com.</p>
            </section>
            <section>
              <h2 className="text-lg font-medium text-gray-900 mb-2">Retention</h2>
              <p>We retain data as long as necessary to provide services and meet legal obligations.</p>
            </section>
            <section>
              <h2 className="text-lg font-medium text-gray-900 mb-2">Changes</h2>
              <p>We may update this policy. Continued use after changes indicates acceptance.</p>
            </section>
            <section>
              <h2 className="text-lg font-medium text-gray-900 mb-2">Contact</h2>
              <p>For privacy questions: privacy@suitpax.com</p>
            </section>
          </div>
        </div>
      </section>
    </main>
  )
}