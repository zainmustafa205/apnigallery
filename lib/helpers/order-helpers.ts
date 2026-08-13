import prisma from "@/lib/prisma";
import crypto from "crypto";

// ==========================================================
// ADVANCE PERCENTAGE (from Setting table, with safe fallback)
// ==========================================================

const DEFAULT_ADVANCE_PERCENTAGE = 15;
const ADVANCE_PERCENTAGE_KEY = "advancePercentage";

export async function getAdvancePercentage(): Promise<number> {
  const setting = await prisma.setting.findUnique({
    where: { key: ADVANCE_PERCENTAGE_KEY },
  });

  if (!setting) return DEFAULT_ADVANCE_PERCENTAGE;

  const parsed = parseFloat(setting.value);
  const isValid = Number.isFinite(parsed) && parsed > 0 && parsed <= 100;

  return isValid ? parsed : DEFAULT_ADVANCE_PERCENTAGE;
}

// ==========================================================
// ORDER NUMBER (Postgres sequence — race-condition safe)
// ==========================================================

export async function generateOrderNumber(): Promise<string> {
  const result = await prisma.$queryRaw<{ nextval: bigint }[]>`
    SELECT nextval('order_number_seq')
  `;

  const seqNumber = result[0].nextval;
  const year = new Date().getFullYear();
  const padded = seqNumber.toString().padStart(5, "0");

  return `ORD-${year}-${padded}`;
}

// ==========================================================
// TRACKING CODE (random, non-sequential — for guest lookups)
// ==========================================================

// Confusing characters excluded: 0/O, 1/I
const TRACKING_CODE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
const TRACKING_CODE_LENGTH = 10;
const MAX_GENERATION_ATTEMPTS = 5;

function randomTrackingSuffix(): string {
  const bytes = crypto.randomBytes(TRACKING_CODE_LENGTH);
  let result = "";

  for (let i = 0; i < TRACKING_CODE_LENGTH; i++) {
    result += TRACKING_CODE_ALPHABET[bytes[i] % TRACKING_CODE_ALPHABET.length];
  }

  return result;
}

export async function generateTrackingCode(): Promise<string> {
  for (let attempt = 0; attempt < MAX_GENERATION_ATTEMPTS; attempt++) {
    const code = `TRK-${randomTrackingSuffix()}`;

    const existing = await prisma.order.findUnique({
      where: { trackingCode: code },
      select: { id: true },
    });

    if (!existing) return code;
  }

  throw new Error("Failed to generate a unique tracking code after multiple attempts");
}
