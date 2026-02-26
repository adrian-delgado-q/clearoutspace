"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      const consent = localStorage.getItem("cookie_consent");
      if (!consent) setVisible(true);
    } catch {
      // localStorage unavailable (SSR guard)
    }
  }, []);

  function accept() {
    localStorage.setItem("cookie_consent", "accepted");
    setVisible(false);
  }

  function decline() {
    localStorage.setItem("cookie_consent", "declined");
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label="Cookie consent"
      className="fixed bottom-0 left-0 right-0 z-50 border-t border-stone-200 bg-white px-4 py-4 shadow-lg sm:px-6"
    >
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-slate-600">
          We use cookies to improve your experience and analyse site traffic. By continuing,
          you agree to our{" "}
          <Link href="/privacy" className="font-semibold text-emerald-700 underline hover:text-emerald-800">
            Privacy Policy
          </Link>
          .
        </p>
        <div className="flex shrink-0 gap-2">
          <button
            onClick={decline}
            className="rounded-lg border border-stone-300 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-stone-50"
          >
            Decline
          </button>
          <button
            onClick={accept}
            className="rounded-lg bg-emerald-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-800"
          >
            Accept cookies
          </button>
        </div>
      </div>
    </div>
  );
}
