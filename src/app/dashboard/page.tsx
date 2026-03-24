import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getAuthSession } from "@/lib/auth";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

import { formatCurrency, monthKey } from "@/lib/utils";
import { ExpensePieChart } from "@/components/charts/ExpensePieChart";
import { IncomeExpenseBar } from "@/components/charts/IncomeExpenseBar";
import { SavingsTrendChart } from "@/components/charts/SavingsTrendChart";
import { BudgetProgressList } from "@/components/budget/BudgetProgressList";
import { TransactionSection } from "@/components/transaction/TransactionSection";
import { BudgetFormDialog } from "@/components/budget/BudgetFormDialog";
import { SavingsGoalCard } from "@/components/savings/SavingsGoalCard";
import { SavingsGoalFormDialog } from "@/components/savings/SavingsGoalFormDialog";
import { SignOutButton } from "@/components/auth/SignOutButton";
import { AIChat } from "@/components/ai/AIChat";
import { TrendingUp, TrendingDown, PiggyBank, Target } from "lucide-react";

export default async function DashboardPage() {
  let session;
  try {
    session = await getAuthSession();
  } catch (error) {
    console.error("Auth session error:", error);
    redirect("/auth/login");
    return null;
  }
  if (!session?.user) redirect("/auth/login");


  const userId = session.user.id;
  const now = new Date();
  const thisMonth = monthKey(now);
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  const [transactions, budgets, savingsGoals] = await Promise.all([
    prisma.transaction.findMany({
      where: { userId },
      orderBy: { date: "desc" },
      take: 10,
    }),
    prisma.budget.findMany({
      where: { userId },
      orderBy: { category: "asc" },
    }),
    prisma.savingsGoal.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  const monthlyTransactions = await prisma.transaction.findMany({
    where: { userId, date: { gte: monthStart } },
  });

  const incomeThisMonth = monthlyTransactions
    .filter((t) => t.type === "income")
    .reduce((acc, t) => acc + t.amount, 0);

  const expenseThisMonth = monthlyTransactions
    .filter((t) => t.type === "expense")
    .reduce((acc, t) => acc + t.amount, 0);

  const balance = incomeThisMonth - expenseThisMonth;

  const totalsByCategory = monthlyTransactions
    .filter((t) => t.type === "expense")
    .reduce<Record<string, number>>((acc, t) => {
      if (!acc[t.category]) acc[t.category] = 0;
      acc[t.category] += t.amount;
      return acc;
    }, {});

  const chartData = Object.entries(totalsByCategory).map(([category, value]) => ({
    category,
    value,
  }));

  const months = Array.from({ length: 6 }).map((_, idx) => {
    const d = new Date(now.getFullYear(), now.getMonth() - idx, 1);
    return monthKey(d);
  }).reverse();

  const monthTransactions = await prisma.transaction.groupBy({
    by: ["date", "type"],
    where: {
      userId,
      date: {
        gte: new Date(new Date().setMonth(now.getMonth() - 5, 1)),
      },
    },
    _sum: { amount: true },
  });

  const incomeByMonth = new Map<string, number>();
  const expenseByMonth = new Map<string, number>();

  monthTransactions.forEach((group) => {
    const month = monthKey(group.date);
    const sum = group._sum.amount ?? 0;
    if (group.type === "income") incomeByMonth.set(month, sum);
    if (group.type === "expense") expenseByMonth.set(month, sum);
  });

  const trendChartData = months.map((month) => ({
    month,
    income: incomeByMonth.get(month) ?? 0,
    expense: expenseByMonth.get(month) ?? 0,
  }));

  const savingsTrendData = months.map((month) => ({
    month,
    income: incomeByMonth.get(month) ?? 0,
    expense: expenseByMonth.get(month) ?? 0,
    savings: (incomeByMonth.get(month) ?? 0) - (expenseByMonth.get(month) ?? 0),
  }));

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <header className="border-b border-slate-200 bg-white/70 py-4 backdrop-blur-sm dark:border-slate-800 dark:bg-slate-900/60">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-50">Dashboard</h1>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Track your budget, transactions & analytics.
            </p>
          </div>
          <div className="flex gap-2">
            <SignOutButton />
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-8">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="border-l-4 border-l-emerald-500">
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <CardDescription>Total Income</CardDescription>
              <TrendingUp className="h-4 w-4 text-emerald-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-emerald-600">{formatCurrency(incomeThisMonth)}</div>
              <p className="text-xs text-slate-500">This month</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-rose-500">
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <CardDescription>Total Expenses</CardDescription>
              <TrendingDown className="h-4 w-4 text-rose-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-rose-600">{formatCurrency(expenseThisMonth)}</div>
              <p className="text-xs text-slate-500">This month</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-indigo-500">
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <CardDescription>Net Balance</CardDescription>
              <PiggyBank className="h-4 w-4 text-indigo-500" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${balance >= 0 ? "text-emerald-600" : "text-rose-600"}`}>
                {formatCurrency(balance)}
              </div>
              <p className="text-xs text-slate-500">This month</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-amber-500">
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <CardDescription>Savings Rate</CardDescription>
              <Target className="h-4 w-4 text-amber-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-amber-600">
                {incomeThisMonth > 0 ? ((balance / incomeThisMonth) * 100).toFixed(1) : 0}%
              </div>
              <p className="text-xs text-slate-500">Of income saved</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-3 mt-6">
          <Card className="lg:col-span-2">
            <CardHeader className="pb-2">
              <CardTitle>Charts</CardTitle>
              <CardDescription>Expense breakdown and trends</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6 lg:grid-cols-2">
              <ExpensePieChart data={chartData} />
              <IncomeExpenseBar data={trendChartData} />
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Savings Trend</CardTitle>
              <CardDescription>Monthly savings over time</CardDescription>
            </CardHeader>
            <CardContent>
              <SavingsTrendChart data={savingsTrendData} />
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <div>
                <CardTitle>Budget Usage</CardTitle>
                <CardDescription>Monthly budget progress</CardDescription>
              </div>
              <BudgetFormDialog />
            </CardHeader>
            <CardContent>
              <BudgetProgressList budgets={budgets} expenses={totalsByCategory} month={thisMonth} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <div>
                <CardTitle>Savings Goals</CardTitle>
                <CardDescription>Track your savings progress</CardDescription>
              </div>
              <SavingsGoalFormDialog />
            </CardHeader>
            <CardContent>
              {savingsGoals.length === 0 ? (
                <p className="text-sm text-slate-500">No savings goals yet. Create one to start tracking!</p>
              ) : (
                <div className="space-y-3">
                  {savingsGoals.map((goal) => (
                    <SavingsGoalCard key={goal.id} goal={goal} />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="lg:col-span-2">
            <TransactionSection transactions={transactions} />
          </Card>
        </div>
      </main>
      <AIChat />
    </div>
  );
}
