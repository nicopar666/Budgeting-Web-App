"use client";

import { formatCurrency, formatDate, cn } from "@/lib/utils";
import { getCategoryIcon } from "@/lib/categories";
import { Button } from "@/components/ui/button";
import { deleteTransaction } from "@/actions/transactionActions";
import { toast } from "sonner";

interface Transaction {
  id: string;
  type: string;
  amount: number;
  description?: string | null;
  category: string;
  date: string | Date;
}

export function TransactionTable({ transactions }: { transactions: Transaction[] }) {
  async function onDelete(id: string) {
    if (!confirm("Delete this transaction?")) return;
    try {
      await deleteTransaction(id);
      toast.success("Transaction deleted");
    } catch (error) {
      toast.error("Could not delete transaction");
    }
  }

  return (
    <div className="overflow-x-auto rounded-md border border-slate-200 dark:border-slate-800">
      <table className="w-full min-w-[720px] border-collapse">
        <thead className="bg-slate-100 dark:bg-slate-800/50">
          <tr>
            <th className="py-3 px-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Date</th>
            <th className="py-3 px-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Type</th>
            <th className="py-3 px-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Category</th>
            <th className="py-3 px-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Amount</th>
            <th className="py-3 px-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Description</th>
            <th className="py-3 px-4 text-right text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Actions</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((tx) => (
            <tr
              key={tx.id}
              className="border-t border-slate-200 bg-white text-sm transition-colors hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900/50 dark:hover:bg-slate-800/30"
            >
              <td className="py-3 px-4">{formatDate(tx.date)}</td>
              <td className="py-3 px-4">
                <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                  tx.type === "income" 
                    ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" 
                    : "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400"
                }`}>
                  {tx.type}
                </span>
              </td>
              <td className="py-3 px-4">
                {(() => {
                  const { Icon, colorClass } = getCategoryIcon(tx.category);
                  return (
                    <span className="inline-flex items-center gap-1.5 rounded-md bg-slate-100 px-2 py-1 text-xs font-medium dark:bg-slate-800 dark:text-slate-300">
                      <Icon className={cn("h-3.5 w-3.5", colorClass)} />
                      {tx.category}
                    </span>
                  );
                })()}
              </td>
              <td className={`py-3 px-4 font-medium ${tx.type === "income" ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"}`}>
                {tx.type === "income" ? "+" : "-"}{formatCurrency(tx.amount)}
              </td>
              <td className="py-3 px-4 text-slate-500 dark:text-slate-400">{tx.description || "—"}</td>
              <td className="py-3 px-4 text-right">
                <Button variant="destructive" size="sm" onClick={() => onDelete(tx.id)}>
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
