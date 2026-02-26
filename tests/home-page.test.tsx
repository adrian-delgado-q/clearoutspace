/**
 * Home page – rendering tests
 *
 * Tests run against the individual section components (Hero, SmartWay, etc.)
 * which are synchronous and renderable in jsdom.  The async server-component
 * wrapper (app/page.tsx) is covered indirectly – all the content it would
 * render lives in these components with their default props.
 */
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import Hero from "@/components/sections/Hero";
import SmartWay from "@/components/sections/SmartWay";
import ServicesPreview from "@/components/sections/ServicesPreview";
import TrustRow from "@/components/sections/TrustRow";
import FinalCTA from "@/components/sections/FinalCTA";

// ── Hero ─────────────────────────────────────────────────────────────────────
describe("Hero section", () => {
    it("renders the h1 heading", () => {
        render(<Hero />);
        expect(
            screen.getByRole("heading", { level: 1, name: /move-out done right/i }),
        ).toBeInTheDocument();
    });

    it("renders the subtitle text", () => {
        render(<Hero />);
        expect(screen.getByText(/clearout\. deposit-ready cleaning/i)).toBeInTheDocument();
    });

    it("renders the primary CTA linking to WhatsApp", () => {
        render(<Hero />);
        const cta = screen.getByRole("link", { name: /Get My Estimate/i });
        expect(cta).toBeInTheDocument();
        expect(cta.getAttribute("href")).toMatch(/wa\.me/);
    });

    it("renders the secondary 'See Services' link", () => {
        render(<Hero />);
        expect(screen.getByRole("link", { name: /see services/i })).toBeInTheDocument();
    });

    it("renders the trust badges under the CTA", () => {
        render(<Hero />);
        expect(screen.getByText(/fully insured/i)).toBeInTheDocument();
        expect(screen.getByText(/condo-compliant/i)).toBeInTheDocument();
        expect(screen.getByText(/no address stored/i)).toBeInTheDocument();
    });
});

// ── SmartWay ─────────────────────────────────────────────────────────────────
describe("SmartWay section", () => {
    it("renders the section heading", () => {
        render(<SmartWay />);
        expect(
            screen.getByRole("heading", { name: /the smart way to move out/i }),
        ).toBeInTheDocument();
    });

    it("renders all four benefit columns", () => {
        render(<SmartWay />);
        expect(screen.getByText(/one coordinated visit/i)).toBeInTheDocument();
        expect(screen.getByText(/condo-compliant/i)).toBeInTheDocument();
        expect(screen.getByText(/deposit-ready results/i)).toBeInTheDocument();
        expect(screen.getByText(/single point of contact/i)).toBeInTheDocument();
    });
});

// ── ServicesPreview ───────────────────────────────────────────────────────────
describe("ServicesPreview section", () => {
    it("renders the 'What We Do' heading", () => {
        render(<ServicesPreview />);
        expect(screen.getByRole("heading", { name: /what we do/i })).toBeInTheDocument();
    });

    it("renders all four service cards", () => {
        render(<ServicesPreview />);
        const headings = screen.getAllByRole("heading");
        const headingTexts = headings.map((h) => h.textContent?.toLowerCase() ?? "");
        expect(headingTexts.some((t) => /move-out done right/.test(t))).toBe(true);
        expect(headingTexts.some((t) => /^clearout$/.test(t))).toBe(true);
        expect(headingTexts.some((t) => /move-out cleaning/.test(t))).toBe(true);
        expect(headingTexts.some((t) => /listing management/.test(t))).toBe(true);
    });

    it("renders starting prices for services", () => {
        render(<ServicesPreview />);
        const prices = screen.getAllByText(/from \$\d+/i);
        expect(prices.length).toBeGreaterThanOrEqual(3);
    });

    it("renders the 'Popular' badge on the bundle card", () => {
        render(<ServicesPreview />);
        expect(screen.getByText(/popular/i)).toBeInTheDocument();
    });

    it("renders a 'View all services' link", () => {
        render(<ServicesPreview />);
        expect(screen.getByRole("link", { name: /view all services/i })).toBeInTheDocument();
    });
});

// ── TrustRow ─────────────────────────────────────────────────────────────────
describe("TrustRow section", () => {
    it("renders the section heading", () => {
        render(<TrustRow />);
        expect(screen.getByRole("heading", { name: /why clearoutspaces/i })).toBeInTheDocument();
    });

    it("renders key trust items", () => {
        render(<TrustRow />);
        expect(screen.getByText(/fully insured/i)).toBeInTheDocument();
        expect(screen.getByText(/no forms/i)).toBeInTheDocument();
        expect(screen.getByText(/transparent pricing/i)).toBeInTheDocument();
    });
});

// ── FinalCTA ─────────────────────────────────────────────────────────────────
describe("FinalCTA section", () => {
    it("renders the section heading", () => {
        render(<FinalCTA />);
        expect(
            screen.getByRole("heading", { name: /ready to move out without the stress/i }),
        ).toBeInTheDocument();
    });

    it("renders the CTA link pointing to WhatsApp", () => {
        render(<FinalCTA />);
        const cta = screen.getByRole("link", { name: /Get My Estimate/i });
        expect(cta).toBeInTheDocument();
        expect(cta.getAttribute("href")).toMatch(/wa\.me/);
    });

    it("renders the 'No forms. Just WhatsApp.' subtitle", () => {
        render(<FinalCTA />);
        expect(screen.getByText(/no forms\. just whatsapp/i)).toBeInTheDocument();
    });
});
