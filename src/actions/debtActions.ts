"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

const debtSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1).max(100).trim(),
  totalAmount: z.coerce.number().positive().max(999999),
  currentAmount: z.coerce.number().positive().max(999999),
  interestRate: z.coerce.number().min(0).max(100),
  minimumPayment: z.coerce.number().positive().max(99999),
  dueDate: z.string().optional(),
}).strict();

export type DebtFormValues = z.infer<typeof debtSchema>;

export async function createDebt(formData: FormData) {
  const user = await requireAuth();
  
  const rawData: Record<string, FormDataEntryValue> = {};
  for (const [key, value] of formData.entries()) {
    if (typeof value === "string") {
      rawData[key] = value.trim();
    } else {
      rawData[key] = value;
    }
  }
  
  const values = debtSchema.parse(rawData);
  
  const debt = await prisma.debt.create({
    data: {
      userId: user.id,
      name: values.name,
      totalAmount: values.totalAmount,
      currentAmount: values.currentAmount,
      interestRate: values.interestRate,
      minimumPayment: values.minimumPayment,
      dueDate: values.dueDate ? new Date(values.dueDate) : null,
    },
  });
  
  revalidatePath("/dashboard");
  return debt;
}

export async function updateDebt(formData: FormData) {
  const user = await requireAuth();
  const values = debtSchema.parse(Object.fromEntries(formData.entries()));
  
  if (!values.id) throw new Error("Missing debt id");
  
  const debt = await prisma.debt.updateMany({
    where: { id: values.id, userId: user.id },
    data: {
      name: values.name,
      totalAmount: values.totalAmount,
      currentAmount: values.currentAmount,
      interestRate: values.interestRate,
      minimumPayment: values.minimumPayment,
      dueDate: values.dueDate ? new Date(values.dueDate) : null,
    },
  });
  
  revalidatePath("/dashboard");
  return debt;
}

export async function makeDebtPayment(id: string, amount: number) {
  const user = await requireAuth();
  
  const debt = await prisma.debt.findFirst({
    where: { id, userId: user.id },
  });
  
  if (!debt) throw new Error("Debt not found");
  
  const newAmount = Math.max(0, debt.currentAmount - amount);
  const completed = newAmount === 0;
  
  await prisma.debt.update({
    where: { id, userId: user.id },
    data: {
      currentAmount: newAmount,
      updatedAt: new Date(),
    },
  });
  
  revalidatePath("/dashboard");
  return { success: true, completed };
}

export async function deleteDebt(id: string) {
  const user = await requireAuth();
  
  await prisma.debt.deleteMany({
    where: { id, userId: user.id },
  });
  
  revalidatePath("/dashboard");
}