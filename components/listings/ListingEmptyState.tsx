import { buildCtaUrl } from "@/lib/whatsapp";

const WA_URL = process.env.NEXT_PUBLIC_WHATSAPP_URL ?? "https://wa.me/12268992255";

const RECENTLY_SOLD = [
    { title: "IKEA KALLAX 4×4 Shelving Unit", price: "$85 CAD", area: "Liberty Village", condition: "Like New" },
    { title: "West Elm Dining Table (6-seat)", price: "$420 CAD", area: "Queen West", condition: "Good" },
    { title: "Samsung 55″ QLED TV + Stand", price: "$380 CAD", area: "Distillery District", condition: "Like New" },
];

export default function ListingEmptyState() {
    return (
        <div className="py-16">
            {/* Empty state box */}
            <div className="mx-auto max-w-lg rounded-[12px] border border-[#EAEAEA] bg-[#F7F7F7] px-10 py-12 text-center">
                <div className="mx-auto mb-5 w-14 h-14 rounded-full bg-[#E6F4F0] flex items-center justify-center" aria-hidden="true">
                    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#146C54" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" />
                        <polyline points="3.29 7 12 12 20.71 7" />
                        <line x1="12" y1="22" x2="12" y2="12" />
                    </svg>
                </div>
                <h2 className="text-xl font-semibold text-[#111111] mb-2">No active listings right now</h2>
                <p className="text-[15px] text-[#5A5A5A] mb-2">Items typically sell within 48 hours of going live.</p>
                <p className="text-[13px] text-[#5A5A5A] mb-8">We clear spaces weekly — new listings drop regularly.</p>

                {/* Notify CTA */}
                <div className="rounded-[8px] border border-[#EAEAEA] bg-white p-5 mb-6 text-left">
                    <p className="text-[13px] font-semibold text-[#111111] mb-1">🔔 Be first to know</p>
                    <p className="text-[13px] text-[#5A5A5A] mb-4">WhatsApp us the word <strong className="text-[#111111]">"Alerts"</strong> to get notified when new listings drop.</p>
                    <a
                        href={`${WA_URL}?text=${encodeURIComponent("Alerts")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 w-full h-11 text-sm font-medium text-white bg-[#146C54] hover:bg-[#0f5540] rounded-[6px] transition-colors"
                    >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" /><path d="M12 0C5.373 0 0 5.373 0 12c0 2.125.558 4.118 1.535 5.845L.057 23.75a.5.5 0 00.614.63l6.082-1.437A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.891 0-3.657-.5-5.186-1.374l-.37-.215-3.836.906.944-3.74-.233-.386A9.953 9.953 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" />
                        </svg>
                        WhatsApp &ldquo;Alerts&rdquo;
                    </a>
                </div>

                <a
                    href={buildCtaUrl(WA_URL, "listings_page")}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-[#146C54] hover:underline"
                >
                    Or get a move-out estimate →
                </a>
            </div>

            {/* Recently Sold */}
            <div className="mt-16">
                <p className="text-xs font-semibold uppercase tracking-widest text-[#5A5A5A] mb-6 text-center">Recently Sold</p>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {RECENTLY_SOLD.map((item, i) => (
                        <div key={i} className="relative border border-[#EAEAEA] rounded-[8px] p-6 bg-white overflow-hidden">
                            {/* Sold overlay ribbon */}
                            <div className="absolute top-3 right-3">
                                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[#111111] text-white uppercase tracking-wide">
                                    Sold
                                </span>
                            </div>
                            <div className="w-full rounded-[6px] bg-[#F7F7F7] aspect-[4/3] mb-4 flex items-center justify-center opacity-60">
                                <svg width="32" height="32" viewBox="0 0 64 64" fill="none" aria-hidden="true">
                                    <rect width="64" height="64" rx="8" fill="#EAEAEA" />
                                    <path d="M14 44l12-14 8 10 6-7 10 11H14z" fill="#D0D0D0" />
                                    <circle cx="44" cy="22" r="5" fill="#D0D0D0" />
                                </svg>
                            </div>
                            <p className="font-medium text-sm text-[#111111] mb-1 pr-16 leading-snug">{item.title}</p>
                            <p className="text-sm font-semibold text-[#5A5A5A] line-through mb-1">{item.price}</p>
                            <p className="text-xs text-[#9A9A9A]">{item.area} · {item.condition}</p>
                        </div>
                    ))}
                </div>
                <p className="mt-6 text-center text-[13px] text-[#5A5A5A]">These items sold within 48 hours of listing.</p>
            </div>
        </div>
    );
}
