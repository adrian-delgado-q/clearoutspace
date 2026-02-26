import type { Metadata } from "next";
import { fetchHomePage, fetchGlobalSettings, getStrapiMediaUrl } from "@/lib/strapi";
import { HomePageSchema, GlobalSettingsSchema, parseSingleType } from "@/lib/schemas";
import { mapStrapiSeoToMetadata } from "@/lib/seo";
import Hero from "@/components/sections/Hero";
import SmartWay from "@/components/sections/SmartWay";
import ServicesPreview from "@/components/sections/ServicesPreview";
import TrustRow from "@/components/sections/TrustRow";
import PricingVariables from "@/components/sections/PricingVariables";
import FinalCTA from "@/components/sections/FinalCTA";

export const revalidate = 3600;

async function getData() {
  try {
    const [homeRaw, globalRaw] = await Promise.allSettled([fetchHomePage(), fetchGlobalSettings()]);
    const home = homeRaw.status === "fulfilled" ? parseSingleType(HomePageSchema, homeRaw.value) : null;
    const global = globalRaw.status === "fulfilled" ? parseSingleType(GlobalSettingsSchema, globalRaw.value) : null;
    return { home, global };
  } catch {
    return { home: null, global: null };
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const { home } = await getData();
  return mapStrapiSeoToMetadata(home?.seo, {
    title: "ClearoutSpaces - Move-Out Done Right",
    description:
      "Clearout, deposit-ready cleaning, and optional listing management. Structured, coordinated, condo-ready. Toronto's move-out specialists.",
    path: "/",
  });
}

export default async function HomePage() {
  const { home, global } = await getData();
  const waBase = global?.whatsappUrl ?? "https://wa.me/12268992255";
  const ctaText = global?.primaryCtaText ?? "Get My Estimate";

  return (
    <>
      <Hero
        title={home?.heroTitle}
        subtitle={home?.heroSubtitle}
        supporting={home?.heroSupporting}
        ctaText={ctaText}
        ctaHref={waBase}
        imageUrl={
          home?.heroImage?.data?.attributes?.url
            ? getStrapiMediaUrl(home.heroImage.data.attributes.url)
            : undefined
        }
      />

      <SmartWay
        title={home?.smartWayTitle}
        items={home?.smartWayItems?.length ? home.smartWayItems : undefined}
      />

      <ServicesPreview title={home?.servicesPreviewTitle} />

      <TrustRow
        title={home?.trustTitle}
        items={home?.trustItems?.length ? home.trustItems : undefined}
      />

      <PricingVariables
        title={home?.pricingVariablesTitle}
        items={home?.pricingVariablesItems?.map((i) => i.text) ?? []}
      />

      <FinalCTA
        title={home?.finalCtaTitle}
        subtitle={home?.finalCtaSubtitle}
        ctaText={ctaText}
        ctaHref={waBase}
        source="home"
      />
    </>
  );
}
