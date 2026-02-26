import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Service – ClearoutSpace",
  description:
    "Read the terms and conditions governing ClearoutSpace junk removal and apartment clearout services.",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-stone-100 text-slate-900">

      <main className="mx-auto w-full max-w-4xl px-4 py-12 sm:px-6">
        <h1 className="text-4xl font-extrabold text-slate-900 mb-2">Terms of Service</h1>
        <p className="text-sm text-slate-400 mb-10">Last updated: February 25, 2026</p>

        <div className="prose prose-slate max-w-none space-y-8 text-slate-700 leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">1. Acceptance of Terms</h2>
            <p>
              By requesting a quote or booking a service through ClearoutSpace, you agree to
              these Terms of Service. If you do not agree, please do not use our services.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">2. Services Provided</h2>
            <p>
              ClearoutSpace provides junk removal, apartment clearout, and optional cleaning
              services in Toronto, Vancouver, and Montreal. Specific services, pricing, and
              availability are confirmed at the time of booking via WhatsApp.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">3. Quotes & Pricing</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>
                Quotes provided via WhatsApp are estimates based on information you supply
                (photos, item descriptions, volume).
              </li>
              <li>
                The final price is confirmed by our team before work begins. If the actual scope
                differs significantly from the estimate, we will notify you before proceeding.
              </li>
              <li>All prices are in Canadian dollars (CAD) and include applicable taxes.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">4. Booking & Cancellation</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>
                Bookings are confirmed once you accept the quoted price via WhatsApp or our
                booking link.
              </li>
              <li>
                Cancellations made <strong>more than 24 hours</strong> before the scheduled
                appointment are free of charge.
              </li>
              <li>
                Cancellations made <strong>within 24 hours</strong> of the appointment may incur
                a cancellation fee of up to $75 CAD to cover crew scheduling costs.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">5. Customer Responsibilities</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>
                You must have the legal right to dispose of all items you ask us to remove (e.g.,
                ownership or authorisation from the property owner).
              </li>
              <li>
                Hazardous materials (chemicals, paint, biohazards, etc.) are excluded from our
                service. We reserve the right to refuse removal of such items.
              </li>
              <li>
                You must ensure safe and reasonable access to the property at the scheduled time.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">6. Liability</h2>
            <p>
              ClearoutSpace carries general liability insurance. In the event of damage caused
              directly by our crew, please notify us within <strong>48 hours</strong> of service
              completion. Our liability is limited to the value of the confirmed service booking.
            </p>
            <p className="mt-3">
              We are not responsible for damage resulting from pre-existing conditions, items not
              disclosed at the time of booking, or structural issues in the property.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">7. Payments</h2>
            <p>
              Payment is due upon completion of the service unless otherwise agreed. We accept
              e-transfer, credit card (via Stripe), and cash. Unpaid balances may be subject to
              collection.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">8. Governing Law</h2>
            <p>
              These terms are governed by the laws of the Province of Ontario and the federal
              laws of Canada applicable therein. Any disputes shall be resolved in the courts of
              Ontario.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">9. Changes to Terms</h2>
            <p>
              We may update these terms from time to time. The updated version will be posted on
              this page with a revised &quot;Last updated&quot; date.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">10. Contact</h2>
            <p>
              Questions about these terms? Email us at{" "}
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
