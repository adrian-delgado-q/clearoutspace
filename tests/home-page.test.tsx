/**
 * Home page – rendering tests
 *
 * These tests guarantee that every critical section of the landing page
 * is present in the rendered output.  They run entirely in jsdom (no
 * browser, no network) and are therefore fast and safe for CI.
 */
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import Home from "@/app/page";

describe("Home page – rendering", () => {
    it("renders without crashing", () => {
        const { container } = render(<Home />);
        expect(container).toBeTruthy();
    });

    // ── Hero section ────────────────────────────────────────────────────────
    it("renders the hero heading", () => {
        render(<Home />);
        expect(
            screen.getByRole("heading", { level: 1, name: /clear out.*clean up/i })
        ).toBeInTheDocument();
    });

    it("renders the hero sub-text", () => {
        render(<Home />);
        expect(
            screen.getByText(/fast, affordable apartment cleanouts/i)
        ).toBeInTheDocument();
    });

    it("renders every hero bullet point", () => {
        render(<Home />);
        expect(screen.getByText(/same-day quotes/i)).toBeInTheDocument();
        expect(screen.getByText(/clear pricing/i)).toBeInTheDocument();
        expect(screen.getByText(/fully insured/i)).toBeInTheDocument();
    });

    // ── Services section ────────────────────────────────────────────────────
    it("renders the Apartment Cleanouts service card", () => {
        render(<Home />);
        expect(
            screen.getByRole("heading", { name: /apartment cleanouts/i })
        ).toBeInTheDocument();
    });

    it("renders the Professional Cleaning service card", () => {
        render(<Home />);
        expect(
            screen.getByRole("heading", { name: /professional cleaning/i })
        ).toBeInTheDocument();
    });

    it("renders starting prices for both services", () => {
        render(<Home />);
        const prices = screen.getAllByText(/\$\d+/);
        expect(prices.length).toBeGreaterThanOrEqual(2);
    });

    // ── Why choose / what we handle sections ───────────────────────────────
    it("renders the 'Why Choose ClearoutSpaces' section", () => {
        render(<Home />);
        expect(screen.getByRole("heading", { name: /why choose/i })).toBeInTheDocument();
    });

    it("renders the Need a Quote CTA banner", () => {
        render(<Home />);
        expect(screen.getByRole("heading", { name: /need a quote/i })).toBeInTheDocument();
    });

    // ── Resell section ─────────────────────────────────────────────────────
    it("renders the Resell & Save section heading", () => {
        render(<Home />);
        expect(
            screen.getByRole("heading", { name: /turn your old items into cash/i })
        ).toBeInTheDocument();
    });

    it("renders all three resell steps", () => {
        render(<Home />);
        // Query by heading role to avoid clashing with the CTA link that shares the same text
        const headings = screen.getAllByRole("heading").map((h) => h.textContent ?? "");
        expect(headings.some((t) => /tell us what you have/i.test(t))).toBe(true);
        expect(headings.some((t) => /we handle the listings/i.test(t))).toBe(true);
        expect(headings.some((t) => /proceeds offset your cost/i.test(t))).toBe(true);
    });

    it("renders the resell CTA link", () => {
        render(<Home />);
        expect(
            screen.getByRole("link", { name: /tell us what you have/i })
        ).toBeInTheDocument();
    });

    // ── CTA buttons ─────────────────────────────────────────────────────────
    it("renders at least one 'Get My Free Quote' call-to-action", () => {
        render(<Home />);
        const ctas = screen.getAllByRole("link", { name: /get my free quote/i });
        expect(ctas.length).toBeGreaterThanOrEqual(1);
    });

    it("renders the Chat on WhatsApp link", () => {
        render(<Home />);
        expect(screen.getByRole("link", { name: /chat on whatsapp/i })).toBeInTheDocument();
    });

    // ── Footer ──────────────────────────────────────────────────────────────
    it("renders the footer", () => {
        render(<Home />);
        // Footer contains the contact email
        expect(screen.getByRole("link", { name: /info@clearoutspace\.ca/i })).toBeInTheDocument();
    });
});
