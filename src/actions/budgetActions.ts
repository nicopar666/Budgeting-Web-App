"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

const budgetSchema = z.object({
  id: z.string().optional(),
  category: z.string().min(1, "Category is required").max(50).trim(),
  month: z.string().min(1, "Month is required").regex(/^\d{4}-(0[1-9]|1[0-2])$/),
  amount: z.coerce.number().positive("Amount must be positive").min(0.01).max(999999999),
}).strict();

export type BudgetFormValues = z.infer<typeof budgetSchema>;

export async function upsertBudget(formData: FormData) {
  const user = await requireAuth();
  
  // Sanitize inputs
  const rawData: Record<string, FormDataEntryValue> = {};
  for (const [key, value] of formData.entries()) {
    if (typeof value === "string") {
      rawData[key] = value.trim();
    } else {
      rawData[key] = value;
    }
  }
  
  const values = budgetSchema.parse(rawData);

  const existing = await prisma.budget.findFirst({
    where: {
      userId: user.id,
      category: values.category,
      month: values.month,
    },
  });

  if (existing) {
    await prisma.budget.update({
      where: { id: existing.id },
      data: { amount: values.amount },
    });
  } else {
    await prisma.budget.create({
      data: {
        ...values,
        userId: user.id,
      },
    });
  }

  revalidatePath("/dashboard");
}

export async function deleteBudget(id: string) {
  const user = await requireAuth();
  await prisma.budget.deleteMany({ where: { id, userId: user.id } });
  revalidatePath("/dashboard");
}
