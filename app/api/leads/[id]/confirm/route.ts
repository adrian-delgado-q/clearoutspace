import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

const N8N_BASE = process.env.N8N_BASE_URL ?? "http://testdomain.com";
const N8N_CONFIRM_WEBHOOK = `${N8N_BASE}/webhook/confirm-quote`;
const N8N_MANUAL_MESSAGE_WEBHOOK = `${N8N_BASE}/webhook/send-manual-message`;

type Params = { params: Promise<{ id: string }> };

/** POST /api/leads/[id]/confirm — confirm the quote, trigger n8n webhook */
export async function POST(req: NextRequest, { params }: Params) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await req.json().catch(() => ({}));

  const lead = await prisma.lead.findUnique({ where: { id } });
  if (!lead) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const confirmedEstimate: number = body.estimate ?? lead.estimate ?? 0;

  // Update DB
  const updated = await prisma.lead.update({
    where: { id },
    data: {
      status: "CONFIRMED",
      estimate: confirmedEstimate,
    },
  });

  // Fire n8n webhook
  try {
    const n8nRes = await fetch(N8N_CONFIRM_WEBHOOK, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        phone: lead.phone,
        estimate: confirmedEstimate,
        leadId: id,
      }),
    });

    if (!n8nRes.ok) {
      console.error("n8n webhook failed:", await n8nRes.text());
    }
  } catch (err) {
    console.error("n8n webhook error:", err);
    // Don't fail the request — DB is already updated
  }

  return NextResponse.json(updated);
}
