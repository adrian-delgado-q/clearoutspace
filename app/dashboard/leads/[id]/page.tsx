import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { LeadActions } from "./_components/LeadActions";

export const dynamic = "force-dynamic";

type Message = {
  role: "user" | "assistant" | "system";
  content: string;
  ts?: string;
};

export default async function LeadDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const lead = await prisma.lead.findUnique({ where: { id } });
  if (!lead) notFound();

  let messages: Message[] = [];
  try {
    if (lead.conversation) {
      messages = JSON.parse(lead.conversation) as Message[];
    }
  } catch {
    // malformed JSON — ignore
  }

  const metaItems = [
    { label: "Phone", value: lead.phone },
    { label: "Estimate", value: lead.estimate != null ? `$${lead.estimate.toLocaleString()} CAD` : "—" },
    { label: "Confidence", value: lead.confidence ?? "—" },
    { label: "Items Found", value: lead.itemsFound ?? "—" },
    { label: "Address", value: lead.address ?? "—" },
    {
      label: "Created",
      value: new Date(lead.createdAt).toLocaleString("en-CA", {
        dateStyle: "medium",
        timeStyle: "short",
      }),
    },
  ];

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Back link */}
      <Link
        href="/dashboard/leads"
        className="text-sm text-slate-500 hover:text-slate-800 transition"
      >
        ← Back to Leads
      </Link>

      <div className="mt-4 mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Lead: {lead.phone}</h1>
        <p className="text-slate-400 text-xs mt-1 font-mono">{lead.id}</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* ── LEFT: meta + actions ── */}
        <div className="space-y-6">
          {/* Meta */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
            <h2 className="font-semibold text-slate-700 mb-4">Quote Details</h2>
            <dl className="space-y-2 text-sm">
              {metaItems.map(({ label, value }) => (
                <div key={label} className="flex gap-2">
                  <dt className="w-28 shrink-0 text-slate-400">{label}</dt>
                  <dd className="text-slate-800 font-medium">{value}</dd>
                </div>
              ))}
            </dl>
            {lead.notes && (
              <div className="mt-4 pt-4 border-t border-slate-100 text-sm text-slate-600">
                <span className="font-medium text-slate-500">Notes: </span>
                {lead.notes}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
            <h2 className="font-semibold text-slate-700 mb-4">Actions</h2>
            <LeadActions leadId={lead.id} status={lead.status} estimate={lead.estimate} />
          </div>
        </div>

        {/* ── RIGHT: conversation ── */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100">
            <h2 className="font-semibold text-slate-700">Conversation History</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Pulled from Redis via n8n. Read-only.
            </p>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3 max-h-[520px]">
            {messages.length === 0 ? (
              <p className="text-slate-400 text-sm text-center py-10">
                No conversation history yet.
              </p>
            ) : (
              messages.map((msg, i) => (
                <MessageBubble key={i} message={msg} />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function MessageBubble({ message }: { message: Message }) {
  const isCustomer = message.role === "user";
  return (
    <div className={`flex ${isCustomer ? "justify-start" : "justify-end"}`}>
      <div
        className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
          isCustomer
            ? "bg-slate-100 text-slate-800 rounded-tl-sm"
            : "bg-green-500 text-white rounded-tr-sm"
        }`}
      >
        <p>{message.content}</p>
        {message.ts && (
          <p className={`text-xs mt-1 ${isCustomer ? "text-slate-400" : "text-green-100"}`}>
            {new Date(message.ts).toLocaleTimeString("en-CA", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        )}
      </div>
    </div>
  );
}
