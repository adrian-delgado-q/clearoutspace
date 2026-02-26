import { prisma } from "@/lib/prisma";
import { LeadsTable } from "./_components/LeadsTable";

export const dynamic = "force-dynamic";

export default async function LeadsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;

  const leads = await prisma.lead.findMany({
    where: status ? { status: status as never } : undefined,
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      createdAt: true,
      phone: true,
      estimate: true,
      confidence: true,
      itemsFound: true,
      status: true,
      notes: true,
    },
  });

  const counts = await prisma.lead.groupBy({
    by: ["status"],
    _count: { status: true },
  });
  const countMap = Object.fromEntries(
    counts.map((c) => [c.status, c._count.status] as [string, number])
  );

  const statuses = ["PENDING", "CONFIRMED", "FLAGGED", "REJECTED", "BOOKED"] as const;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-slate-900">Leads Queue</h1>
        <p className="text-slate-500 text-sm mt-1">
          Incoming quote requests from WhatsApp. Confirm to send the price back to the customer.
        </p>
      </div>

      {/* Status filter tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        <FilterTab href="/dashboard/leads" active={!status} label="All" count={leads.length} />
        {statuses.map((s) => (
          <FilterTab
            key={s}
            href={`/dashboard/leads?status=${s}`}
            active={status === s}
            label={s.charAt(0) + s.slice(1).toLowerCase()}
            count={countMap[s] ?? 0}
          />
        ))}
      </div>

      {/* Table */}
      <LeadsTable leads={leads} />
    </div>
  );
}

function FilterTab({
  href,
  active,
  label,
  count,
}: {
  href: string;
  active: boolean;
  label: string;
  count: number;
}) {
  return (
    <a
      href={href}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition ${
        active
          ? "bg-emerald-700 text-white"
          : "bg-white border border-stone-200 text-slate-600 hover:bg-stone-50"
      }`}
    >
      {label}
      <span
        className={`text-xs px-1.5 py-0.5 rounded-full font-mono ${
          active ? "bg-emerald-900 text-emerald-100" : "bg-stone-100 text-slate-500"
        }`}
      >
        {count}
      </span>
    </a>
  );
}
