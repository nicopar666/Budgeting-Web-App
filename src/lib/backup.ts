import { prisma } from "@/lib/prisma";

const ALGORITHM = "AES-GCM";
const KEY_LENGTH = 256;

interface TransactionData {
  id: string;
  userId: string;
  type: string;
  amount: number;
  description: string | null;
  category: string;
  date: Date;
  createdAt: Date;
  updatedAt: Date;
}

interface BudgetData {
  id: string;
  userId: string;
  category: string;
  month: string;
  amount: number;
  createdAt: Date;
  updatedAt: Date;
}

interface SavingsGoalData {
  id: string;
  userId: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline: Date | null;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface BillReminderData {
  id: string;
  userId: string;
  name: string;
  amount: number;
  dueDay: number;
  category: string;
  isPaid: boolean;
  lastPaid: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

interface DebtData {
  id: string;
  userId: string;
  name: string;
  totalAmount: number;
  currentAmount: number;
  interestRate: number;
  minimumPayment: number;
  dueDate: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

interface AssetData {
  id: string;
  userId: string;
  name: string;
  type: string;
  value: number;
  createdAt: Date;
  updatedAt: Date;
}

async function deriveKey(password: string, salt: Uint8Array): Promise<CryptoKey> {
  const encoder = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    encoder.encode(password),
    "PBKDF2",
    false,
    ["deriveKey"]
  );
  
  return crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: salt as BufferSource,
      iterations: 100000,
      hash: "SHA-256",
    },
    keyMaterial,
    { name: ALGORITHM, length: KEY_LENGTH },
    false,
    ["encrypt", "decrypt"]
  );
}

export async function exportUserData(userId: string, password: string) {
  const transactions = await prisma.transaction.findMany({ where: { userId } });
  const budgets = await prisma.budget.findMany({ where: { userId } });
  const savingsGoals = await prisma.savingsGoal.findMany({ where: { userId } });
  const billReminders = await prisma.billReminder.findMany({ where: { userId } });
  const debts = await prisma.debt.findMany({ where: { userId } });
  const assets = (prisma as any).asset?.findMany ? await (prisma as any).asset.findMany({ where: { userId } }) : [];

  const data = {
    version: 1,
    exportedAt: new Date().toISOString(),
    transactions: transactions as unknown as TransactionData[],
    budgets: budgets as unknown as BudgetData[],
    savingsGoals: savingsGoals as unknown as SavingsGoalData[],
    billReminders: billReminders as unknown as BillReminderData[],
    debts: debts as unknown as DebtData[],
    assets: assets as unknown as AssetData[],
  };

  const encoder = new TextEncoder();
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const key = await deriveKey(password, salt);
  
  const encrypted = await crypto.subtle.encrypt(
    { name: ALGORITHM, iv },
    key,
    encoder.encode(JSON.stringify(data))
  );

  const combined = new Uint8Array(salt.length + iv.length + encrypted.byteLength);
  combined.set(salt, 0);
  combined.set(iv, salt.length);
  combined.set(new Uint8Array(encrypted), salt.length + iv.length);

  return btoa(String.fromCharCode(...combined));
}

export async function importUserData(userId: string, encryptedData: string, password: string) {
  const combined = Uint8Array.from(atob(encryptedData), c => c.charCodeAt(0));
  
  const salt = combined.slice(0, 16);
  const iv = combined.slice(16, 28);
  const encrypted = combined.slice(28);

  const key = await deriveKey(password, salt);
  
  let decrypted: ArrayBuffer;
  try {
    decrypted = await crypto.subtle.decrypt(
      { name: ALGORITHM, iv },
      key,
      encrypted
    );
  } catch {
    throw new Error("Invalid password or corrupted data");
  }

  const decoder = new TextDecoder();
  const data = JSON.parse(decoder.decode(decrypted));

  await prisma.transaction.deleteMany({ where: { userId } });
  await prisma.budget.deleteMany({ where: { userId } });
  await prisma.savingsGoal.deleteMany({ where: { userId } });
  await prisma.billReminder.deleteMany({ where: { userId } });
  await prisma.debt.deleteMany({ where: { userId } });
  if ((prisma as any).asset) {
    await (prisma as any).asset.deleteMany({ where: { userId } });
  }

  if (data.transactions?.length > 0) {
    await prisma.transaction.createMany({ 
      data: data.transactions.map((t: TransactionData) => ({ ...t, userId, id: undefined })) 
    });
  }
  if (data.budgets?.length > 0) {
    await prisma.budget.createMany({ 
      data: data.budgets.map((b: BudgetData) => ({ ...b, userId, id: undefined })) 
    });
  }
  if (data.savingsGoals?.length > 0) {
    await prisma.savingsGoal.createMany({ 
      data: data.savingsGoals.map((s: SavingsGoalData) => ({ ...s, userId, id: undefined })) 
    });
  }
  if (data.billReminders?.length > 0) {
    await prisma.billReminder.createMany({ 
      data: data.billReminders.map((b: BillReminderData) => ({ ...b, userId, id: undefined })) 
    });
  }
  if (data.debts?.length > 0) {
    await prisma.debt.createMany({ 
      data: data.debts.map((d: DebtData) => ({ ...d, userId, id: undefined })) 
    });
  }
  if ((prisma as any).asset && data.assets?.length > 0) {
    await (prisma as any).asset.createMany({ 
      data: data.assets.map((a: AssetData) => ({ ...a, userId, id: undefined })) 
    });
  }

  return { imported: true };
}