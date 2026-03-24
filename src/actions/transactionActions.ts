"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

const transactionSchema = z.object({
  id: z.string().optional(),
  type: z.enum(["income", "expense"]),
  amount: z.coerce.number().positive().max(999999999),
  description: z.string().max(250).trim().optional(),
  category: z.string().min(1).max(50).trim(),
  date: z.string().optional(),
}).strict();

export type TransactionFormValues = z.infer<typeof transactionSchema>;

export async function createTransaction(formData: FormData) {
  const user = await requireAuth();
  
  // Sanitize inputs before validation
  const rawData: Record<string, FormDataEntryValue> = {};
  for (const [key, value] of formData.entries()) {
    if (typeof value === "string") {
      rawData[key] = value.trim();
    } else {
      rawData[key] = value;
    }
  }
  
  const values = transactionSchema.parse(rawData);

  const transactionDate = values.date ? new Date(values.date) : new Date();

  const tx = await prisma.transaction.create({
    data: {
      userId: user.id,
      type: values.type,
      amount: values.amount,
      description: values.description,
      category: values.category,
      date: transactionDate,
    },
  });

  let budgetExceeded = false;

  if (values.type === "expense") {
    const month = `${transactionDate.getFullYear()}-${String(transactionDate.getMonth() + 1).padStart(2, "0")}`;

    const [totalExpense, budget] = await Promise.all([
      prisma.transaction.aggregate({
        where: {
          userId: user.id,
          type: "expense",
          category: values.category,
          date: {
            gte: new Date(`${month}-01`),
            lt: new Date(new Date(`${month}-01`).setMonth(new Date(`${month}-01`).getMonth() + 1)),
          },
        },
        _sum: { amount: true },
      }),
      prisma.budget.findFirst({
        where: {
          userId: user.id,
          category: values.category,
          month,
        },
      }),
    ]);

    const spent = totalExpense._sum.amount ?? 0;
    if (budget && spent > budget.amount) {
      budgetExceeded = true;
    }
  }

  revalidatePath("/dashboard");
  return { tx, budgetExceeded };
}

export async function updateTransaction(formData: FormData) {
  const user = await requireAuth();
  const values = transactionSchema.parse(Object.fromEntries(formData.entries()));

  if (!values.id) throw new Error("Missing transaction id");

  const tx = await prisma.transaction.updateMany({
    where: { id: values.id, userId: user.id },
    data: {
      type: values.type,
      amount: values.amount,
      description: values.description,
      category: values.category,
      date: values.date ? new Date(values.date) : undefined,
    },
  });

  revalidatePath("/dashboard");
  return tx;
}

export async function deleteTransaction(id: string) {
  const user = await requireAuth();

  await prisma.transaction.deleteMany({
    where: { id, userId: user.id },
  });

  revalidatePath("/dashboard");
}
