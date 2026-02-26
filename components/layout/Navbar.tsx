"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import Container from "./Container";
import { buildCtaUrl } from "@/lib/whatsapp";

const NAV_LINKS = [
    { label: "Home", href: "/" },
    { label: "Listings", href: "/listings", badge: "NEW" },
    { label: "Services", href: "/services" },
    { label: "Pricing", href: "/pricing" },
    { label: "FAQ", href: "/faq" },
];

const WA_URL = process.env.NEXT_PUBLIC_WHATSAPP_URL ?? "https://wa.me/12268992255";
const CTA_TEXT = "Get Estimate";

const WaIcon = () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="flex-shrink-0">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
        <path d="M12 0C5.373 0 0 5.373 0 12c0 2.125.558 4.118 1.535 5.845L.057 23.75a.5.5 0 00.614.63l6.082-1.437A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.891 0-3.657-.5-5.186-1.374l-.37-.215-3.836.906.944-3.74-.233-.386A9.953 9.953 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" />
    </svg>
);

export default function Navbar() {
    const pathname = usePathname();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 10);
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    const isActive = (href: string) =>
        pathname === href || pathname.startsWith(href + "/") || (href !== "/" && pathname.startsWith(href));

    return (
        <header
            className={[
                "sticky top-0 z-40 transition-all duration-200",
                scrolled
                    ? "bg-white/90 backdrop-blur-md border-b border-[#EAEAEA] shadow-sm"
                    : "bg-white border-b border-[#EAEAEA]",
            ].join(" ")}
        >
            <Container className="flex items-center justify-between h-16">
                {/* Logo */}
                <Link
                    href="/"
                    className="flex items-center gap-2 font-semibold text-[#111111] text-lg tracking-tight"
                    aria-label="ClearoutSpaces home"
                >
                    <span className="inline-block w-2 h-6 bg-[#146C54] rounded-sm" aria-hidden="true" />
                    <span>Clearout<span className="text-[#146C54]">Spaces</span></span>
                </Link>

                {/* Desktop nav */}
                <nav className="hidden md:flex items-center gap-8" aria-label="Primary navigation">
                    {NAV_LINKS.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={[
                                "relative flex items-center gap-1.5 text-sm transition-colors pb-0.5",
                                isActive(link.href)
                                    ? "text-[#111111] font-semibold border-b-2 border-[#146C54]"
                                    : "text-[#6B7280] hover:text-[#111111]",
                            ].join(" ")}
                        >
                            {link.label}
                            {link.badge && (
                                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold leading-none bg-[#146C54] text-white">
                                    {link.badge}
                                </span>
                            )}
                        </Link>
                    ))}
                </nav>

                {/* CTA + mobile toggle */}
                <div className="flex items-center gap-3">
                    <a
                        href={buildCtaUrl(WA_URL, "navbar")}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hidden md:inline-flex items-center justify-center gap-2 h-10 px-5 text-sm font-medium text-white bg-[#146C54] hover:bg-[#0f5540] rounded-[6px] transition-colors"
                    >
                        <WaIcon />
                        {CTA_TEXT}
                    </a>

                    {/* Mobile burger */}
                    <button
                        className="md:hidden p-2 rounded-md text-[#5A5A5A] hover:text-[#111111] hover:bg-[#F7F7F7] transition-colors"
                        onClick={() => setMobileOpen(!mobileOpen)}
                        aria-label="Toggle menu"
                        aria-expanded={mobileOpen}
                    >
                        {mobileOpen ? (
                            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                                <path d="M1 1l16 16M17 1L1 17" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                            </svg>
                        ) : (
                            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                                <path d="M1 4h16M1 9h16M1 14h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                            </svg>
                        )}
                    </button>
                </div>
            </Container>

            {/* Mobile dropdown */}
            {mobileOpen && (
                <div className="md:hidden border-t border-[#EAEAEA] bg-white">
                    <nav className="flex flex-col py-2" aria-label="Mobile navigation">
                        {NAV_LINKS.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                onClick={() => setMobileOpen(false)}
                                className={[
                                    "flex items-center gap-2 px-6 py-3 text-sm hover:bg-[#F7F7F7] transition-colors",
                                    isActive(link.href) ? "font-semibold text-[#111111]" : "text-[#111111]",
                                ].join(" ")}
                            >
                                {link.label}
                                {link.badge && (
                                    <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold leading-none bg-[#146C54] text-white">
                                        {link.badge}
                                    </span>
                                )}
                            </Link>
                        ))}
                        <div className="px-6 py-3 border-t border-[#EAEAEA] mt-1">
                            <a
                                href={buildCtaUrl(WA_URL, "navbar")}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-center gap-2 w-full h-11 text-sm font-medium text-white bg-[#146C54] rounded-[6px]"
                            >
                                <WaIcon />
                                {CTA_TEXT}
                            </a>
                        </div>
                    </nav>
                </div>
            )}

            {/* Mobile sticky estimate bar */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 p-3 bg-white border-t border-[#EAEAEA] shadow-lg">
                <a
                    href={buildCtaUrl(WA_URL, "mobile_sticky")}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full h-12 text-sm font-medium text-white bg-[#146C54] rounded-[8px]"
                >
                    <WaIcon />
                    Get My Estimate
                </a>
            </div>
        </header>
    );
}
