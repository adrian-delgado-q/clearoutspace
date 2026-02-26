import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

const N8N_BASE = process.env.N8N_BASE_URL ?? "http://testdomain.com";
const N8N_MANUAL_MESSAGE_WEBHOOK = `${N8N_BASE}/webhook/send-manual-message`;

type Params = { params: Promise<{ id: string }> };

/** POST /api/leads/[id]/message — send a manual WhatsApp reply via Evolution API (through n8n) */
export async function POST(req: NextRequest, { params }: Params) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const { message } = await req.json();

  if (!message?.trim()) {
    return NextResponse.json({ error: "message is required" }, { status: 400 });
  }

  const lead = await prisma.lead.findUnique({ where: { id } });
  if (!lead) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const n8nRes = await fetch(N8N_MANUAL_MESSAGE_WEBHOOK, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ phone: lead.phone, message, leadId: id }),
  });

  if (!n8nRes.ok) {
    return NextResponse.json(
      { error: "Failed to send via n8n", detail: await n8nRes.text() },
      { status: 502 }
    );
  }

  return NextResponse.json({ ok: true });
}
