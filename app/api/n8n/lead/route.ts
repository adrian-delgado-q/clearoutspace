import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

const WEBHOOK_SECRET = process.env.N8N_WEBHOOK_SECRET;

/**
 * POST /api/n8n/lead
 *
 * Called by n8n whenever a new quote request completes on WhatsApp.
 * Secured by a shared secret in the Authorization header.
 *
 * Expected body:
 * {
 *   phone: "+1416...",
 *   estimate: 450,
 *   confidence: "High",
 *   itemsFound: "Sofa, bed frame, dresser",
 *   conversation: "[{role,content,ts},...]"   // JSON string from Redis
 * }
 */
export async function POST(req: NextRequest) {
  // Optional shared-secret auth
  if (WEBHOOK_SECRET) {
    const auth = req.headers.get("authorization") ?? "";
    if (auth !== `Bearer ${WEBHOOK_SECRET}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  const body = await req.json().catch(() => null);
  if (!body?.phone) {
    return NextResponse.json({ error: "phone is required" }, { status: 400 });
  }

  const lead = await prisma.lead.create({
    data: {
      phone: body.phone,
      estimate: body.estimate != null ? Number(body.estimate) : null,
      confidence: body.confidence ?? null,
      itemsFound: body.itemsFound ?? null,
      conversation: body.conversation ?? null,
      address: body.address ?? null,
      notes: body.notes ?? null,
      status: "PENDING",
    },
  });

  return NextResponse.json({ ok: true, leadId: lead.id }, { status: 201 });
}
