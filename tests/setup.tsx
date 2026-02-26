import "@testing-library/jest-dom";
import { vi } from "vitest";

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

// Stub next/font/google so layout tests don't need network access
vi.mock("next/font/google", () => ({
  Geist: () => ({ variable: "--font-geist-sans", className: "" }),
  Geist_Mono: () => ({ variable: "--font-geist-mono", className: "" }),
}));
