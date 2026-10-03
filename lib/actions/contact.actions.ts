"use server";

import { z } from "zod";
import prisma from "@/lib/prisma";

const contactSchema = z.object({
  name: z.string().min(2, "Pura naam likhein").max(100),
  email: z.string().email("Email sahi format mein likhein"),
  phone: z.string().optional(),
  message: z.string().min(10, "Kam az kam 10 characters ka message likhein").max(2000),
});

export type ContactFormState = { success: true } | { success: false; error: string };

export async function submitContactMessage(data: {
  name: string;
  email: string;
  phone: string;
  message: string;
}): Promise<ContactFormState> {
  const parsed = contactSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  try {
    await prisma.contactMessage.create({
      data: {
        name: parsed.data.name,
        email: parsed.data.email,
        phone: parsed.data.phone || null,
        message: parsed.data.message,
      },
    });
    return { success: true };
  } catch {
    return { success: false, error: "Kuch masla ho gaya, dobara koshish karein." };
  }
}
