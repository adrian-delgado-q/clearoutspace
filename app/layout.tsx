import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import CookieBanner from "./_components/CookieBanner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const BASE_URL = "https://clearoutspace.ca";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "ClearoutSpace – Junk Removal & Estate Clearouts",
    template: "%s – ClearoutSpace",
  },
  description:
    "Fast, affordable apartment and estate cleanouts in Toronto, Vancouver, and Montreal. Get a free quote on WhatsApp in minutes.",
  keywords: [
    "junk removal Toronto",
    "junk removal Vancouver",
    "junk removal Montreal",
    "apartment clearout Toronto",
    "estate cleanout service",
    "furniture removal service",
    "same day junk removal",
    "junk hauling near me",
    "affordable junk removal",
    "full apartment cleanout",
    "move out cleanout",
    "hoarding cleanout",
    "appliance removal",
    "junk pickup Toronto",
    "eco friendly junk removal",
    "ClearoutSpace",
  ],
  openGraph: {
    type: "website",
    url: BASE_URL,
    title: "ClearoutSpace – Junk Removal & Estate Clearouts",
    description:
      "Fast, affordable apartment and estate cleanouts in Toronto, Vancouver, and Montreal. Get a free quote on WhatsApp in minutes.",
    siteName: "ClearoutSpace",
    images: [
      {
        url: "/truckimages.png",
        width: 1200,
        height: 630,
        alt: "ClearoutSpace junk removal truck",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ClearoutSpace – Junk Removal & Estate Clearouts",
    description:
      "Fast, affordable apartment and estate cleanouts in Toronto, Vancouver, and Montreal. Get a free quote on WhatsApp in minutes.",
    images: ["/truckimages.png"],
  },
  alternates: {
    canonical: BASE_URL,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <CookieBanner />
      </body>
    </html>
  );
}
