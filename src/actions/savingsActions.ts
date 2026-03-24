"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

const savingsGoalSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Name is required"),
  targetAmount: z.coerce.number().positive("Target amount must be positive").min(0.01),
  currentAmount: z.coerce.number().min(0).default(0),
  deadline: z.string().optional(),
});

export type SavingsGoalFormValues = z.infer<typeof savingsGoalSchema>;

export async function createSavingsGoal(formData: FormData) {
  const user = await requireAuth();
  const values = savingsGoalSchema.parse(Object.fromEntries(formData.entries()));

  await prisma.savingsGoal.create({
    data: {
      name: values.name,
      targetAmount: values.targetAmount,
      currentAmount: values.currentAmount || 0,
      deadline: values.deadline ? new Date(values.deadline) : null,
      userId: user.id,
    },
  });

  revalidatePath("/dashboard");
}

export async function updateSavingsGoal(formData: FormData) {
  const user = await requireAuth();
  const values = savingsGoalSchema.parse(Object.fromEntries(formData.entries()));

  if (!values.id) throw new Error("Missing savings goal id");

  await prisma.savingsGoal.updateMany({
    where: { id: values.id, userId: user.id },
    data: {
      name: values.name,
      targetAmount: values.targetAmount,
      currentAmount: values.currentAmount,
      deadline: values.deadline ? new Date(values.deadline) : null,
    },
  });

  revalidatePath("/dashboard");
}

export async function addToSavingsGoal(id: string, amount: number) {
  const user = await requireAuth();

  const goal = await prisma.savingsGoal.findFirst({
    where: { id, userId: user.id },
  });

  if (!goal) throw new Error("Savings goal not found");

  const newAmount = goal.currentAmount + amount;
  const completed = newAmount >= goal.targetAmount;

  await prisma.savingsGoal.update({
    where: { id },
    data: {
      currentAmount: newAmount,
      completed,
    },
  });

  revalidatePath("/dashboard");
}

export async function deleteSavingsGoal(id: string) {
  const user = await requireAuth();

  await prisma.savingsGoal.deleteMany({
    where: { id, userId: user.id },
  });

  revalidatePath("/dashboard");
}
