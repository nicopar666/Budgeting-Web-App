"use client";

import { formatCurrency, formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { deleteTransaction } from "@/actions/transactionActions";
import { toast } from "sonner";

interface Transaction {
  id: string;
  type: "income" | "expense";
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
    <div className="overflow-x-auto">
      <table className="w-full min-w-[720px] border-collapse">
        <thead className="text-left text-sm text-slate-500">
          <tr>
            <th className="py-2">Date</th>
            <th className="py-2">Type</th>
            <th className="py-2">Category</th>
            <th className="py-2">Amount</th>
            <th className="py-2">Description</th>
            <th className="py-2 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((tx) => (
            <tr
              key={tx.id}
              className="border-t border-slate-200 dark:border-slate-800"
            >
              <td className="py-3 text-sm">{formatDate(tx.date)}</td>
              <td className="py-3 text-sm capitalize">{tx.type}</td>
              <td className="py-3 text-sm">{tx.category}</td>
              <td className="py-3 text-sm font-medium">{formatCurrency(tx.amount)}</td>
              <td className="py-3 text-sm text-slate-500 dark:text-slate-400">{tx.description}</td>
              <td className="py-3 text-right">
                <Button variant="secondary" onClick={() => onDelete(tx.id)}>
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
