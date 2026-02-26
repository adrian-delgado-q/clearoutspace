import Container from "@/components/layout/Container";

interface SmartWayItem {
    iconName?: string | null;
    title: string;
    text: string;
}

interface SmartWayProps {
    title?: string;
    items?: SmartWayItem[];
}

const DEFAULT_ITEMS: SmartWayItem[] = [
    {
        iconName: "box",
        title: "One Coordinated Visit",
        text: "Clearout, cleaning, and optional listing setup happen in a single coordinated operation. No juggling multiple vendors.",
    },
    {
        iconName: "building",
        title: "Condo-Compliant",
        text: "We know elevator bookings, move-out rules, and building requirements. Zero risk of fines or delays.",
    },
    {
        iconName: "shield",
        title: "Deposit-Ready Results",
        text: "Our move-out cleaning is designed specifically to recover your security deposit. We know what landlords check.",
    },
    {
        iconName: "phone",
        title: "Single Point of Contact",
        text: "No coordinating between three separate companies. One team, one WhatsApp thread, one bill.",
    },
];

const ICONS: Record<string, React.ReactNode> = {
    box: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" />
            <polyline points="3.29 7 12 12 20.71 7" />
            <line x1="12" y1="22" x2="12" y2="12" />
        </svg>
    ),
    building: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <rect x="4" y="2" width="16" height="20" rx="2" />
            <path d="M9 22V12h6v10M9 6h1M14 6h1M9 10h1M14 10h1" />
        </svg>
    ),
    shield: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            <polyline points="9 12 11 14 15 10" />
        </svg>
    ),
    phone: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 011.74 3.44 2 2 0 013.71 1.28h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L7.91 9a16 16 0 006.2 6.2l1.81-1.81a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
        </svg>
    ),
};

export default function SmartWay({ title = "The Smart Way to Move Out", items = DEFAULT_ITEMS }: SmartWayProps) {
    const displayItems = items.length > 0 ? items : DEFAULT_ITEMS;
    return (
        <section className="section-padding bg-[#F7F7F7]">
            <div className="mx-auto w-full max-w-[1200px] px-6 md:px-8">
                <h2
                    className="font-semibold text-[#111111] leading-[1.2] tracking-tight mb-14 max-w-2xl"
                    style={{ fontSize: "clamp(26px, 3.5vw, 38px)" }}
                >
                    {title}
                </h2>
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">
                    {displayItems.map((item, i) => (
                        <div key={i} className="flex flex-col gap-4">
                            <div
                                className="w-10 h-10 flex items-center justify-center rounded-[6px] border border-[#EAEAEA] bg-white text-[#146C54]"
                                aria-hidden="true"
                            >
                                {ICONS[item.iconName ?? ""] ?? ICONS.box}
                            </div>
                            <h3 className="font-semibold text-[#111111] text-[18px]">{item.title}</h3>
                            <p className="text-[16px] text-[#5A5A5A] leading-relaxed">{item.text}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
