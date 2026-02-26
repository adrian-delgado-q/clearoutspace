import { auth, signOut } from "@/auth";
import Link from "next/link";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const session = await auth();
  if (!session) redirect("/login");

  return (
    <div className="min-h-screen flex bg-stone-100">
      {/* ── SIDEBAR ─────────────────────────────── */}
      <aside className="w-56 shrink-0 bg-white border-r border-stone-200 flex flex-col">
        {/* Logo */}
        <div className="px-5 py-5 border-b border-stone-200">
          <Link href="/" className="text-lg font-bold text-slate-900 tracking-tight">
            Clearout<span className="text-emerald-700">Space</span>
          </Link>
          <p className="text-xs text-slate-400 mt-0.5">Staff Dashboard</p>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1 text-sm">
          <NavLink href="/dashboard/leads">📋 Leads Queue</NavLink>
        </nav>

        {/* User + sign-out */}
        <div className="px-4 py-4 border-t border-stone-200 text-xs">
          <p className="text-slate-400 truncate mb-2">{session.user?.email}</p>
          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/login" });
            }}
          >
            <button
              type="submit"
              className="w-full text-left text-slate-400 hover:text-slate-800 transition font-medium"
            >
              → Sign out
            </button>
          </form>
        </div>
      </aside>

      {/* ── MAIN ────────────────────────────────── */}
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}

function NavLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link
      href={href}
      className="flex items-center gap-2 px-3 py-2 rounded-lg text-slate-600 hover:bg-stone-50 hover:text-emerald-700 transition font-medium"
    >
      {children}
    </Link>
  );
}
