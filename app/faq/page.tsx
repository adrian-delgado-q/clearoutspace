import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import Container from "@/components/layout/Container";
import FinalCTA from "@/components/sections/FinalCTA";
import FAQAccordion from "@/components/sections/FAQAccordion";

export const revalidate = 3600;

const WA_BASE = "https://wa.me/16479227067";

const DEFAULT_FAQS = [
    {
        question: "What is included in the 'Move-Out Done Right' bundle?",
        answer:
            "The bundle includes a full clearout (all items removed, sorted for donation/recycling/disposal), a deposit-ready move-out cleaning (surfaces, appliances inside-out, floors), and coordinated scheduling. Optional listing management is an add-on.",
    },
    {
        question: "Why is the bundle priced higher than clearout + cleaning added separately?",
        answer:
            "The bundle includes coordinated scheduling (one visit, one team), a single point of contact, condo-compliant workflow with elevator booking handled, and priority booking windows. These coordination services are built-in and justify the slight premium over booking separately.",
    },
    {
        question: "Do you handle elevator bookings?",
        answer:
            "Yes. For condo move-outs, we take care of notifying building management and booking the service elevator as required.",
    },
    {
        question: "How does listing management work?",
        answer:
            "Listing management is an optional add-on — primarily for bundle clients. On our first visit, we photograph items, create listings, and manage all buyer inquiries for a 1–2 week window (max 14 days). If unsold items remain, a second visit can be arranged for final removal. Commission: 20% for bundle clients, 30–35% standalone.",
    },
    {
        question: "Do you store items?",
        answer:
            "No storage in phase 1. All items are cleared, donated, recycled, or listed for pickup during the managed window.",
    },
    {
        question: "Can I see the listing items before contact?",
        answer:
            "Yes — visit our /listings page. Items show general area only (no addresses). Contact goes through ClearoutSpaces, not directly to a private seller.",
    },
    {
        question: "What if my item sells before the deadline?",
        answer:
            "Great! Commission is owed on the sale price. Unsold items after the window are handled in a second visit (if arranged) or donated/disposed.",
    },
    {
        question: "Do you serve areas outside Toronto?",
        answer:
            "We primarily serve central Toronto and inner suburbs (Liberty Village, King West, Leslieville, etc.). Contact us on WhatsApp to confirm your location.",
    },
    {
        question: "How quickly can you come?",
        answer:
            "Bundle clients get priority booking. Most bookings are available within 72 hours. Same-day may be possible — ask on WhatsApp.",
    },
    {
        question: "What cleaning is included for move-out?",
        answer:
            "Our move-out clean is deposit-recovery focused: all rooms, kitchen, bathrooms, inside oven, fridge, and microwave, baseboards, window sills. We follow standard landlord inspection checklists.",
    },
];

export async function generateMetadata(): Promise<Metadata> {
    return buildMetadata({
        title: "FAQ – ClearoutSpaces",
        description:
            "Answers to common questions about move-out clearouts, cleaning, listing management, and pricing in Toronto.",
        path: "/faq",
    });
}

export default async function FAQPage() {
    return (
        <>
            <section className="py-16 md:py-24 bg-white border-b border-[#EAEAEA]">
                <Container>
                    <p className="text-xs font-semibold uppercase tracking-widest text-[#146C54] mb-4">FAQ</p>
                    <h1
                        className="font-semibold text-[#111111] leading-[1.05] max-w-2xl"
                        style={{ fontSize: "clamp(32px, 5vw, 56px)" }}
                    >
                        Frequently Asked Questions
                    </h1>
                </Container>
            </section>

            <section className="section-padding bg-[#F7F7F7]">
                <Container>
                    <div className="max-w-3xl">
                        <FAQAccordion faqs={DEFAULT_FAQS} />
                    </div>
                </Container>
            </section>

            <FinalCTA ctaHref={WA_BASE} source="faq" />
        </>
    );
}
