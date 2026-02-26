import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "ClearoutSpace – Junk Removal & Apartment Clearouts in Toronto, Vancouver & Montreal",
  description:
    "Same-day junk removal, apartment clearouts & estate cleanouts in Toronto, Vancouver, and Montreal. Get a free WhatsApp quote in minutes. Fully insured, eco-friendly.",
};

const WA_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "12268992255";
const WA_MESSAGE = encodeURIComponent("Hi! I'd like a free quote for a cleanout.");
const WA_HREF = `https://wa.me/${WA_NUMBER}?text=${WA_MESSAGE}`;

const heroBullets = [
  "Same-day quotes",
  "Clear pricing, no hidden fees",
  "Fully insured & available this week",
];

const services = [
  {
    title: "Apartment Cleanouts",
    accent: "text-emerald-700",
    startingAt: "$299",
    points: [
      "Furniture, appliances, junk removal",
      "Estate cleanouts",
      "We donate, recycle, and resell your items",
    ],
  },
  {
    title: "Professional Cleaning",
    accent: "text-emerald-700",
    startingAt: "$200",
    points: [
      "Move-out and deep cleaning",
      "Vacuuming, mopping, kitchen, bathrooms, and more",
      "Available as an add-on after cleanout",
    ],
  },
];

const whyChoose = [
  "Fast day quotes",
  "Fast service slots",
  "Clear & upfront pricing",
  "Fully insured team",
];

const whatWeHandle = [
  "Heavy lifting — sofas, beds, appliances, you name it",
  "Full estate & apartment clearouts in a single visit",
  "We donate usable items to local charities",
  "Responsible recycling & disposal — no landfill dumping",
  "Optional deep-clean after the clearout",
  "Same-week availability across Toronto, Vancouver & Montreal",
];

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "ClearoutSpace",
  description:
    "Fast, affordable apartment cleanouts and cleaning services across Toronto, Vancouver, and Montreal.",
  telephone: `+${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "12268992255"}`,
  url: "https://clearoutspace.ca",
  logo: "https://clearoutspace.ca/truckimages.png",
  image: "https://clearoutspace.ca/truckimages.png",
  priceRange: "$$",
  areaServed: [
    { "@type": "City", name: "Toronto" },
    { "@type": "City", name: "Vancouver" },
    { "@type": "City", name: "Montreal" },
  ],
  serviceType: ["Junk Removal", "Apartment Cleanout", "Estate Cleanout", "Professional Cleaning"],
  sameAs: [],
};

