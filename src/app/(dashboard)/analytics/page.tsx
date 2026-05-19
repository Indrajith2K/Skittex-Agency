"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { Download, Calendar } from 'lucide-react';
import { useStore } from '@/lib/store';

const CHART_COLORS = ["#6366f1", "#8b5cf6", "#10b981", "#f59e0b"];

const cardBase: React.CSSProperties = { background: 'rgba(20,20,28,0.6)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '16px', padding: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.2)' };

const fmt = (n: number) => `₹${(n/1000).toFixed(0)}k`;

// Helper keyword categorizer to map invoice item descriptions to services
const getServiceCategory = (desc: string): string => {
  const d = desc.toLowerCase();
  if (d.includes('web') || d.includes('dev') || d.includes('design') || d.includes('implement') || d.includes('react') || d.includes('ui') || d.includes('ux') || d.includes('dashboard') || d.includes('landing') || d.includes('portal') || d.includes('platform') || d.includes('e-commerce') || d.includes('app')) {
    return 'Web Dev';
  }
  if (d.includes('seo') || d.includes('marketing') || d.includes('ads') || d.includes('campaign') || d.includes('optim') || d.includes('traffic')) {
    return 'SEO';
  }
  if (d.includes('host') || d.includes('domain') || d.includes('cloud') || d.includes('server') || d.includes('maintenance')) {
    return 'Hosting';
  }
  return 'Consulting'; // default fallback (for strategy, compliance, advisory, etc.)
};

