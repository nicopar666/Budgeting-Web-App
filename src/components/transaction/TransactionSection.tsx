"use client";

import { useState } from "react";
import { TransactionTable } from "./TransactionTable";
import { TransactionFilters } from "./TransactionFilters";
import { ExportTransactionsButton } from "./ExportTransactionsButton";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { TransactionFormDialog } from "./TransactionFormDialog";

interface Transaction {
  id: string;
  type: "income" | "expense";
  amount: number;
  description?: string | null;
  category: string;
  date: string | Date;
}

interface TransactionSectionProps {
  transactions: Transaction[];
}

export function TransactionSection({ transactions: initialTransactions }: TransactionSectionProps) {
  const [filteredTransactions, setFilteredTransactions] = useState(initialTransactions);

  function handleSearchChange(search: string) {
    if (!search) {
      setFilteredTransactions(initialTransactions);
      return;
    }
    const lower = search.toLowerCase();
    setFilteredTransactions(
      initialTransactions.filter(
        (tx) =>
          tx.category.toLowerCase().includes(lower) ||
          tx.description?.toLowerCase().includes(lower) ||
          tx.type.toLowerCase().includes(lower)
      )
    );
  }

  function handleDateRangeChange(start: string, end: string) {
    if (!start && !end) {
      setFilteredTransactions(initialTransactions);
      return;
    }
    setFilteredTransactions(
      initialTransactions.filter((tx) => {
        const txDate = new Date(tx.date);
        if (start && new Date(start) > txDate) return false;
        if (end && new Date(end) < txDate) return false;
        return true;
      })
    );
  }

  return (
    <Card className="lg:col-span-2">
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <div>
          <CardTitle>Recent Transactions</CardTitle>
          <CardDescription>Latest activity</CardDescription>
        </div>
        <div className="flex gap-2">
          <ExportTransactionsButton transactions={filteredTransactions} />
          <TransactionFormDialog />
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <TransactionFilters
            onSearchChange={handleSearchChange}
            onDateRangeChange={handleDateRangeChange}
          />
        </div>
        <TransactionTable transactions={filteredTransactions} />
      </CardContent>
    </Card>
  );
}
