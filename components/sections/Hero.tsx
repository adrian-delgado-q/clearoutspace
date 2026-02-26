import Image from "next/image";
import Container from "@/components/layout/Container";
import { buildCtaUrl } from "@/lib/whatsapp";

interface HeroProps {
    title?: string;
    subtitle?: string;
    supporting?: string;
    ctaText?: string;
    ctaHref?: string;
    imageUrl?: string;
    imageAlt?: string;
}

const WaIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="flex-shrink-0">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
        <path d="M12 0C5.373 0 0 5.373 0 12c0 2.125.558 4.118 1.535 5.845L.057 23.75a.5.5 0 00.614.63l6.082-1.437A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.891 0-3.657-.5-5.186-1.374l-.37-.215-3.836.906.944-3.74-.233-.386A9.953 9.953 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" />
    </svg>
);

const TRUST_ITEMS = [
    { icon: "shield", label: "Fully Insured" },
    { icon: "building", label: "Condo-Compliant" },
    { icon: "lock", label: "No Address Stored" },
];

const TrustIcon = ({ type }: { type: string }) => {
    if (type === "building") return (
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <rect x="4" y="2" width="16" height="20" rx="2" /><path d="M9 22V12h6v10M9 6h1M14 6h1M9 10h1M14 10h1" />
        </svg>
    );
    if (type === "lock") return (
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0110 0v4" />
        </svg>
    );
    return (
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><polyline points="9 12 11 14 15 10" />
        </svg>
    );
};

export default function Hero({
    title = "Move-Out Done Right.",
    subtitle = "Clearout. Deposit-ready cleaning. Optional listing management.",
    supporting = "Structured, coordinated, condo-ready.",
    ctaText = "Get My Estimate",
    ctaHref = "https://wa.me/12268992255",
    imageUrl = "/hero.png",
    imageAlt = "ClearoutSpaces crew at work",
}: HeroProps) {
    return (
        <section className="section-padding bg-white border-b border-[#EAEAEA]">
            <Container>
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    {/* Text */}
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-widest text-[#146C54] mb-5">
                            Toronto&apos;s Move-Out Specialists
                        </p>
                        <h1
                            className="font-semibold text-[#111111] leading-tight tracking-tight mb-6"
                            style={{ fontSize: "clamp(36px, 5.5vw, 60px)" }}
                        >
                            {title}
                        </h1>
                        <p className="text-lg leading-relaxed text-[#111111] mb-2">{subtitle}</p>
                        <p className="text-base text-[#5A5A5A] mb-8">{supporting}</p>

                        {/* Matched CTA pair */}
                        <div className="flex flex-col sm:flex-row gap-3 mb-6">
                            <a
                                href={buildCtaUrl(ctaHref, "home")}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center justify-center gap-2 h-14 px-8 text-base font-medium text-white bg-[#146C54] hover:bg-[#0f5540] rounded-lg transition-colors"
                            >
                                <WaIcon />
                                {ctaText}
                            </a>
                            <a
                                href="/services"
                                className="inline-flex items-center justify-center h-14 px-8 text-base font-medium text-[#111111] border border-[#EAEAEA] hover:bg-[#F7F7F7] rounded-lg transition-colors"
                            >
                                See Services
                            </a>
                        </div>

                        {/* Trust badges */}
                        <div className="flex flex-wrap items-center gap-4">
                            {TRUST_ITEMS.map((item) => (
                                <div key={item.label} className="flex items-center gap-1.5 text-[#5A5A5A]">
                                    <TrustIcon type={item.icon} />
                                    <span className="text-[13px]">{item.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Image */}
                    {imageUrl ? (
                        <div className="relative hidden md:block rounded-[8px] overflow-hidden aspect-[4/3]">
                            <Image
                                src={imageUrl}
                                alt={imageAlt}
                                fill
                                className="object-cover"
                                priority
                                sizes="(min-width: 768px) 50vw, 100vw"
                            />
                        </div>
                    ) : (
                        <div className="hidden md:flex items-center justify-center rounded-[8px] bg-[#F7F7F7] aspect-[4/3]">
                            <div className="text-center text-[#EAEAEA]">
                                <svg width="64" height="64" viewBox="0 0 64 64" fill="none" aria-hidden="true" className="mx-auto mb-3">
                                    <rect width="64" height="64" rx="8" fill="#EAEAEA" />
                                    <path d="M14 44l12-14 8 10 6-7 10 11H14z" fill="#D0D0D0" />
                                    <circle cx="44" cy="22" r="5" fill="#D0D0D0" />
                                </svg>
                                <p className="text-xs text-[#AEAEAE]">Hero image</p>
                            </div>
                        </div>
                    )}
                </div>
            </Container>
        </section>
    );
}