export default function AnalyticsPage() {
  const invoices = useStore(state => state.invoices) as any[];

  // --- 1. Cumulative Revenue by Service (Donut Chart) ---
  // Baseline service values
  const serviceBaselines = {
    'Web Dev': 450000,
    'SEO': 200000,
    'Hosting': 50000,
    'Consulting': 150000,
  };

  // Real-time dynamic values calculated from database
  const serviceTotals = {
    'Web Dev': 0,
    'SEO': 0,
    'Hosting': 0,
    'Consulting': 0,
  };

  invoices.filter((inv: any) => inv.status === 'paid').forEach((inv: any) => {
    if (inv.items && Array.isArray(inv.items) && inv.items.length > 0) {
      inv.items.forEach((item: any) => {
        const category = getServiceCategory(item.description);
        serviceTotals[category as keyof typeof serviceTotals] += (item.qty * item.price) || 0;
      });
    } else {
      serviceTotals['Consulting'] += inv.amount || 0;
    }
  });

  // Cumulative blend: baseline + live database changes
  const revenueData = [
    { name: 'Web Dev', value: serviceBaselines['Web Dev'] + serviceTotals['Web Dev'] },
    { name: 'SEO', value: serviceBaselines['SEO'] + serviceTotals['SEO'] },
    { name: 'Hosting', value: serviceBaselines['Hosting'] + serviceTotals['Hosting'] },
    { name: 'Consulting', value: serviceBaselines['Consulting'] + serviceTotals['Consulting'] },
  ];

  const totalRevenueValue = revenueData.reduce((sum, item) => sum + item.value, 0) || 1;

  // --- 2. Cumulative Monthly Revenue Growth (Bar Chart) ---
  // Baseline monthly values
  const monthlyBaselines: { [key: string]: number } = {
    'Jan': 120000,
    'Feb': 150000,
    'Mar': 180000,
    'Apr': 250000,
    'May': 300000,
    'Jun': 400000,
  };

  // Real-time monthly values calculated from database
  const monthlyTotals: { [key: string]: number } = {
    'Jan': 0,
    'Feb': 0,
    'Mar': 0,
    'Apr': 0,
    'May': 0,
    'Jun': 0,
  };

  invoices.filter((inv: any) => inv.status === 'paid').forEach((inv: any) => {
    if (!inv.date) return;
    const dateObj = new Date(inv.date);
    if (isNaN(dateObj.getTime())) return;
    const monthName = dateObj.toLocaleString('en-US', { month: 'short' }); // e.g. "Jan", "May"
    if (monthName in monthlyTotals) {
      monthlyTotals[monthName] += inv.amount || 0;
    }
  });

  // Cumulative blend: baseline + live database changes
  const growthData = [
    { month: 'Jan', revenue: monthlyBaselines['Jan'] + monthlyTotals['Jan'] },
    { month: 'Feb', revenue: monthlyBaselines['Feb'] + monthlyTotals['Feb'] },
    { month: 'Mar', revenue: monthlyBaselines['Mar'] + monthlyTotals['Mar'] },
    { month: 'Apr', revenue: monthlyBaselines['Apr'] + monthlyTotals['Apr'] },
    { month: 'May', revenue: monthlyBaselines['May'] + monthlyTotals['May'] },
    { month: 'Jun', revenue: monthlyBaselines['Jun'] + monthlyTotals['Jun'] },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      <div className="page-header">
        <div>
          <h1 style={{ fontSize: '28px', fontFamily: '"Outfit", sans-serif', fontWeight: 700, color: '#fff', letterSpacing: '-0.02em', margin: 0 }}>Analytics</h1>
          <p style={{ fontSize: '14px', color: '#8b8ba7', marginTop: '6px' }}>Deep dive into your agency&apos;s performance metrics.</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '9px 14px', borderRadius: '10px', fontSize: '13px', fontWeight: 500, background: 'transparent', color: '#8b8ba7', border: '1px solid rgba(255,255,255,0.08)', cursor: 'pointer' }}>
            <Calendar style={{ width: '14px', height: '14px' }} /> Last 6 Months
          </button>
          <button style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '9px 16px', borderRadius: '10px', fontSize: '13px', fontWeight: 600, background: 'linear-gradient(135deg, #6366f1, #7c3aed)', color: '#fff', border: 'none', cursor: 'pointer', boxShadow: '0 4px 15px rgba(99,102,241,0.3)' }}>
            <Download style={{ width: '14px', height: '14px' }} /> Export Data
          </button>
        </div>
      </div>

      <div className="responsive-grid-2" style={{ gap: "24px" }}>
        {/* Donut Chart */}
        <div style={cardBase}>
          <h2 style={{ fontSize: '16px', fontWeight: 600, color: '#fff', margin: '0 0 24px 0' }}>Revenue by Service</h2>
          <div style={{ height: '280px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={revenueData} cx="50%" cy="50%" innerRadius={80} outerRadius={110} paddingAngle={5} dataKey="value" stroke="none">
                  {revenueData.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#1a1a26', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }} itemStyle={{ color: '#f0f0ff' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="responsive-grid-2" style={{ gap: "12px", marginTop: "16px" }}>
            {revenueData.map((entry, i) => (
              <div key={entry.name} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}>
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: CHART_COLORS[i], flexShrink: 0 }} />
                <span style={{ color: '#8b8ba7', flex: 1 }}>{entry.name}</span>
                <span style={{ color: '#fff', fontWeight: 600 }}>{Math.round((entry.value / totalRevenueValue) * 100)}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bar Chart */}
        <div style={cardBase}>
          <h2 style={{ fontSize: '16px', fontWeight: 600, color: '#fff', margin: '0 0 24px 0' }}>Revenue Growth</h2>
          <div style={{ height: '280px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={growthData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#8b8ba7', fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#8b8ba7', fontSize: 12 }} tickFormatter={fmt} />
                <Tooltip contentStyle={{ backgroundColor: '#1a1a26', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }} cursor={{ fill: 'rgba(255,255,255,0.02)' }} />
                <Bar dataKey="revenue" fill="#6366f1" radius={[4, 4, 0, 0]} barSize={30} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}>
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#6366f1' }} />
              <span style={{ color: '#8b8ba7' }}>Revenue Growth</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
