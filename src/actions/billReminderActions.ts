"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

const billReminderSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1).max(100).trim(),
  amount: z.coerce.number().positive().max(999999),
  dueDay: z.coerce.number().min(1).max(31),
  category: z.string().min(1).max(50).trim(),
}).strict();

export type BillReminderFormValues = z.infer<typeof billReminderSchema>;

export async function createBillReminder(formData: FormData) {
  const user = await requireAuth();
  
  const rawData: Record<string, FormDataEntryValue> = {};
  for (const [key, value] of formData.entries()) {
    if (typeof value === "string") {
      rawData[key] = value.trim();
    } else {
      rawData[key] = value;
    }
  }
  
  const values = billReminderSchema.parse(rawData);
  
  const reminder = await prisma.billReminder.create({
    data: {
      userId: user.id,
      name: values.name,
      amount: values.amount,
      dueDay: values.dueDay,
      category: values.category,
    },
  });
  
  revalidatePath("/dashboard");
  return reminder;
}

export async function updateBillReminder(formData: FormData) {
  const user = await requireAuth();
  const values = billReminderSchema.parse(Object.fromEntries(formData.entries()));
  
  if (!values.id) throw new Error("Missing reminder id");
  
  const reminder = await prisma.billReminder.updateMany({
    where: { id: values.id, userId: user.id },
    data: {
      name: values.name,
      amount: values.amount,
      dueDay: values.dueDay,
      category: values.category,
    },
  });
  
  revalidatePath("/dashboard");
  return reminder;
}

export async function markBillPaid(id: string) {
  const user = await requireAuth();
  
  const reminder = await prisma.billReminder.findFirst({
    where: { id, userId: user.id },
  });
  
  if (!reminder) {
    throw new Error("Bill reminder not found");
  }
  
  await prisma.billReminder.updateMany({
    where: { id, userId: user.id },
    data: {
      isPaid: true,
      lastPaid: new Date(),
    },
  });
  
  await prisma.transaction.create({
    data: {
      userId: user.id,
      type: "expense",
      amount: reminder.amount,
      description: `Bill paid: ${reminder.name}`,
      category: reminder.category,
      date: new Date(),
    },
  });
  
  revalidatePath("/dashboard");
  return { success: true, message: "Bill marked as paid and added to transactions" };
}

export async function markBillUnpaid(id: string) {
  const user = await requireAuth();
  
  const reminder = await prisma.billReminder.updateMany({
    where: { id, userId: user.id },
    data: {
      isPaid: false,
    },
  });
  
  revalidatePath("/dashboard");
  return reminder;
}

export async function deleteBillReminder(id: string) {
  const user = await requireAuth();
  
  await prisma.billReminder.deleteMany({
    where: { id, userId: user.id },
  });
  
  revalidatePath("/dashboard");
}