import Container from "@/components/layout/Container";
import { buildCtaUrl, type CtaSource } from "@/lib/whatsapp";

interface FinalCTAProps {
    title?: string;
    subtitle?: string;
    ctaText?: string;
    ctaHref?: string;
    source?: CtaSource;
}

export default function FinalCTA({
    title = "Ready to move out without the stress?",
    subtitle = "No forms. Just WhatsApp.",
    ctaText = "Get My Estimate",
    ctaHref = "https://wa.me/12268992255",
    source = "home" as CtaSource,
}: FinalCTAProps) {
    const href = buildCtaUrl(ctaHref, source);

    return (
        <section className="section-padding bg-white border-t border-[#EAEAEA]">
            <Container>
                <div className="max-w-2xl mx-auto text-center">
                    <h2
                        className="font-semibold text-[#111111] leading-[1.2] mb-4"
                        style={{ fontSize: "clamp(26px, 3.5vw, 38px)" }}
                    >
                        {title}
                    </h2>
                    <p className="text-lg text-[#5A5A5A] mb-8">{subtitle}</p>

                    <a
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center h-[52px] px-10 text-base font-medium text-white bg-[#146C54] hover:bg-[#0f5540] rounded-[6px] transition-colors"
                    >
                        {ctaText}
                    </a>

                    <p className="mt-5 text-[13px] text-[#5A5A5A] max-w-sm mx-auto">
                        To get a quote faster, send: postal code, unit size, 2–3 photos, elevator/stairs.
                    </p>
                </div>
            </Container>
        </section>
    );
}
