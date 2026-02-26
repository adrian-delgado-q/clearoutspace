import type { MetadataRoute } from "next";
import { fetchActiveListingSlugs } from "@/lib/strapi";

const BASE_URL = "https://clearoutspaces.ca";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${BASE_URL}/services`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE_URL}/pricing`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE_URL}/faq`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE_URL}/listings`, lastModified: new Date(), changeFrequency: "daily", priority: 0.8 },
    { url: `${BASE_URL}/privacy`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
    { url: `${BASE_URL}/terms`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
  ];

  let listingPages: MetadataRoute.Sitemap = [];
  try {
    const slugs = await fetchActiveListingSlugs();
    listingPages = slugs.map((slug) => ({
      url: `${BASE_URL}/listings/${slug}`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 0.7,
    }));
  } catch {
    // If Strapi is unreachable, omit dynamic listing pages gracefully
  }

  return [...staticPages, ...listingPages];
}
