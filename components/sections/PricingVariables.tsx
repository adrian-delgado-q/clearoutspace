import Container from "@/components/layout/Container";

interface PricingVariablesProps {
    title?: string;
    items?: string[];
}

const DEFAULT_ITEMS = [
    "Unit size (studio, 1BR, 2BR, larger)",
    "Volume and weight of items",
    "Elevator access vs. stairs",
    "Cleaning scope (standard vs. deep clean)",
    "Listing management add-on if selected",
    "Same-day or scheduled booking",
];

export default function PricingVariables({
    title = "Every move-out is different. Price depends on:",
    items = DEFAULT_ITEMS,
}: PricingVariablesProps) {
    const displayItems = items.length > 0 ? items : DEFAULT_ITEMS;
    return (
        <section className="section-padding bg-[#F7F7F7]">
            <Container>
                <div className="grid md:grid-cols-2 gap-12 items-start">
                    <div>
                        <h2
                            className="font-semibold text-[#111111] leading-[1.2] mb-6"
                            style={{ fontSize: "clamp(22px, 3vw, 32px)" }}
                        >
                            {title}
                        </h2>
                        <p className="text-[15px] text-[#5A5A5A] leading-relaxed mb-8">
                            We give transparent quotes on WhatsApp after 2–3 photos and a quick description.
                            No surprise fees at the door.
                        </p>
                        <a
                            href="/pricing"
                            className="inline-flex items-center text-sm font-medium text-[#146C54] hover:underline"
                        >
                            See pricing guide →
                        </a>
                    </div>
                    <ul className="grid sm:grid-cols-2 gap-4">
                        {displayItems.map((item, i) => (
                            <li key={i} className="flex items-start gap-3">
                                <span
                                    className="flex-shrink-0 mt-0.5 w-4 h-4 rounded bg-[#E6F4F0] flex items-center justify-center"
                                    aria-hidden="true"
                                >
                                    <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                                        <path d="M1 4l2 2L7 2" stroke="#146C54" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </span>
                                <span className="text-[15px] text-[#5A5A5A] leading-relaxed">{item}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </Container>
        </section>
    );
}
