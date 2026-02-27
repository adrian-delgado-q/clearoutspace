import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import Hero from "@/components/sections/Hero";
import SmartWay from "@/components/sections/SmartWay";
import ServicesPreview from "@/components/sections/ServicesPreview";
import TrustRow from "@/components/sections/TrustRow";
import PricingVariables from "@/components/sections/PricingVariables";
import FinalCTA from "@/components/sections/FinalCTA";

export const revalidate = 3600;

const WA_BASE = "https://wa.me/12268992255";
const CTA_TEXT = "Get My Estimate";

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    title: "ClearoutSpaces - Move-Out Done Right",
    description:
      "Clearout, deposit-ready cleaning, and optional listing management. Structured, coordinated, condo-ready. Toronto's Clearout Specialists.",
    path: "/",
  });
}

export default function HomePage() {
  return (
    <>
      <Hero ctaText={CTA_TEXT} ctaHref={WA_BASE} />
      <SmartWay />
      <ServicesPreview />
      <TrustRow />
      <PricingVariables />
      <FinalCTA ctaText={CTA_TEXT} ctaHref={WA_BASE} source="home" />
    </>
  );
}
