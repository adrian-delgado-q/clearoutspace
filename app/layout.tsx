import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CookieBanner from "./_components/CookieBanner";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const BASE_URL = "https://clearoutspaces.ca";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "ClearoutSpaces – Move-Out Done Right",
    template: "%s | ClearoutSpaces",
  },
  description:
    "Clearout, deposit-ready cleaning, and optional listing management — structured, coordinated, condo-ready. Toronto's Clearout Specialists.",
  keywords: [
    "move out clearout Toronto",
    "condo clearout Toronto",
    "junk removal Toronto",
    "move out cleaning Toronto",
    "furniture resale Toronto",
    "estate clearout Toronto",
    "listing management Toronto",
    "ClearoutSpaces",
  ],
  openGraph: {
    type: "website",
    url: BASE_URL,
    title: "ClearoutSpaces – Move-Out Done Right",
    description:
      "Clearout. Deposit-ready cleaning. Optional listing management. Structured, coordinated, condo-ready.",
    siteName: "ClearoutSpaces",
    images: [{ url: "/og-default.png", width: 1200, height: 630, alt: "ClearoutSpaces" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "ClearoutSpaces – Move-Out Done Right",
    description: "Clearout. Deposit-ready cleaning. Optional listing management.",
    images: ["/og-default.png"],
  },
  alternates: { canonical: BASE_URL },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const analyticsId = process.env.NEXT_PUBLIC_ANALYTICS_ID;
  return (
    <html lang="en" className={inter.variable}>
      <body className="bg-white text-[#111111] antialiased">
        <Navbar />
        <main className="pb-20 md:pb-0">{children}</main>
        <Footer />
        <CookieBanner />
        {analyticsId && (
          <>
            <script async src={`https://www.googletagmanager.com/gtag/js?id=${analyticsId}`} />
            <script
              dangerouslySetInnerHTML={{
                __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${analyticsId}');`,
              }}
            />
          </>
        )}
      </body>
    </html>
  );
}
