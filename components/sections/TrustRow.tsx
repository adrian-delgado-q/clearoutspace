import Container from "@/components/layout/Container";

interface TrustItem {
    iconName?: string | null;
    label: string;
}

interface TrustRowProps {
    title?: string;
    items?: TrustItem[];
}

const DEFAULT_ITEMS: TrustItem[] = [
    { label: "Fully insured" },
    { label: "Condo-building experience" },
    { label: "Coordinated scheduling" },
    { label: "Eco-conscious: zero landfill goal" },
    { label: "No forms — WhatsApp only" },
    { label: "Transparent pricing" },
];

export default function TrustRow({ title = "Why ClearoutSpaces", items = DEFAULT_ITEMS }: TrustRowProps) {
    const displayItems = items.length > 0 ? items : DEFAULT_ITEMS;
    return (
        <section className="section-padding bg-[#0B0B0B]">
            <Container>
                <h2
                    className="font-semibold text-white leading-[1.2] tracking-tight mb-12"
                    style={{ fontSize: "clamp(26px, 3.5vw, 38px)" }}
                >
                    {title}
                </h2>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {displayItems.map((item, i) => (
                        <div key={i} className="flex items-center gap-3">
                            <span
                                className="flex-shrink-0 w-5 h-5 rounded-full bg-[#146C54] flex items-center justify-center"
                                aria-hidden="true"
                            >
                                <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
                                    <path d="M2 5l2.5 2.5L8 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </span>
                            <span className="text-[15px] text-[#CCCCCC]">{item.label}</span>
                        </div>
                    ))}
                </div>
            </Container>
        </section>
    );
}
