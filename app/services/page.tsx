import type { Metadata } from "next";
import { fetchServicesPage, fetchServices, fetchGlobalSettings, getStrapiMediaUrl } from "@/lib/strapi";
import {
    ServicesPageSchema,
    ServicesResponseSchema,
    GlobalSettingsSchema,
    parseSingleType,
} from "@/lib/schemas";
import { mapStrapiSeoToMetadata } from "@/lib/seo";
import Container from "@/components/layout/Container";
import ServiceBlock from "@/components/services/ServiceBlock";
import FinalCTA from "@/components/sections/FinalCTA";

export const revalidate = 3600;

const FALLBACK_SERVICES = [
    {
        id: 1,
        attributes: {
            name: "Move-Out Done Right",
            sectionId: "move-out-done-right",
            order: 1,
            shortDescription:
                "Full clearout, deposit-ready cleaning, and optional listing management under one team. Coordinated scheduling, condo-compliant workflow, priority booking.",
            longDescription: null,
            startingPriceLabel: "From $849",
            typicalRangeText: "Most 1-bedroom condos: $849–$1,200 depending on volume and scope.",
            isMostPopular: true,
            features: [
                { title: "Coordinated scheduling", description: "one visit covers everything" },
                { title: "Single point of contact", description: "WhatsApp only" },
                { title: "Condo-compliant workflow", description: "elevator booking handled" },
                { title: "Priority booking windows", description: "schedule within 72 hours" },
                { title: "Optional listing management", description: "commission-based add-on" },
            ],
            whatsIncluded: [
                { text: "Full clearout" },
                { text: "Deposit-ready clean" },
                { text: "Condo coordination" },
                { text: "Listing mgmt (optional)" },
            ],
            sideImage: null,
            seo: null,
        },
    },
    {
        id: 2,
        attributes: {
            name: "Clearout",
            sectionId: "clearout",
            order: 2,
            shortDescription:
                "Full apartment or condo clearout — furniture, appliances, boxes. Sorted into donation, recycling, and responsible disposal.",
            longDescription: null,
            startingPriceLabel: "From $499",
            typicalRangeText: "Most 1-bedroom condos: $499–$749 depending on volume.",
            isMostPopular: false,
            features: [
                { title: "All items removed", description: "furniture, appliances, boxes" },
                { title: "Zero landfill goal", description: "everything useful is donated or recycled" },
                { title: "Single visit", description: "no repeated trips needed" },
            ],
            whatsIncluded: [
                { text: "Heavy lifting" },
                { text: "Donation sorting" },
                { text: "Eco-disposal" },
            ],
            sideImage: null,
            seo: null,
        },
    },
    {
        id: 3,
        attributes: {
            name: "Move-Out Cleaning",
            sectionId: "cleaning",
            order: 3,
            shortDescription:
                "Deposit-ready deep clean scheduled immediately after the clearout. We know what landlords look for — inside appliances, baseboards, and all surfaces.",
            longDescription: null,
            startingPriceLabel: "From $299",
            typicalRangeText: "Most 1-bedroom condos: $299–$450 depending on scope.",
            isMostPopular: false,
            features: [
                { title: "Deposit-recovery focused", description: "we know inspection checklists" },
                { title: "Inside appliances", description: "oven, fridge, microwave" },
                { title: "All surfaces covered", description: "floors, walls, fixtures" },
            ],
            whatsIncluded: [
                { text: "Deep clean" },
                { text: "Appliance interiors" },
                { text: "Bathroom & kitchen" },
            ],
            sideImage: null,
            seo: null,
        },
    },
    {
        id: 4,
        attributes: {
            name: "Listing Management",
            sectionId: "listing-management",
            order: 4,
            shortDescription:
                "Optional add-on for bundle clients. We photograph, list, and manage buyer inquiries for 1–2 weeks. Commission-based — 20% for bundle clients, 30–35% standalone.",
            longDescription: null,
            startingPriceLabel: "20% commission",
            typicalRangeText: null,
            isMostPopular: false,
            features: [
                { title: "Photography + listing setup", description: "during initial visit" },
                { title: "All buyer messages handled by us", description: "privacy-first" },
                { title: "1–2 week managed window", description: "max 14 days typical" },
                { title: "Second visit if needed", description: "final removal of unsold items" },
                { title: "No sale guarantee", description: "commission only on completed sales" },
            ],
            whatsIncluded: [
                { text: "Listing creation" },
                { text: "Buyer management" },
                { text: "Second visit" },
            ],
            sideImage: null,
            seo: null,
        },
    },
];

