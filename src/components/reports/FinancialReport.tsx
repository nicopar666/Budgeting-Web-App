"use client";

import { useState } from "react";
import { FileText, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatCurrency } from "@/lib/utils";

interface ReportData {
  transactions: Array<{
    date: Date;
    type: string;
    category: string;
    amount: number;
    description: string | null;
  }>;
  income: number;
  expenses: number;
  balance: number;
  savingsRate: number;
  topCategories: Array<{ category: string; amount: number }>;
}

interface FinancialReportProps {
  data: ReportData;
}

export function FinancialReport({ data }: FinancialReportProps) {
  const [period, setPeriod] = useState("this-month");
  const [isGenerating, setIsGenerating] = useState(false);

  function generateReport() {
    setIsGenerating(true);
    
    const reportContent = generatePDFContent(data);
    downloadFile(reportContent, `financial-report-${new Date().toISOString().split('T')[0]}.txt`);
    
    setIsGenerating(false);
  }

  function generatePDFContent(data: ReportData): string {
    const date = new Date().toLocaleDateString('en-PH', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
    
    let content = `
═══════════════════════════════════════════════════════════════
                    BUDGETPRO FINANCIAL REPORT
═══════════════════════════════════════════════════════════════
Generated: ${date}
────────────────────────────────────────────────────────────────

                    SUMMARY
────────────────────────────────────────────────────────────────

  Total Income:        ${formatCurrency(data.income)}
  Total Expenses:      ${formatCurrency(data.expenses)}
  Net Balance:         ${formatCurrency(data.balance)}
  Savings Rate:        ${data.savingsRate.toFixed(1)}%

────────────────────────────────────────────────────────────────

                    EXPENSE BREAKDOWN
------------------------------------------------------------`;

    if (data.topCategories.length === 0) {
      content += "\n  No expenses recorded.";
    } else {
      data.topCategories.forEach(cat => {
        content += `\n  ${cat.category.padEnd(15)} ${formatCurrency(cat.amount).padStart(12)}`;
      });
    }

    content += `

────────────────────────────────────────────────────────────────

                    TRANSACTION DETAILS
------------------------------------------------------------`;

    if (data.transactions.length === 0) {
      content += "\n  No transactions recorded.";
    } else {
      data.transactions.forEach(tx => {
        const dateStr = new Date(tx.date).toLocaleDateString('en-PH');
        const type = tx.type === 'income' ? '+' : '-';
        content += `\n  ${dateStr}  ${type} ${formatCurrency(tx.amount).padStart(10)}  ${tx.category}`;
        if (tx.description) {
          content += `\n               ${tx.description}`;
        }
      });
    }

    content += `

────────────────────────────────────────────────────────────────
                    END OF REPORT
═══════════════════════════════════════════════════════════════
`;

    return content;
  }

  function downloadFile(content: string, filename: string) {
    const blob = new Blob([content], { type: "text/plain;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  return (
    <Card className="glass animate-fade-in">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Financial Report
        </CardTitle>
        <CardDescription>Export your financial summary</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 rounded-lg bg-card border border-border">
              <p className="text-sm text-muted-foreground">Income</p>
              <p className="text-lg font-semibold text-emerald-500">{formatCurrency(data.income)}</p>
            </div>
            <div className="p-3 rounded-lg bg-card border border-border">
              <p className="text-sm text-muted-foreground">Expenses</p>
              <p className="text-lg font-semibold text-rose-500">{formatCurrency(data.expenses)}</p>
            </div>
          </div>
          
          <div className="p-3 rounded-lg bg-card border border-border">
            <p className="text-sm text-muted-foreground">Net Balance</p>
            <p className={`text-xl font-bold ${data.balance >= 0 ? 'text-primary' : 'text-rose-500'}`}>
              {formatCurrency(data.balance)}
            </p>
          </div>

          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger>
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="this-month">This Month</SelectItem>
              <SelectItem value="last-month">Last Month</SelectItem>
              <SelectItem value="this-year">This Year</SelectItem>
            </SelectContent>
          </Select>

          <Button onClick={generateReport} disabled={isGenerating} className="w-full">
            <Download className="h-4 w-4 mr-2" />
            {isGenerating ? "Generating..." : "Download Report"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}