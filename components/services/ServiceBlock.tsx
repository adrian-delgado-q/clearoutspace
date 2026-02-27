import Image from "next/image";
import Container from "@/components/layout/Container";
import Badge from "@/components/ui/Badge";
import type { Service } from "@/lib/schemas";
import { buildCtaUrl } from "@/lib/whatsapp";

interface ServiceBlockProps {
    service: Service;
    index: number;
    ctaHref?: string;
    fallbackImageUrl?: string;
}

export default function ServiceBlock({ service, index, ctaHref, fallbackImageUrl }: ServiceBlockProps) {
    const { name, sectionId, shortDescription, longDescription, startingPriceLabel,
        typicalRangeText, isMostPopular, features, whatsIncluded, sideImage } = service;

    const hasImage = !!sideImage;
    const resolvedImageUrl = hasImage ? sideImage : (fallbackImageUrl ?? null);
    const imgAlt = name;

    // Alternate image left/right: even = image left, odd = image right
    const imageLeft = index % 2 === 0;

    const isBundle = isMostPopular;

    return (
        <section
            id={sectionId}
            className={["section-padding border-b border-[#EAEAEA]", isBundle ? "bg-[#0B0B0B]" : index % 2 === 0 ? "bg-white" : "bg-[#F7F7F7]"].join(" ")}
            aria-labelledby={`service-${sectionId}`}
        >
            <Container>
                {/* Most-popular badge at top for the bundle */}
                {isBundle && (
                    <div className="mb-8">
                        <Badge variant="green">Most Popular</Badge>
                    </div>
                )}

                <div className={["grid md:grid-cols-2 gap-12 lg:gap-16 items-center", !imageLeft ? "md:[&>*:first-child]:order-last" : ""].join(" ")}>
                    {/* Text side */}
                    <div>
                        <h2
                            id={`service-${sectionId}`}
                            className={["font-semibold leading-[1.2] mb-4", isBundle ? "text-white" : "text-[#111111]"].join(" ")}
                            style={{ fontSize: "clamp(24px, 3vw, 36px)" }}
                        >
                            {name}
                        </h2>

                        {startingPriceLabel && (
                            <p className="text-lg font-semibold text-[#146C54] mb-2">
                                {startingPriceLabel}
                            </p>
                        )}

                        {typicalRangeText && (
                            <p className={["text-sm mb-5", isBundle ? "text-[#9A9A9A]" : "text-[#5A5A5A]"].join(" ")}>
                                {typicalRangeText}
                            </p>
                        )}

                        {shortDescription && (
                            <p className={["text-base leading-relaxed mb-6", isBundle ? "text-[#CCCCCC]" : "text-[#5A5A5A]"].join(" ")}>
                                {shortDescription}
                            </p>
                        )}

                        {longDescription && (
                            <div
                                className={["prose prose-sm max-w-none mb-6", isBundle ? "prose-invert" : ""].join(" ")}
                                dangerouslySetInnerHTML={{ __html: longDescription }}
                            />
                        )}

                        {/* Features */}
                        {features && features.length > 0 && (
                            <div className="mb-6">
                                <p className={["text-xs font-semibold uppercase tracking-widest mb-3", isBundle ? "text-[#5A5A5A]" : "text-[#5A5A5A]"].join(" ")}>
                                    What's included
                                </p>
                                <ul className="flex flex-col gap-2">
                                    {features.map((feat, i) => (
                                        <li key={i} className="flex items-start gap-2">
                                            <span className="flex-shrink-0 mt-0.5 w-4 h-4 rounded bg-[#E6F4F0] flex items-center justify-center" aria-hidden="true">
                                                <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                                                    <path d="M1 4l2 2L7 2" stroke="#146C54" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                            </span>
                                            <div>
                                                <span className={["text-sm font-medium", isBundle ? "text-white" : "text-[#111111]"].join(" ")}>
                                                    {feat.title}
                                                </span>
                                                {feat.description && (
                                                    <span className={["text-sm ml-1", isBundle ? "text-[#9A9A9A]" : "text-[#5A5A5A]"].join(" ")}>
                                                        — {feat.description}
                                                    </span>
                                                )}
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Whats included simple list */}
                        {whatsIncluded && whatsIncluded.length > 0 && (
                            <ul className="flex flex-wrap gap-2 mb-6">
                                {whatsIncluded.map((item, i) => (
                                    <li key={i}>
                                        <span className={["text-xs px-2.5 py-1 rounded-full border", isBundle ? "border-[#2A2A2A] text-[#9A9A9A]" : "border-[#EAEAEA] text-[#5A5A5A]"].join(" ")}>
                                            {item.text}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        )}

                        {ctaHref && (
                            <a
                                href={buildCtaUrl(ctaHref, "services", name)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={["inline-flex items-center justify-center h-11 px-6 text-sm font-medium rounded-[6px] transition-colors",
                                    isBundle
                                        ? "bg-[#146C54] text-white hover:bg-[#0f5540]"
                                        : "bg-[#111111] text-white hover:bg-[#2a2a2a]",
                                ].join(" ")}
                            >
                                Get Estimate
                            </a>
                        )}
                    </div>

                    {/* Image side */}
                    {resolvedImageUrl ? (
                        <div className="relative rounded-[8px] overflow-hidden aspect-[4/3]">
                            <Image
                                src={resolvedImageUrl}
                                alt={imgAlt ?? name}
                                fill
                                className="object-cover"
                                sizes="(min-width: 768px) 50vw, 100vw"
                            />
                        </div>
                    ) : (
                        <div className={["flex items-center justify-center rounded-[8px] aspect-[4/3]", isBundle ? "bg-[#1A1A1A]" : "bg-[#EAEAEA]"].join(" ")}>
                            <p className="text-xs text-[#5A5A5A]">{name}</p>
                        </div>
                    )}
                </div>
            </Container>
        </section>
    );
}
