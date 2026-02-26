import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy – ClearoutSpace",
  description:
    "Learn how ClearoutSpace collects, uses, and protects your personal information.",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-stone-100 text-slate-900">


      <main className="mx-auto w-full max-w-4xl px-4 py-12 sm:px-6">
        <h1 className="text-4xl font-extrabold text-slate-900 mb-2">Privacy Policy</h1>
        <p className="text-sm text-slate-400 mb-10">Last updated: February 25, 2026</p>

        <div className="prose prose-slate max-w-none space-y-8 text-slate-700 leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">1. Who We Are</h2>
            <p>
              ClearoutSpaces ("<strong>we</strong>", "<strong>our</strong>", "<strong>us</strong>")
              is a junk removal and apartment clearout service operating in Toronto, Vancouver, and
              Montreal, Canada. Our website is{" "}
              <a href="https://clearoutspaces.ca" className="text-emerald-700 underline">
                clearoutspaces.ca
              </a>
              .
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">2. Information We Collect</h2>
            <p>We collect information you provide directly to us, including:</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>
                <strong>WhatsApp messages</strong> — your phone number and the content of your
                quote request (photos, item descriptions, address).
              </li>
              <li>
                <strong>Contact information</strong> — name, phone number, and service address
                when you book a clearout.
              </li>
              <li>
                <strong>Payment information</strong> — processed securely through Stripe. We do
                not store credit card numbers.
              </li>
            </ul>
            <p className="mt-3">
              We also automatically collect limited technical data (IP address, browser type, pages
              visited) through standard server logs.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">3. How We Use Your Information</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>To provide, schedule, and confirm clearout services</li>
              <li>To send you a quote via WhatsApp</li>
              <li>To process payments</li>
              <li>To respond to your questions or support requests</li>
              <li>To improve our services through aggregated, anonymised analytics</li>
            </ul>
            <p className="mt-3">
              We do <strong>not</strong> sell your personal information to third parties.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">4. Data Sharing</h2>
            <p>We share data only with service providers necessary to operate our business:</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>
                <strong>WhatsApp / Meta</strong> — for messaging (subject to Meta&apos;s own
                privacy policy)
              </li>
              <li>
                <strong>Stripe</strong> — for secure payment processing
              </li>
              <li>
                <strong>Google</strong> — for staff authentication (Google OAuth)
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">5. Data Retention</h2>
            <p>
              We retain your personal data for as long as necessary to fulfil the service and
              comply with applicable Canadian laws. You may request deletion of your data at any
              time by emailing{" "}
              <a href="mailto:info@clearoutspaces.ca" className="text-emerald-700 underline">
                info@clearoutspaces.ca
              </a>
              .
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">6. Your Rights (PIPEDA)</h2>
            <p>
              Under Canada&apos;s <em>Personal Information Protection and Electronic Documents
                Act</em> (PIPEDA), you have the right to:
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Access the personal information we hold about you</li>
              <li>Request corrections to inaccurate information</li>
              <li>Withdraw consent for non-essential data processing</li>
              <li>Lodge a complaint with the Office of the Privacy Commissioner of Canada</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">7. Cookies</h2>
            <p>
              Our website uses only strictly necessary session cookies required for staff
              authentication. We do not use advertising or tracking cookies.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">8. Contact Us</h2>
            <p>
              For any privacy questions or data requests, please contact us at{" "}
              <a href="mailto:info@clearoutspaces.ca" className="text-emerald-700 underline">
                info@clearoutspaces.ca
              </a>
              .
            </p>
          </section>
        </div>
      </main>

      <footer className="border-t border-stone-200 bg-white mt-12">
        <div className="mx-auto flex w-full max-w-4xl items-center justify-between gap-3 px-4 py-5 text-sm text-slate-400 sm:px-6">
          <span className="font-bold text-slate-900">
            Clearout<span className="text-emerald-700">Spaces</span>
          </span>
          <div className="flex gap-4">
            <Link href="/privacy" className="hover:text-slate-800 transition">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-slate-800 transition">Terms</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
