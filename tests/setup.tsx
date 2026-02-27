import "@testing-library/jest-dom";
import { vi, beforeAll } from "vitest";

// ── Environment variables ────────────────────────────────────────────────────
beforeAll(() => {
  process.env.NEXT_PUBLIC_WHATSAPP_URL = "https://wa.me/";
});

// ── Module mocks ─────────────────────────────────────────────────────────────
// Mock buildCtaUrl to ensure WhatsApp base URL is always included in tests
vi.mock("@/lib/whatsapp", async () => {
  const actual = await vi.importActual<typeof import("@/lib/whatsapp")>("@/lib/whatsapp");
  return {
    ...actual,
    buildCtaUrl: (base: string, source: string, serviceName?: string) => {
      const body = serviceName
        ? `Hi! I'm interested in the ${serviceName} service — can I get a quote?`
        : "";
      const url =
        base || "https://wa.me/";
      return `${url}?text=${encodeURIComponent(
        body || "Hi! I'm not sure which service fits best — can you help me figure out the right move-out option for my place?",
      )} | utm_source=${source}`;
    },
  };
});

// ── Next.js shims ────────────────────────────────────────────────────────────
// Render next/link as a plain <a> so hrefs are directly inspectable
vi.mock("next/link", () => ({
  default: ({
    href,
    children,
    ...rest
  }: {
    href: string;
    children: React.ReactNode;
    [key: string]: unknown;
  }) => (
    <a href={href} {...rest}>
      {children}
    </a>
  ),
}));

// Stub next/navigation hooks used internally by the app / Router
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn(), replace: vi.fn(), prefetch: vi.fn() }),
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => "/",
  redirect: vi.fn(),
}));

// Stub next/image to render a plain <img>
vi.mock("next/image", () => ({
  default: ({
    src,
    alt,
    ...rest
  }: {
    src: string;
    alt: string;
    [key: string]: unknown;
  }) => <img src={src} alt={alt} />,
}));

// Stub next/font/google so layout tests don't need network access
vi.mock("next/font/google", () => ({
  Inter: () => ({ variable: "--font-inter", className: "" }),
}));
