import Link from "next/link";
import Container from "./Container";
import { buildCtaUrl } from "@/lib/whatsapp";

const FOOTER_LINKS = [
    { label: "Services", href: "/services" },
    { label: "Pricing", href: "/pricing" },
    { label: "FAQ", href: "/faq" },
    { label: "Listings", href: "/listings" },
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms", href: "/terms" },
];

const WA_URL = process.env.NEXT_PUBLIC_WHATSAPP_URL ?? "https://wa.me/12268992255";

export default function Footer() {
    return (
        <footer className="bg-[#0B0B0B] text-white">
            <Container className="py-16">
                <div className="grid md:grid-cols-3 gap-10 items-start">
                    {/* Brand */}
                    <div>
                        <div className="flex items-center gap-2 font-semibold text-lg mb-3">
                            <span className="inline-block w-2 h-6 bg-[#146C54] rounded-sm" aria-hidden="true" />
                            <span>Clearout<span className="text-[#146C54]">Spaces</span></span>
                        </div>
                        <p className="text-sm text-[#9CA3AF] leading-relaxed max-w-xs">
                            Move-out specialists serving Toronto condos and apartments. Clearout, cleaning,
                            and optional listing management — one team.
                        </p>
                    </div>

                    {/* Links */}
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-widest text-[#6B7280] mb-4">
                            Navigate
                        </p>
                        <ul className="flex flex-col gap-2">
                            {FOOTER_LINKS.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className="text-sm text-[#9CA3AF] hover:text-white transition-colors"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-widest text-[#6B7280] mb-4">
                            Contact
                        </p>
                        <a
                            href={buildCtaUrl(WA_URL, "footer")}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-sm font-medium text-white hover:text-[#9CA3AF] transition-colors"
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                                <path d="M12 0C5.373 0 0 5.373 0 12c0 2.125.558 4.118 1.535 5.845L.057 23.75a.5.5 0 00.614.63l6.082-1.437A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.891 0-3.657-.5-5.186-1.374l-.37-.215-3.836.906.944-3.74-.233-.386A9.953 9.953 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" />
                            </svg>
                            Chat on WhatsApp
                        </a>
                        <p className="text-xs text-[#9CA3AF] mt-3 leading-relaxed">
                            To get a quote faster, send: postal code, unit size, 2–3 photos, elevator/stairs.
                        </p>
                    </div>
                </div>

                <div className="mt-14 pt-6 border-t border-[#2A2A2A] flex flex-col md:flex-row justify-between items-center gap-3 text-xs text-[#6B7280]">
                    <p>© {new Date().getFullYear()} ClearoutSpaces. All rights reserved.</p>
                    <p>Toronto, ON · No addresses stored. No forms. Just WhatsApp.</p>
                </div>
            </Container>
        </footer>
    );
}
