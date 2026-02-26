"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

const N8N_BASE = process.env.N8N_BASE_URL ?? "http://testdomain.com";

async function requireAuth() {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");
  return session;
}

export async function confirmLeadAction(leadId: string, estimate: number) {
  await requireAuth();

  const updated = await prisma.lead.update({
    where: { id: leadId },
    data: { status: "CONFIRMED", estimate },
  });

  // Trigger n8n confirm-quote webhook
  try {
    await fetch(`${N8N_BASE}/webhook/confirm-quote`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone: updated.phone, estimate, leadId }),
    });
  } catch (e) {
    console.error("n8n webhook error", e);
  }

  revalidatePath("/dashboard/leads");
}

export async function updateLeadStatusAction(
  leadId: string,
  status: "FLAGGED" | "REJECTED" | "BOOKED" | "PENDING"
) {
  await requireAuth();
  await prisma.lead.update({ where: { id: leadId }, data: { status } });
  revalidatePath("/dashboard/leads");
}

export async function updateLeadEstimateAction(leadId: string, estimate: number) {
  await requireAuth();
  await prisma.lead.update({ where: { id: leadId }, data: { estimate } });
  revalidatePath("/dashboard/leads");
}

export async function sendManualMessageAction(leadId: string, message: string) {
  await requireAuth();

  const lead = await prisma.lead.findUnique({ where: { id: leadId } });
  if (!lead) throw new Error("Lead not found");

  const res = await fetch(`${N8N_BASE}/webhook/send-manual-message`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ phone: lead.phone, message, leadId }),
  });

  if (!res.ok) throw new Error("n8n webhook failed: " + (await res.text()));
}
