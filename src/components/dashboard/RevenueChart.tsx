"use client";

import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { useStore } from '@/lib/store';

// Helper to format values as ₹120k, etc.
const formatYAxis = (value: number) => `₹${(value / 1000).toFixed(0)}k`;

export function RevenueChart() {
  const invoices = useStore(state => state.invoices) as any[];
  const expensesList = useStore(state => state.expenses) as any[];

  // 1. Annual Revenue Baselines (₹)
  const revenueBaselines: { [key: string]: number } = {
    'Jan': 120000,
    'Feb': 150000,
    'Mar': 180000,
    'Apr': 250000,
    'May': 300000,
    'Jun': 400000,
    'Jul': 420000,
    'Aug': 450000,
    'Sep': 480000,
    'Oct': 520000,
    'Nov': 580000,
    'Dec': 650000,
  };

  // 2. Annual Expenses Baselines (₹)
  const expenseBaselines: { [key: string]: number } = {
    'Jan': 50000,
    'Feb': 45000,
    'Mar': 55000,
    'Apr': 60000,
    'May': 70000,
    'Jun': 80000,
    'Jul': 85000,
    'Aug': 90000,
    'Sep': 95000,
    'Oct': 100000,
    'Nov': 110000,
    'Dec': 120000,
  };

  // 3. Aggregate Live Invoices (Paid Only)
  const liveRevenue: { [key: string]: number } = {
    'Jan': 0, 'Feb': 0, 'Mar': 0, 'Apr': 0, 'May': 0, 'Jun': 0,
    'Jul': 0, 'Aug': 0, 'Sep': 0, 'Oct': 0, 'Nov': 0, 'Dec': 0
  };

  invoices.filter((inv: any) => inv.status === 'paid').forEach((inv: any) => {
    if (!inv.date) return;
    const dateObj = new Date(inv.date);
    if (isNaN(dateObj.getTime())) return;
    const monthName = dateObj.toLocaleString('en-US', { month: 'short' }); // e.g. "Jan"
    if (monthName in liveRevenue) {
      liveRevenue[monthName] += inv.amount || 0;
    }
  });

  // 4. Aggregate Live Expenses
  const liveExpenses: { [key: string]: number } = {
    'Jan': 0, 'Feb': 0, 'Mar': 0, 'Apr': 0, 'May': 0, 'Jun': 0,
    'Jul': 0, 'Aug': 0, 'Sep': 0, 'Oct': 0, 'Nov': 0, 'Dec': 0
  };

  expensesList.forEach((exp: any) => {
    const dateStr = exp.date || exp.createdAt;
    if (!dateStr) return;
    const dateObj = new Date(dateStr);
    if (isNaN(dateObj.getTime())) return;
    const monthName = dateObj.toLocaleString('en-US', { month: 'short' });
    if (monthName in liveExpenses) {
      liveExpenses[monthName] += exp.amount || 0;
    }
  });

  // 5. Combine Baseline + Dynamic Data (Method 2: Cumulative Blending)
  const chartData = [
    { name: 'Jan', revenue: revenueBaselines['Jan'] + liveRevenue['Jan'], expenses: expenseBaselines['Jan'] + liveExpenses['Jan'] },
    { name: 'Feb', revenue: revenueBaselines['Feb'] + liveRevenue['Feb'], expenses: expenseBaselines['Feb'] + liveExpenses['Feb'] },
    { name: 'Mar', revenue: revenueBaselines['Mar'] + liveRevenue['Mar'], expenses: expenseBaselines['Mar'] + liveExpenses['Mar'] },
    { name: 'Apr', revenue: revenueBaselines['Apr'] + liveRevenue['Apr'], expenses: expenseBaselines['Apr'] + liveExpenses['Apr'] },
    { name: 'May', revenue: revenueBaselines['May'] + liveRevenue['May'], expenses: expenseBaselines['May'] + liveExpenses['May'] },
    { name: 'Jun', revenue: revenueBaselines['Jun'] + liveRevenue['Jun'], expenses: expenseBaselines['Jun'] + liveExpenses['Jun'] },
    { name: 'Jul', revenue: revenueBaselines['Jul'] + liveRevenue['Jul'], expenses: expenseBaselines['Jul'] + liveExpenses['Jul'] },
    { name: 'Aug', revenue: revenueBaselines['Aug'] + liveRevenue['Aug'], expenses: expenseBaselines['Aug'] + liveExpenses['Aug'] },
    { name: 'Sep', revenue: revenueBaselines['Sep'] + liveRevenue['Sep'], expenses: expenseBaselines['Sep'] + liveExpenses['Sep'] },
    { name: 'Oct', revenue: revenueBaselines['Oct'] + liveRevenue['Oct'], expenses: expenseBaselines['Oct'] + liveExpenses['Oct'] },
    { name: 'Nov', revenue: revenueBaselines['Nov'] + liveRevenue['Nov'], expenses: expenseBaselines['Nov'] + liveExpenses['Nov'] },
    { name: 'Dec', revenue: revenueBaselines['Dec'] + liveRevenue['Dec'], expenses: expenseBaselines['Dec'] + liveExpenses['Dec'] },
  ];

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart
        data={chartData}
        margin={{
          top: 10,
          right: 10,
          left: -20,
          bottom: 0,
        }}
      >
        <defs>
          <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
            <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
          </linearGradient>
          <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3}/>
            <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
        <XAxis 
          dataKey="name" 
          axisLine={false} 
          tickLine={false} 
          tick={{ fill: '#8b8ba7', fontSize: 12 }}
          dy={10}
        />
        <YAxis 
          axisLine={false} 
          tickLine={false} 
          tick={{ fill: '#8b8ba7', fontSize: 12 }}
          tickFormatter={formatYAxis}
        />
        <Tooltip 
          contentStyle={{ 
            backgroundColor: '#1a1a26', 
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '12px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.5)'
          }}
          itemStyle={{ color: '#f0f0ff' }}
          formatter={(value: any) => [new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(value), ""]}
        />
        <Area 
          type="monotone" 
          dataKey="revenue" 
          name="Revenue"
          stroke="#6366f1" 
          strokeWidth={3}
          fillOpacity={1} 
          fill="url(#colorRevenue)" 
        />
        <Area 
          type="monotone" 
          dataKey="expenses" 
          name="Expenses"
          stroke="#f43f5e" 
          strokeWidth={3}
          fillOpacity={1} 
          fill="url(#colorExpenses)" 
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