export default function Home() {
  const socials = [
    {
      id: "facebook",
      href: process.env.NEXT_PUBLIC_SOCIAL_FACEBOOK,
      label: "Facebook",
      path: "M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z",
    },
    {
      id: "instagram",
      href: process.env.NEXT_PUBLIC_SOCIAL_INSTAGRAM,
      label: "Instagram",
      path: "M12 2c2.717 0 3.056.01 4.122.06 1.065.05 1.79.217 2.428.465.66.254 1.216.598 1.772 1.153a4.908 4.908 0 0 1 1.153 1.772c.247.637.415 1.363.465 2.428.047 1.066.06 1.405.06 4.122s-.01 3.056-.06 4.122c-.05 1.065-.218 1.79-.465 2.428a4.883 4.883 0 0 1-1.153 1.772 4.915 4.915 0 0 1-1.772 1.153c-.637.247-1.363.415-2.428.465-1.066.047-1.405.06-4.122.06s-3.056-.01-4.122-.06c-1.065-.05-1.79-.218-2.428-.465a4.89 4.89 0 0 1-1.772-1.153 4.904 4.904 0 0 1-1.153-1.772c-.248-.637-.415-1.363-.465-2.428C2.013 15.056 2 14.717 2 12c0-2.717.01-3.056.06-4.122.05-1.066.217-1.79.465-2.428a4.88 4.88 0 0 1 1.153-1.772A4.897 4.897 0 0 1 5.45 2.525c.638-.248 1.362-.415 2.428-.465C8.944 2.013 9.283 2 12 2zm0 1.802c-2.67 0-2.987.01-4.04.059-.976.045-1.505.207-1.858.344-.466.182-.8.398-1.15.748-.35.35-.566.684-.748 1.15-.137.353-.3.882-.344 1.857-.048 1.055-.058 1.37-.058 4.04 0 2.67.01 2.986.058 4.04.045.977.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.684.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.04.058 2.67 0 2.987-.01 4.04-.058.977-.045 1.504-.207 1.857-.344.466-.182.8-.398 1.15-.748.35-.35.566-.684.748-1.15.137-.353.3-.88.344-1.857.048-1.054.058-1.37.058-4.04 0-2.67-.01-2.986-.058-4.04-.045-.976-.207-1.504-.344-1.857a3.098 3.098 0 0 0-.748-1.15 3.098 3.098 0 0 0-1.15-.748c-.353-.137-.88-.3-1.857-.344-1.053-.048-1.37-.058-4.04-.058zm0 3.063a5.135 5.135 0 1 1 0 10.27 5.135 5.135 0 0 1 0-10.27zm0 1.802a3.333 3.333 0 1 0 0 6.666 3.333 3.333 0 0 0 0-6.666zm5.338-3.205a1.2 1.2 0 1 1 0 2.4 1.2 1.2 0 0 1 0-2.4z",
    },
    {
      id: "tiktok",
      href: process.env.NEXT_PUBLIC_SOCIAL_TIKTOK,
      label: "TikTok",
      path: "M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z",
    },
    {
      id: "youtube",
      href: process.env.NEXT_PUBLIC_SOCIAL_YOUTUBE,
      label: "YouTube",
      path: "M21.543 6.498C22 8.28 22 12 22 12s0 3.72-.457 5.502c-.254.985-.997 1.76-1.938 2.022C17.896 20 12 20 12 20s-5.893 0-7.605-.476c-.945-.266-1.687-1.04-1.938-2.022C2 15.72 2 12 2 12s0-3.72.457-5.502c.254-.985.997-1.76 1.938-2.022C6.107 4 12 4 12 4s5.896 0 7.605.476c.945.266 1.687 1.04 1.938 2.022zM10 15.5l6-3.5-6-3.5v7z",
    },
  ].filter((s) => s.href) as { id: string; href: string; label: string; path: string }[];

  return (
    <div className="min-h-screen overflow-x-hidden bg-stone-100 text-slate-900">
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <header className="sticky top-0 z-50 border-b border-stone-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
          <Link href="/" className="text-2xl font-bold tracking-tight">
            Clearout<span className="text-emerald-700">Space</span>
          </Link>
          <Link
            href={WA_HREF}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg bg-emerald-700 px-3 py-2 text-sm font-semibold text-white transition hover:bg-emerald-800"
          >
            Get My Free Quote
          </Link>
        </div>
      </header>

      <main>
        <section className="border-b border-stone-200 bg-white">
          <div className="mx-auto grid w-full max-w-6xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-2 md:items-center md:py-14">
            <div className="animate-enter-up">
              <h1 className="text-3xl font-extrabold leading-tight sm:text-5xl">
                Clear Out &amp; <span className="text-emerald-700">Clean Up</span>
                <br />
                Without the Hassle.
              </h1>
              <p className="mt-5 max-w-xl text-base text-slate-600 sm:text-xl">
                Fast, affordable apartment cleanouts and cleaning services across Toronto,
                Vancouver, and Montreal.
              </p>
              <ul className="mt-7 space-y-2 text-slate-800">
                {heroBullets.map((item) => (
                  <li key={item} className="flex items-center gap-3">
                    <span className="text-emerald-700 font-bold">✓</span>
                    <span className="text-base sm:text-lg">{item}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link
                  href={WA_HREF}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-xl bg-emerald-700 px-6 py-3 text-base font-bold text-white transition hover:bg-emerald-800 sm:text-lg"
                >
                  Get My Free Quote
                </Link>
              </div>
            </div>

            <div className="relative animate-enter-up [animation-delay:120ms]">
              <div className="overflow-hidden rounded-2xl border border-stone-300 bg-white shadow-sm">
                <img
                  src="/truckimages.png"
                  alt="ClearoutSpace truck ready for apartment clearout"
                  className="h-[420px] w-full object-cover"
                />
              </div>
              <div className="pointer-events-none absolute inset-y-0 left-0 w-28 bg-gradient-to-r from-white to-transparent" />
            </div>
          </div>
        </section>

        <section className="border-b border-stone-200 bg-stone-50 py-10">
          <div className="mx-auto w-full max-w-6xl px-4 text-center sm:px-6">
            <p className="mx-auto mt-5 max-w-3xl text-xl font-medium leading-relaxed text-slate-600">
              Moving out? Downsizing? Handling an estate? We take the heavy work off your plate —
              hauling, donating, recycling, and cleaning so you don&apos;t have to lift a finger.
            </p>

            <div className="mt-8 grid gap-4 md:grid-cols-2">
              {services.map((service) => (
                <article key={service.title} className="rounded-2xl border border-stone-200 bg-white p-6 text-left shadow-sm">
                  <h3 className="text-2xl font-extrabold text-slate-900 sm:text-3xl">
                    {service.title.split(" ")[0]}{" "}
                    <span className={service.accent}>{service.title.split(" ").slice(1).join(" ")}</span>
                  </h3>
                  <p className="mt-3 text-lg font-medium text-slate-700 sm:text-xl">
                    Starting at <span className="font-black text-emerald-700">{service.startingAt}</span>
                  </p>
                  <ul className="mt-4 space-y-2 text-sm text-slate-700 sm:text-base">
                    {service.points.map((point) => (
                      <li key={point} className="flex items-start gap-2">
                        <span className="mt-1 text-emerald-700">✓</span>
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="border-b border-stone-200 bg-white py-12">
          <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
            <h2 className="text-center text-2xl font-extrabold sm:text-4xl md:text-5xl">From cluttered to clean in one visit.</h2>
            <div className="mt-7 grid gap-4 md:grid-cols-2">
              <div className="relative overflow-hidden rounded-2xl border border-stone-300">
                <img
                  src="/before.png"
                  alt="Apartment before clearout — furnished with items to remove"
                  className="h-80 w-full object-cover"
                />
                <span className="absolute left-3 top-3 rounded-md bg-black/70 px-3 py-1 text-sm font-semibold text-white">Before</span>
              </div>
              <div className="relative overflow-hidden rounded-2xl border border-stone-300">
                <img
                  src="/after.png"
                  alt="Same apartment after clearout — empty and clean"
                  className="h-80 w-full object-cover"
                />
                <span className="absolute left-3 top-3 rounded-md bg-emerald-700/90 px-3 py-1 text-sm font-semibold text-white">After</span>
              </div>
            </div>
            <div className="mt-10 text-center">
              <h2 className="text-2xl font-extrabold text-slate-900 sm:text-3xl">What We Handle</h2>
              <p className="mt-2 text-base text-slate-500">
                Everything from bulky items to full estate clearouts — we&apos;ve got it covered.
              </p>
            </div>
            <ul className="mt-6 grid gap-3 sm:grid-cols-2">
              {whatWeHandle.map((point) => (
                <li
                  key={point}
                  className="flex items-start gap-4 rounded-2xl border border-stone-200 bg-white px-5 py-4 shadow-sm"
                >
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-700 text-sm font-bold text-white">
                    ✓
                  </span>
                  <span className="text-base font-medium text-slate-800">{point}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="bg-stone-50 py-12">
          <div className="mx-auto grid w-full max-w-6xl gap-6 px-4 sm:px-6 md:grid-cols-2">
            <div className="rounded-2xl border border-stone-200 bg-white p-6">
              <h3 className="text-2xl font-extrabold sm:text-3xl">
                Why Choose Clearout<span className="text-emerald-700">Space</span>?
              </h3>
              <div className="mt-6 grid gap-3 text-sm text-slate-700 sm:grid-cols-2 sm:text-base">
                {whyChoose.map((item) => (
                  <p key={item}>
                    <span className="font-extrabold text-slate-900">{item.split(" ")[0]}</span>{" "}
                    {item.split(" ").slice(1).join(" ")}
                  </p>
                ))}
              </div>
              <p className="mt-6 rounded-xl bg-stone-50 p-4 text-sm text-slate-600 sm:text-base">
                We also offer bundled cleanouts when you add professional cleaning.
              </p>
            </div>

            <div className="clearoutspace-banner rounded-2xl p-8 text-center text-white shadow-md">
              <h3 className="text-2xl font-extrabold sm:text-4xl">Need a Quote?</h3>
              <p className="mt-3 text-lg font-semibold sm:text-2xl">Message Us on WhatsApp!</p>
              <p className="mt-4 text-sm text-emerald-100 sm:text-base">
                We&apos;ll respond quickly to get your apartment cleared and cleaned ASAP.
              </p>
              <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                <Link
                  href={WA_HREF}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-xl bg-white text-emerald-800 px-6 py-3 text-base font-bold transition hover:bg-stone-50 sm:text-lg"
                >
                  Chat on WhatsApp
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-stone-200 bg-white">
        <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6">
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
            <Link href="/" className="text-lg font-bold text-slate-900 hover:opacity-80 transition">
              Clearout<span className="text-emerald-700">Space</span>
            </Link>

            {socials.length > 0 && (
              <div className="flex items-center gap-3">
                {socials.map((s) => (
                  <a
                    key={s.id}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.label}
                    className="text-slate-400 transition hover:text-emerald-700"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="h-5 w-5"
                      aria-hidden="true"
                    >
                      <path d={s.path} />
                    </svg>
                  </a>
                ))}
              </div>
            )}

            <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-slate-500">
              <a href="mailto:info@clearoutspace.ca" className="hover:text-slate-800">
                info@clearoutspace.ca
              </a>
              <Link href="/privacy" className="hover:text-slate-800">
                Privacy Policy
              </Link>
              <Link href="/terms" className="hover:text-slate-800">
                Terms
              </Link>
              <Link href="/login" className="font-bold text-slate-400 hover:text-slate-700 transition">
                Staff Login
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
