"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createAsset(userId: string, data: {
  name: string;
  type: string;
  value: number;
}) {
  const prismaAny = prisma as any;
  if (!prismaAny.asset) return;
  await prismaAny.asset.create({
    data: { ...data, userId },
  });
  revalidatePath("/dashboard");
}

export async function updateAsset(id: string, data: {
  name?: string;
  type?: string;
  value?: number;
}) {
  const prismaAny = prisma as any;
  if (!prismaAny.asset) return;
  await prismaAny.asset.update({
    where: { id },
    data,
  });
  revalidatePath("/dashboard");
}

export async function deleteAsset(id: string) {
  const prismaAny = prisma as any;
  if (!prismaAny.asset) return;
  await prismaAny.asset.delete({ where: { id } });
  revalidatePath("/dashboard");
}