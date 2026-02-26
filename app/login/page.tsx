import { signIn } from "@/auth";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import Link from "next/link";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string; error?: string }>;
}) {
  const session = await auth();
  const { callbackUrl, error } = await searchParams;

  if (session) redirect(callbackUrl ?? "/dashboard/leads");

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-stone-100 px-4">
      {/* Decorative top bar */}
      <div className="fixed top-0 inset-x-0 h-1 bg-emerald-700" />

      {/* Logo above card */}
      <Link href="/" className="mb-6 text-2xl font-bold tracking-tight text-slate-900">
        Clearout<span className="text-emerald-700">Space</span>
      </Link>

      {/* Card */}
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-sm border border-stone-200 p-8 flex flex-col gap-5">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900">Staff Sign-in</h1>
          <p className="text-sm text-slate-500 mt-1">
            Use your team Google account to access the leads dashboard.
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">
            {error === "AccessDenied"
              ? "Your Google account is not authorised. Contact your manager."
              : "Sign-in failed. Please try again."}
          </div>
        )}

        {/* Google sign-in */}
        <form
          action={async () => {
            "use server";
            await signIn("google", {
              redirectTo: callbackUrl ?? "/dashboard/leads",
            });
          }}
        >
          <button
            type="submit"
            className="w-full flex items-center justify-center gap-3 border border-stone-200 rounded-xl px-5 py-3 text-sm font-semibold text-slate-700 bg-white hover:bg-stone-50 transition shadow-sm"
          >
            <GoogleIcon />
            Continue with Google
          </button>
        </form>

        <p className="text-xs text-slate-400 text-center pt-1 border-t border-stone-100">
          Not a team member? This area is for{" "}
          <span className="font-semibold text-slate-600">ClearoutSpace</span> staff only.
        </p>
      </div>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-5 h-5" aria-hidden>
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
}
