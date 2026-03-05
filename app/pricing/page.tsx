import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import Container from "@/components/layout/Container";
import FinalCTA from "@/components/sections/FinalCTA";

export const revalidate = 3600;

const DEFAULT_GROUPS = [
    { unitType: "Studio", clearoutTypical: "$399–$549", cleaningTypical: "$199–$299", bundleTypical: "$549–$799" },
    { unitType: "1 Bedroom", clearoutTypical: "$499–$749", cleaningTypical: "$249–$399", bundleTypical: "$699–$999" },
    { unitType: "2 Bedroom", clearoutTypical: "$749–$1,100", cleaningTypical: "$349–$499", bundleTypical: "$999–$1,499" },
    { unitType: "Larger (3BR+)", clearoutTypical: "$1,100+", cleaningTypical: "$499+", bundleTypical: "$1,499+" },
];

const DEFAULT_VARIABLES = [
    "Unit size (studio, 1BR, 2BR, larger)",
    "Volume and weight of items",
    "Elevator access vs. stairs",
    "Cleaning scope: standard vs. deep clean",
    "Listing management add-on",
    "Same-day vs. scheduled booking",
    "Disassembly required for bulky items",
];

export async function generateMetadata(): Promise<Metadata> {
    return buildMetadata({
        title: "Pricing – ClearoutSpaces",
        description:
            "Transparent move-out pricing for Toronto condos. Clearout, cleaning, and bundle packages. No surprise fees.",
        path: "/pricing",
    });
}

export default async function PricingPage() {
    const waBase = "https://wa.me/16479227067";
    const groups = DEFAULT_GROUPS;
    const variables = DEFAULT_VARIABLES;

    return (
        <>
            {/* Hero */}
            <section className="py-16 md:py-24 bg-white border-b border-[#EAEAEA]">
                <Container>
                    <p className="text-xs font-semibold uppercase tracking-widest text-[#146C54] mb-4">Transparent Pricing</p>
                    <h1
                        className="font-semibold text-[#111111] leading-[1.05] max-w-2xl mb-4"
                        style={{ fontSize: "clamp(32px, 5vw, 56px)" }}
                    >
                        Pricing
                    </h1>
                    <p className="text-lg text-[#5A5A5A] max-w-2xl leading-relaxed">
                        Ranges below are typical for Toronto condos. Send 2–3 photos on WhatsApp for an exact quote within
                        minutes. The price we quote is the price you pay — no surprise heavy-item fees.
                    </p>
                </Container>
            </section>

            {/* Pricing table */}
            <section className="section-padding bg-[#F7F7F7]">
                <Container>
                    <h2
                        className="font-semibold text-[#111111] leading-[1.2] mb-10"
                        style={{ fontSize: "clamp(22px, 3vw, 32px)" }}
                    >
                        Typical Ranges by Unit Size
                    </h2>

                    {/* Mobile: cards */}
                    <div className="md:hidden flex flex-col gap-4">
                        {groups.map((g, i) => (
                            <div key={i} className="border border-[#EAEAEA] rounded-[8px] bg-white p-6">
                                <h3 className="font-semibold text-[#111111] text-base mb-4">{g.unitType}</h3>
                                <div className="grid grid-cols-3 gap-3 text-center">
                                    <div>
                                        <p className="text-[11px] text-[#5A5A5A] uppercase tracking-wide mb-1">Clearout</p>
                                        <p className="text-sm font-semibold text-[#111111]">{g.clearoutTypical ?? "–"}</p>
                                    </div>
                                    <div>
                                        <p className="text-[11px] text-[#5A5A5A] uppercase tracking-wide mb-1">Cleaning</p>
                                        <p className="text-sm font-semibold text-[#111111]">{g.cleaningTypical ?? "–"}</p>
                                    </div>
                                    <div>
                                        <p className="text-[11px] text-[#146C54] uppercase tracking-wide mb-1 font-medium">Bundle</p>
                                        <p className="text-sm font-semibold text-[#146C54]">{g.bundleTypical ?? "–"}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Desktop: table */}
                    <div className="hidden md:block border border-[#EAEAEA] rounded-[8px] overflow-hidden bg-white">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-[#EAEAEA] bg-[#F7F7F7]">
                                    <th className="text-left p-4 font-semibold text-[#111111]">Unit Type</th>
                                    <th className="text-right p-4 font-semibold text-[#111111]">Clearout</th>
                                    <th className="text-right p-4 font-semibold text-[#111111]">Cleaning</th>
                                    <th className="text-right p-4 font-semibold text-[#146C54] bg-[#F0FAF6]">
                                        <span className="flex items-center justify-end gap-2">
                                            Bundle (Both)
                                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#146C54] text-white leading-none">
                                                BEST VALUE
                                            </span>
                                        </span>
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {groups.map((g, i) => (
                                    <tr key={i} className={i < groups.length - 1 ? "border-b border-[#EAEAEA]" : ""}>
                                        <td className="p-4 font-medium text-[#111111]">{g.unitType}</td>
                                        <td className="p-4 text-right tabular-nums text-[#5A5A5A]">{g.clearoutTypical ?? "–"}</td>
                                        <td className="p-4 text-right tabular-nums text-[#5A5A5A]">{g.cleaningTypical ?? "–"}</td>
                                        <td className="p-4 text-right tabular-nums font-semibold text-[#146C54] bg-[#F0FAF6]">{g.bundleTypical ?? "–"}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <p className="mt-4 text-[13px] text-[#5A5A5A]">
                        * All prices are estimates in CAD. Final quote provided on WhatsApp after photos.
                        Listing management commission is separate (20% bundle / 30–35% standalone).
                    </p>
                </Container>
            </section>

            {/* Variables */}
            <section className="section-padding bg-white">
                <Container>
                    <h2
                        className="font-semibold text-[#111111] leading-[1.2] mb-3 tracking-tight"
                        style={{ fontSize: "clamp(22px, 3vw, 32px)" }}
                    >
                        What affects your price
                    </h2>
                    <p className="text-[15px] text-[#5A5A5A] leading-relaxed mb-10">
                        Every move-out is different. These factors shape your final quote.
                    </p>
                    <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {variables.map((v, i) => (
                            <li key={i} className="flex items-start gap-2.5">
                                <span className="flex-shrink-0 mt-0.5 w-4 h-4 rounded bg-[#E6F4F0] flex items-center justify-center" aria-hidden="true">
                                    <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                                        <path d="M1 4l2 2L7 2" stroke="#146C54" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </span>
                                <span className="text-[15px] text-[#5A5A5A] leading-relaxed">{v}</span>
                            </li>
                        ))}
                    </ul>
                </Container>
            </section>

            <FinalCTA
                title="Get your personalised quote"
                subtitle="No forms. Just WhatsApp."
                ctaHref={waBase}
                source="pricing"
            />
        </>
    );
}
