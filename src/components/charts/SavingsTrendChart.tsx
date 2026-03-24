"use client";

import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { Card } from "@/components/ui/card";

interface DataPoint {
  month: string;
  income: number;
  expense: number;
  savings: number;
}

interface SavingsTrendChartProps {
  data: DataPoint[];
}

export function SavingsTrendChart({ data }: SavingsTrendChartProps) {
  return (
    <Card className="h-80">
      <div className="h-full w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorSavings" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
            </defs>
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
              formatter={(value: number) => `₱${value.toFixed(2)}`}
              contentStyle={{ 
                borderRadius: "8px", 
                border: "1px solid #e2e8f0",
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)"
              }}
            />
            <Area 
              type="monotone" 
              dataKey="savings" 
              stroke="#10b981" 
              fillOpacity={1} 
              fill="url(#colorSavings)"
              animationBegin={0}
              animationDuration={1000}
              animationEasing="ease-out"
              name="Savings"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
