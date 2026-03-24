"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

const budgetSchema = z.object({
  id: z.string().optional(),
  category: z.string().min(1, "Category is required"),
  month: z.string().min(1, "Month is required"),
  amount: z.coerce.number().positive("Amount must be positive").min(0.01),
});

export type BudgetFormValues = z.infer<typeof budgetSchema>;

export async function upsertBudget(formData: FormData) {
  const user = await requireAuth();
  const values = budgetSchema.parse(Object.fromEntries(formData.entries()));

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
