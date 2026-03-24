"use client";

import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from "recharts";
import { Card } from "@/components/ui/card";

export function IncomeExpenseBar({
  data,
}: {
  data: Array<{ month: string; income: number; expense: number }>;
}) {
  return (
    <Card className="h-96">
      <div className="h-full w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" className="opacity-50" />
            <XAxis 
              dataKey="month" 
              tick={{ fontSize: 12 }}
              stroke="#94a3b8"
            />
            <YAxis 
              tick={{ fontSize: 12 }}
              stroke="#94a3b8"
            />
            <Tooltip 
              formatter={(value: number) => `$${value.toFixed(2)}`}
              contentStyle={{ 
                borderRadius: "8px", 
                border: "1px solid #e2e8f0",
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)"
              }}
            />
            <Legend />
            <Bar 
              dataKey="income" 
              fill="#22c55e" 
              radius={[4, 4, 0, 0]}
              animationBegin={0}
              animationDuration={800}
              animationEasing="ease-out"
            />
            <Bar 
              dataKey="expense" 
              fill="#ef4444" 
              radius={[4, 4, 0, 0]}
              animationBegin={200}
              animationDuration={800}
              animationEasing="ease-out"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
