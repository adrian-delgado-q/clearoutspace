"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import {
  confirmLeadAction,
  updateLeadStatusAction,
  updateLeadEstimateAction,
} from "../actions";

export type LeadRow = {
  id: string;
  createdAt: Date;
  phone: string;
  estimate: number | null;
  confidence: string | null;
  itemsFound: string | null;
  status: string;
  notes: string | null;
};

const STATUS_STYLES: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-800",
  CONFIRMED: "bg-green-100 text-green-800",
  FLAGGED: "bg-orange-100 text-orange-800",
  REJECTED: "bg-red-100 text-red-800",
  BOOKED: "bg-blue-100 text-blue-800",
};

const CONFIDENCE_STYLES: Record<string, string> = {
  High: "text-green-700 font-semibold",
  Medium: "text-yellow-600 font-semibold",
  Low: "text-red-600 font-semibold",
};

export function LeadsTable({ leads }: { leads: LeadRow[] }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 shadow-sm bg-white">
      <table className="min-w-full divide-y divide-slate-100 text-sm">
        <thead className="bg-slate-50 text-xs uppercase text-slate-500 tracking-wider">
          <tr>
            <th className="px-4 py-3 text-left">Timestamp</th>
            <th className="px-4 py-3 text-left">Phone</th>
            <th className="px-4 py-3 text-left">Estimate</th>
            <th className="px-4 py-3 text-left">Confidence</th>
            <th className="px-4 py-3 text-left">Items Found</th>
            <th className="px-4 py-3 text-left">Status</th>
            <th className="px-4 py-3 text-left">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {leads.length === 0 && (
            <tr>
              <td colSpan={7} className="text-center py-12 text-slate-400">
                No leads yet. Quotes will appear here once customers contact you on WhatsApp.
              </td>
            </tr>
          )}
          {leads.map((lead) => (
            <LeadRow key={lead.id} lead={lead} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

function LeadRow({ lead }: { lead: LeadRow }) {
  const [isPending, startTransition] = useTransition();
  const [editingEstimate, setEditingEstimate] = useState(false);
  const [estimateVal, setEstimateVal] = useState(String(lead.estimate ?? ""));

  function saveEstimate() {
    const n = parseFloat(estimateVal);
    if (isNaN(n)) return;
    startTransition(() => updateLeadEstimateAction(lead.id, n));
    setEditingEstimate(false);
  }

  return (
    <tr className={`hover:bg-slate-50 transition ${isPending ? "opacity-50" : ""}`}>
      {/* Timestamp */}
      <td className="px-4 py-3 text-slate-500 whitespace-nowrap">
        {new Date(lead.createdAt).toLocaleString("en-CA", {
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })}
      </td>

      {/* Phone */}
      <td className="px-4 py-3 font-mono text-slate-700">{lead.phone}</td>

      {/* Estimate */}
      <td className="px-4 py-3 text-slate-700">
        {editingEstimate ? (
          <span className="flex items-center gap-1">
            <input
              type="number"
              value={estimateVal}
              onChange={(e) => setEstimateVal(e.target.value)}
              className="w-24 border border-slate-300 rounded px-2 py-1 text-sm"
              autoFocus
            />
            <button
              onClick={saveEstimate}
              className="text-green-600 hover:text-green-800 text-xs font-semibold"
            >
              Save
            </button>
            <button
              onClick={() => setEditingEstimate(false)}
              className="text-slate-400 hover:text-slate-600 text-xs"
            >
              ×
            </button>
          </span>
        ) : (
          <button
            onClick={() => setEditingEstimate(true)}
            className="hover:underline text-left"
            title="Click to edit"
          >
            {lead.estimate != null ? `$${lead.estimate.toLocaleString()} CAD` : "—"}
          </button>
        )}
      </td>

      {/* Confidence */}
      <td className={`px-4 py-3 ${lead.confidence ? CONFIDENCE_STYLES[lead.confidence] ?? "" : "text-slate-400"}`}>
        {lead.confidence ?? "—"}
      </td>

      {/* Items */}
      <td className="px-4 py-3 text-slate-600 max-w-xs truncate" title={lead.itemsFound ?? ""}>
        {lead.itemsFound ?? "—"}
      </td>

      {/* Status */}
      <td className="px-4 py-3">
        <span
          className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
            STATUS_STYLES[lead.status] ?? "bg-slate-100 text-slate-600"
          }`}
        >
          {lead.status.charAt(0) + lead.status.slice(1).toLowerCase().replace("_", " ")}
        </span>
      </td>

      {/* Actions */}
      <td className="px-4 py-3">
        <div className="flex items-center gap-2 flex-wrap">
          {/* View conversation */}
          <Link
            href={`/dashboard/leads/${lead.id}`}
            className="px-2 py-1 rounded text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
          >
            View
          </Link>

          {/* Confirm */}
          {(lead.status === "PENDING" || lead.status === "FLAGGED") && (
            <button
              onClick={() =>
                startTransition(() =>
                  confirmLeadAction(lead.id, lead.estimate ?? 0)
                )
              }
              className="px-2 py-1 rounded text-xs bg-emerald-700 hover:bg-emerald-800 text-white transition"
            >
              Confirm
            </button>
          )}

          {/* Flag */}
          {lead.status === "PENDING" && (
            <button
              onClick={() =>
                startTransition(() => updateLeadStatusAction(lead.id, "FLAGGED"))
              }
              className="px-2 py-1 rounded text-xs bg-orange-100 hover:bg-orange-200 text-orange-700 transition"
            >
              Flag
            </button>
          )}

          {/* Reject */}
          {lead.status !== "REJECTED" && lead.status !== "BOOKED" && (
            <button
              onClick={() =>
                startTransition(() => updateLeadStatusAction(lead.id, "REJECTED"))
              }
              className="px-2 py-1 rounded text-xs bg-red-100 hover:bg-red-200 text-red-700 transition"
            >
              Reject
            </button>
          )}

          {/* Mark Booked */}
          {lead.status === "CONFIRMED" && (
            <button
              onClick={() =>
                startTransition(() => updateLeadStatusAction(lead.id, "BOOKED"))
              }
              className="px-2 py-1 rounded text-xs bg-blue-100 hover:bg-blue-200 text-blue-700 transition"
            >
              Booked
            </button>
          )}
        </div>
      </td>
    </tr>
  );
}
