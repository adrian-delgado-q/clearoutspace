"use client";

import { useState, useTransition } from "react";
import {
  confirmLeadAction,
  updateLeadStatusAction,
  sendManualMessageAction,
} from "../../actions";

const STATUS_STYLES: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-800",
  CONFIRMED: "bg-green-100 text-green-800",
  FLAGGED: "bg-orange-100 text-orange-800",
  REJECTED: "bg-red-100 text-red-800",
  BOOKED: "bg-blue-100 text-blue-800",
};

export function LeadActions({
  leadId,
  status,
  estimate,
}: {
  leadId: string;
  status: string;
  estimate: number | null;
}) {
  const [isPending, startTransition] = useTransition();
  const [confirmEstimate, setConfirmEstimate] = useState(String(estimate ?? ""));
  const [message, setMessage] = useState("");
  const [msgStatus, setMsgStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function handleSendMessage() {
    if (!message.trim()) return;
    setMsgStatus("sending");
    try {
      await sendManualMessageAction(leadId, message);
      setMessage("");
      setMsgStatus("sent");
      setTimeout(() => setMsgStatus("idle"), 3000);
    } catch {
      setMsgStatus("error");
    }
  }

  return (
    <div className="space-y-6">
      {/* Status badge */}
      <div>
        <span
          className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
            STATUS_STYLES[status] ?? "bg-slate-100 text-slate-600"
          }`}
        >
          {status.charAt(0) + status.slice(1).toLowerCase()}
        </span>
      </div>

      {/* Confirm with editable estimate */}
      {(status === "PENDING" || status === "FLAGGED") && (
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-slate-700">
            Estimate (CAD)
          </label>
          <input
            type="number"
            value={confirmEstimate}
            onChange={(e) => setConfirmEstimate(e.target.value)}
            className="border border-slate-300 rounded-lg px-3 py-2 text-sm w-44"
            placeholder="e.g. 450"
          />
          <button
            disabled={isPending}
            onClick={() =>
              startTransition(() =>
                confirmLeadAction(leadId, parseFloat(confirmEstimate) || 0)
              )
            }
            className="w-fit px-4 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-semibold transition disabled:opacity-50"
          >
            ✓ Confirm Quote &amp; Send to Customer
          </button>
        </div>
      )}

      {/* Other status actions */}
      <div className="flex flex-wrap gap-2">
        {status === "PENDING" && (
          <button
            disabled={isPending}
            onClick={() =>
              startTransition(() => updateLeadStatusAction(leadId, "FLAGGED"))
            }
            className="px-3 py-1.5 rounded-lg bg-orange-100 hover:bg-orange-200 text-orange-700 text-sm transition"
          >
            🚩 Flag for Follow-up
          </button>
        )}
        {status !== "REJECTED" && status !== "BOOKED" && (
          <button
            disabled={isPending}
            onClick={() =>
              startTransition(() => updateLeadStatusAction(leadId, "REJECTED"))
            }
            className="px-3 py-1.5 rounded-lg bg-red-100 hover:bg-red-200 text-red-700 text-sm transition"
          >
            ✕ Reject
          </button>
        )}
        {status === "CONFIRMED" && (
          <button
            disabled={isPending}
            onClick={() =>
              startTransition(() => updateLeadStatusAction(leadId, "BOOKED"))
            }
            className="px-3 py-1.5 rounded-lg bg-blue-100 hover:bg-blue-200 text-blue-700 text-sm transition"
          >
            📅 Mark as Booked
          </button>
        )}
      </div>

      {/* Manual message */}
      <div className="border-t pt-5">
        <h3 className="text-sm font-semibold text-slate-700 mb-2">
          Send Manual WhatsApp Message
        </h3>
        <textarea
          rows={3}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message to send via WhatsApp…"
          className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm resize-none"
        />
        <div className="flex items-center gap-3 mt-2">
          <button
            disabled={msgStatus === "sending" || !message.trim()}
            onClick={handleSendMessage}
            className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-semibold rounded-lg transition disabled:opacity-50"
          >
            {msgStatus === "sending" ? "Sending…" : "Send via WhatsApp"}
          </button>
          {msgStatus === "sent" && (
            <span className="text-green-600 text-sm">✓ Sent!</span>
          )}
          {msgStatus === "error" && (
            <span className="text-red-500 text-sm">Failed to send. Check n8n.</span>
          )}
        </div>
      </div>
    </div>
  );
}