const LOCAL_SERVICE_IMAGES: Record<string, string> = {
    "move-out-done-right": "/managed.png",
    "clearout": "/clearout.png",
    "cleaning": "/cleanout-1.jpg",
    "listing-management": "/listings.png",
};

async function getData() {
    try {
        const [pageRaw, servicesRaw, globalRaw] = await Promise.allSettled([
            fetchServicesPage(),
            fetchServices(),
            fetchGlobalSettings(),
        ]);

        const page = pageRaw.status === "fulfilled"
            ? parseSingleType(ServicesPageSchema, pageRaw.value)
            : null;

        let services = FALLBACK_SERVICES;
        if (servicesRaw.status === "fulfilled") {
            const parsed = ServicesResponseSchema.safeParse(servicesRaw.value);
            if (parsed.success && parsed.data.data.length > 0) {
                services = parsed.data.data as typeof FALLBACK_SERVICES;
            }
        }

        const global = globalRaw.status === "fulfilled"
            ? parseSingleType(GlobalSettingsSchema, globalRaw.value)
            : null;

        return { page, services, global };
    } catch {
        return { page: null, services: FALLBACK_SERVICES, global: null };
    }
}

export async function generateMetadata(): Promise<Metadata> {
    const { page } = await getData();
    return mapStrapiSeoToMetadata(page?.seo, {
        title: "Services – ClearoutSpaces",
        description:
            "Move-out bundles, clearout, deposit-ready cleaning, and optional listing management. Single page with all services and pricing anchors.",
        path: "/services",
    });
}

export default async function ServicesPage() {
    const { services, page, global } = await getData();
    const waBase = global?.whatsappUrl ?? "https://wa.me/12268992255";

    return (
        <>
            {/* Page intro */}
            <section className="py-16 md:py-20 border-b border-[#EAEAEA] bg-white">
                <Container>
                    <p className="text-xs font-semibold uppercase tracking-widest text-[#146C54] mb-4">
                        All Services
                    </p>
                    <h1
                        className="font-semibold text-[#111111] leading-[1.05] max-w-2xl"
                        style={{ fontSize: "clamp(32px, 5vw, 56px)" }}
                    >
                        {page?.pageTitle ?? "What We Do"}
                    </h1>
                    {page?.introText && (
                        <p className="mt-4 text-lg text-[#5A5A5A] max-w-2xl leading-relaxed">{page.introText}</p>
                    )}

                    {/* Anchor nav */}
                    <nav className="flex flex-wrap gap-3 mt-8" aria-label="Jump to service">
                        {services.map((svc) => (
                            <a
                                key={svc.attributes.sectionId}
                                href={`#${svc.attributes.sectionId}`}
                                className="text-sm text-[#5A5A5A] hover:text-[#146C54] border border-[#EAEAEA] hover:border-[#146C54] px-4 py-2 rounded-full transition-colors"
                            >
                                {svc.attributes.name}
                            </a>
                        ))}
                    </nav>
                </Container>
            </section>

            {/* Service blocks */}
            {services.map((service, index) => (
                <ServiceBlock
                    key={service.id}
                    service={service as Parameters<typeof ServiceBlock>[0]["service"]}
                    index={index}
                    ctaHref={waBase}
                    fallbackImageUrl={LOCAL_SERVICE_IMAGES[service.attributes.sectionId]}
                />
            ))}

            <FinalCTA ctaHref={waBase} source="services" />
        </>
    );
}
