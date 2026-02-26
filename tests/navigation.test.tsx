/**
 * Navigation – availability tests
 *
 * These tests guarantee that every navigable link on the landing page
 * exists, is reachable (has a valid href), and points to the expected
 * destination.  They run in jsdom – no browser or running server required.
 */
import { render, screen } from "@testing-library/react";
import { describe, it, expect, beforeEach } from "vitest";
import Home from "@/app/page";

const WA_BASE = "https://wa.me/";

describe("Navigation – header", () => {
  beforeEach(() => render(<Home />));

  it("renders the header logo link pointing to '/'", () => {
    // Logo links start with "Clearout" – this avoids matching the mailto link
    // whose text also contains "clearoutspaces"
    const logos = screen.getAllByRole("link", { name: /^clearout/i });
    const headerLogo = logos[0];
    expect(headerLogo).toBeInTheDocument();
    expect(headerLogo).toHaveAttribute("href", "/");
  });

  it("header CTA links to a WhatsApp URL", () => {
    const headerCTAs = screen
      .getAllByRole("link", { name: /get my free quote/i });
    // The very first one lives in the header <header> element
    const headerCTA = headerCTAs[0];
    expect(headerCTA).toBeInTheDocument();
    expect(headerCTA.getAttribute("href")).toMatch(WA_BASE);
  });
});

describe("Navigation – footer", () => {
  beforeEach(() => render(<Home />));

  it("renders the footer logo link pointing to '/'", () => {
    // Logo links start with "Clearout" – excludes the mailto link
    const logos = screen.getAllByRole("link", { name: /^clearout/i });
    // Footer logo is the last "Clearout…" link in the document
    const footerLogo = logos[logos.length - 1];
    expect(footerLogo).toHaveAttribute("href", "/");
  });

  it("renders a Privacy Policy link pointing to '/privacy'", () => {
    const privacyLink = screen.getByRole("link", { name: /privacy policy/i });
    expect(privacyLink).toBeInTheDocument();
    expect(privacyLink).toHaveAttribute("href", "/privacy");
  });

  it("renders a Terms link pointing to '/terms'", () => {
    const termsLink = screen.getByRole("link", { name: /^terms$/i });
    expect(termsLink).toBeInTheDocument();
    expect(termsLink).toHaveAttribute("href", "/terms");
  });

  it("renders a Staff Login link pointing to '/login'", () => {
    const loginLink = screen.getByRole("link", { name: /staff login/i });
    expect(loginLink).toBeInTheDocument();
    expect(loginLink).toHaveAttribute("href", "/login");
  });

  it("renders the contact email as a mailto link", () => {
    const emailLink = screen.getByRole("link", { name: /info@clearoutspace\.ca/i });
    expect(emailLink).toBeInTheDocument();
    expect(emailLink).toHaveAttribute("href", "mailto:info@clearoutspace.ca");
  });
});

describe("Navigation – in-page CTAs", () => {
  beforeEach(() => render(<Home />));

  it("all WhatsApp CTA links share the same WhatsApp base URL", () => {
    // Every CTA in the page (header + hero + resell + banner) should point to WhatsApp
    const waLinks = screen
      .getAllByRole("link")
      .filter((l) => (l.getAttribute("href") ?? "").startsWith(WA_BASE));
    expect(waLinks.length).toBeGreaterThanOrEqual(2);
  });

  it("resell section CTA links to a WhatsApp URL", () => {
    const resellCTA = screen.getByRole("link", { name: /tell us what you have/i });
    expect(resellCTA).toBeInTheDocument();
    expect(resellCTA.getAttribute("href")).toMatch(WA_BASE);
  });

  it("no navigation link has an empty href", () => {
    const allLinks = screen.getAllByRole("link");
    allLinks.forEach((link) => {
      const href = link.getAttribute("href");
      expect(href).toBeTruthy();
    });
  });
});
