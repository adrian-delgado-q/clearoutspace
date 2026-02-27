import Image from "next/image";
import Container from "@/components/layout/Container";

interface ListingMgmtPreviewProps {
    title?: string;
    bullets?: string[];
    imageUrl?: string;
    ctaHref?: string;
}

const DEFAULT_BULLETS = [
    "1–2 week managed listing window (max 14 days typical)",
    "20% commission on completed sales (bundle clients)",
    "We manage all buyer inquiries — you deal with no one",
    "Visit 1: clearout + photos + listing setup + cleaning",
    "Visit 2: final removal of unsold items (if applicable)",
    "No storage, no sale guarantees, no addresses shared",
];

export default function ListingMgmtPreview({
    title = "Optional: Listing Management",
    bullets = DEFAULT_BULLETS,
    imageUrl,
    ctaHref = "https://wa.me/12268992255",
}: ListingMgmtPreviewProps) {
    const displayBullets = bullets.length > 0 ? bullets : DEFAULT_BULLETS;
    return (
        <section className="section-padding bg-white border-t border-[#EAEAEA]">
            <Container>
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-widest text-[#146C54] mb-4">Add-on Service</p>
                        <h2
                            className="font-semibold text-[#111111] leading-[1.2] mb-6"
                            style={{ fontSize: "clamp(24px, 3vw, 36px)" }}
                        >
                            {title}
                        </h2>
                        <p className="text-[15px] text-[#5A5A5A] leading-relaxed mb-6">
                            For bundle clients choosing listing management, we handle everything from photography to buyer
                            coordination. Commission-based — we only earn when you do.
                        </p>
                        <ul className="flex flex-col gap-3 mb-8">
                            {displayBullets.map((b, i) => (
                                <li key={i} className="flex items-start gap-2.5 text-[14px] text-[#5A5A5A]">
                                    <span className="flex-shrink-0 mt-1 w-4 h-4 rounded bg-[#E6F4F0] flex items-center justify-center" aria-hidden="true">
                                        <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                                            <path d="M1 4l2 2L7 2" stroke="#146C54" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </span>
                                    {b}
                                </li>
                            ))}
                        </ul>
                        <a
                            href={`${ctaHref}?text=${encodeURIComponent("Hi! I'm interested in Listing Management. utm_source=home service=listing-management")}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center h-11 px-6 text-sm font-medium text-white bg-[#111111] hover:bg-[#2a2a2a] rounded-[6px] transition-colors"
                        >
                            Ask About Listing Management
                        </a>
                    </div>

                    {imageUrl ? (
                        <div className="relative rounded-[8px] overflow-hidden aspect-[4/3]">
                            <Image src={imageUrl} alt="Listing Management" fill className="object-cover" sizes="(min-width: 768px) 50vw, 100vw" />
                        </div>
                    ) : (
                        <div className="flex items-center justify-center rounded-[8px] bg-[#F7F7F7] aspect-[4/3]">
                            <div className="text-center text-[#AEAEAE]">
                                <svg width="48" height="48" viewBox="0 0 48 48" fill="none" aria-hidden="true" className="mx-auto mb-2">
                                    <rect width="48" height="48" rx="8" fill="#EAEAEA" />
                                    <path d="M14 28l8-8 6 6 4-4 6 6H14z" fill="#D0D0D0" />
                                </svg>
                                <p className="text-xs">Listing management photo</p>
                            </div>
                        </div>
                    )}
                </div>
            </Container>
        </section>
    );
}
