import Link from "next/link";
import Container from "@/components/layout/Container";
import Badge from "@/components/ui/Badge";

interface ServicePreviewItem {
    name: string;
    sectionId: string;
    shortDescription?: string | null;
    startingPriceLabel?: string | null;
    isMostPopular?: boolean;
}

interface ServicesPreviewProps {
    title?: string;
    services?: ServicePreviewItem[];
}

const DEFAULT_SERVICES: ServicePreviewItem[] = [
    {
        name: "Move-Out Done Right",
        sectionId: "move-out-done-right",
        shortDescription:
            "Full clearout, condo-compliant move-out cleaning, and optional listing management. One team, one visit, one point of contact.",
        startingPriceLabel: "From $849",
        isMostPopular: true,
    },
    {
        name: "Clearout",
        sectionId: "clearout",
        shortDescription:
            "We remove everything — furniture, appliances, boxes — sorted for donation, recycling, or disposal.",
        startingPriceLabel: "From $499",
    },
    {
        name: "Move-Out Cleaning",
        sectionId: "cleaning",
        shortDescription:
            "Deposit-ready deep clean. We know what landlords look for. Includes inside appliances and all surfaces.",
        startingPriceLabel: "From $299",
    },
    {
        name: "Listing Management",
        sectionId: "listing-management",
        shortDescription:
            "We photograph, list, and manage buyer inquiries for your items. Commission-based — we only earn when you do.",
        startingPriceLabel: "20% commission",
    },
];

export default function ServicesPreview({ title = "What We Do", services = DEFAULT_SERVICES }: ServicesPreviewProps) {
    const displayServices = services.length > 0 ? services : DEFAULT_SERVICES;
    return (
        <section className="section-padding bg-white">
            <Container>
                <div className="flex items-end justify-between mb-12 flex-wrap gap-4">
                    <h2
                        className="font-semibold text-[#111111] leading-[1.2] tracking-tight"
                        style={{ fontSize: "clamp(26px, 3.5vw, 38px)" }}
                    >
                        {title}
                    </h2>
                    <Link href="/services" className="text-sm text-[#146C54] hover:underline font-medium">
                        View all services →
                    </Link>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {displayServices.map((svc, i) => (
                        <Link
                            key={i}
                            href={`/services#${svc.sectionId}`}
                            className="group flex flex-col border border-[#EAEAEA] rounded-[8px] p-8 hover:border-[#146C54] transition-colors"
                        >
                            <div className="flex items-center gap-2 mb-4">
                                <h3 className="font-semibold text-[18px] text-[#111111] leading-tight group-hover:text-[#146C54] transition-colors">
                                    {svc.name}
                                </h3>
                                {svc.isMostPopular && <Badge variant="green">Popular</Badge>}
                            </div>
                            {svc.shortDescription && (
                                <p className="flex-grow text-[15px] text-[#5A5A5A] leading-relaxed mb-5">{svc.shortDescription}</p>
                            )}
                            {svc.startingPriceLabel && (
                                <p className="mt-auto text-[15px] font-semibold text-[#146C54]">{svc.startingPriceLabel}</p>
                            )}
                        </Link>
                    ))}
                </div>
            </Container>
        </section>
    );
}
