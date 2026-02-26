/**
 * Navigation – availability tests
 *
 * Tests run against Navbar and Footer directly (both are synchronous
 * components) so they work in jsdom without a running server.
 */
import { render, screen } from "@testing-library/react";
import { describe, it, expect, beforeEach } from "vitest";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const WA_BASE = "https://wa.me/";

// ── Navbar ────────────────────────────────────────────────────────────────────
describe("Navigation – header (Navbar)", () => {
    beforeEach(() => render(<Navbar />));

    it("renders the logo link pointing to '/'", () => {
        const logo = screen.getByRole("link", { name: /clearoutspaces home/i });
        expect(logo).toBeInTheDocument();
        expect(logo).toHaveAttribute("href", "/");
    });

    it("renders all primary nav links", () => {
        // Listings link name is "Listings NEW" due to badge inside <a>
        expect(screen.getByRole("link", { name: /^listings/i })).toBeInTheDocument();
        expect(screen.getByRole("link", { name: /^services$/i })).toBeInTheDocument();
        expect(screen.getByRole("link", { name: /^pricing$/i })).toBeInTheDocument();
        expect(screen.getByRole("link", { name: /^faq$/i })).toBeInTheDocument();
    });

    it("nav links point to the correct hrefs", () => {
        expect(screen.getByRole("link", { name: /^listings/i })).toHaveAttribute("href", "/listings");
        expect(screen.getByRole("link", { name: /^services$/i })).toHaveAttribute("href", "/services");
        expect(screen.getByRole("link", { name: /^pricing$/i })).toHaveAttribute("href", "/pricing");
        expect(screen.getByRole("link", { name: /^faq$/i })).toHaveAttribute("href", "/faq");
    });

    it("desktop CTA 'Get Estimate' links to WhatsApp", () => {
        const ctas = screen.getAllByRole("link", { name: /get estimate/i });
        expect(ctas.length).toBeGreaterThanOrEqual(1);
        expect(ctas[0].getAttribute("href")).toMatch(WA_BASE);
    });

    it("no nav link has an empty href", () => {
        screen.getAllByRole("link").forEach((link) => {
            expect(link.getAttribute("href")).toBeTruthy();
        });
    });
});

// ── Footer ────────────────────────────────────────────────────────────────────
describe("Navigation – footer (Footer)", () => {
    beforeEach(() => render(<Footer />));

    it("renders the brand name in the footer", () => {
        // Footer brand is a div (no logo link), just assert the text is present
        expect(screen.getByText(/clearoutspaces/i)).toBeInTheDocument();
    });

    it("renders a Privacy Policy link pointing to '/privacy'", () => {
        const link = screen.getByRole("link", { name: /privacy policy/i });
        expect(link).toBeInTheDocument();
        expect(link).toHaveAttribute("href", "/privacy");
    });

    it("renders a Terms link pointing to '/terms'", () => {
        const link = screen.getByRole("link", { name: /^terms$/i });
        expect(link).toBeInTheDocument();
        expect(link).toHaveAttribute("href", "/terms");
    });

    it("renders a 'Chat on WhatsApp' link", () => {
        const link = screen.getByRole("link", { name: /chat on whatsapp/i });
        expect(link).toBeInTheDocument();
        expect(link.getAttribute("href")).toMatch(WA_BASE);
    });

    it("renders all six navigation links in the navigate column", () => {
        const navLinks = ["/services", "/pricing", "/faq", "/listings", "/privacy", "/terms"];
        navLinks.forEach((href) => {
            const found = screen.getAllByRole("link").some((l) => l.getAttribute("href") === href);
            expect(found, `missing link to ${href}`).toBe(true);
        });
    });

    it("no footer link has an empty href", () => {
        screen.getAllByRole("link").forEach((link) => {
            expect(link.getAttribute("href")).toBeTruthy();
        });
    });
});
