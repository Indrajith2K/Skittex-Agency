"use client";

import { useStore } from "@/lib/store";
import { formatCurrency } from "@/lib/utils";
import { ArrowUpRight, ArrowDownRight, TrendingUp, Users, Briefcase, CreditCard } from "lucide-react";
import { RevenueChart } from "@/components/dashboard/RevenueChart";
import ReportPreview from "@/components/ReportPreview";
import { useState } from "react";

const fmt = (n: number) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);

export default function Dashboard() {
  const stats = useStore((state) => state.stats);
  const clients = useStore((state) => state.clients);
  const projects = useStore((state) => state.projects);
  const leads = useStore((state) => state.leads);
  const invoices = useStore((state) => state.invoices) as any[];

  const [showReport, setShowReport] = useState(false);

  const calculatedTotalRevenue = clients.reduce((sum, client) => sum + (client.totalRevenue || 0), 0);
  const calculatedActiveClients = clients.filter(c => c.status === 'active').length;
  const calculatedCompletedProjects = projects.filter(p => p.status === 'completed').length;
  const calculatedPendingPayments = invoices.filter(inv => inv.status !== 'paid' && inv.status !== 'draft').reduce((sum, inv) => sum + (inv.amount || 0), 0);

  // Dynamic Trend Calculations
  const baselineRevenue = 1645000;
  const baselineClients = 4;
  const baselineCompletedProjects = 1;
  const baselinePendingPayments = 0; // Since I just marked all 5 as paid, let's assume baseline was 0 or something realistic

  const revDiff = calculatedTotalRevenue - baselineRevenue;
  const revenueTrend = revDiff >= 0 
    ? `+${((revDiff / baselineRevenue) * 100).toFixed(1)}%` 
    : `${((revDiff / baselineRevenue) * 100).toFixed(1)}%`;

  const clientsDiff = calculatedActiveClients - baselineClients;
  const clientsTrend = clientsDiff >= 0 ? `+${clientsDiff}` : `${clientsDiff}`;

  const projDiff = calculatedCompletedProjects - baselineCompletedProjects;
  const projTrend = projDiff >= 0 
    ? `+${((projDiff / (baselineCompletedProjects || 1)) * 100).toFixed(0)}%` 
    : `${((projDiff / (baselineCompletedProjects || 1)) * 100).toFixed(0)}%`;

  const pendingDiff = calculatedPendingPayments - baselinePendingPayments;
  const pendingTrend = pendingDiff >= 0 ? `+${fmt(pendingDiff)}` : `${fmt(pendingDiff)}`;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 style={{
            fontSize: '28px',
            fontFamily: '"Outfit", sans-serif',
            fontWeight: 700,
            color: '#fff',
            letterSpacing: '-0.02em',
            margin: 0,
          }}>Overview</h1>
          <p style={{ fontSize: '14px', color: '#8b8ba7', marginTop: '6px' }}>
            Welcome back. Here&apos;s what&apos;s happening with your agency today.
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button onClick={() => setShowReport(true)} className="btn btn-ghost">Download Report</button>
          <button className="btn btn-primary">New Project</button>
        </div>
      </div>

      {/* KPI Stat Cards */}
      <div className="responsive-grid-4">
        <StatCard 
          title="Total Revenue" 
          value={formatCurrency(calculatedTotalRevenue)} 
          trend={revenueTrend} 
          isPositive={revDiff >= 0} 
          icon={<TrendingUp style={{ width: '20px', height: '20px' }} />} 
        />
        <StatCard 
          title="Active Clients" 
          value={calculatedActiveClients.toString()} 
          trend={clientsTrend} 
          isPositive={clientsDiff >= 0} 
          icon={<Users style={{ width: '20px', height: '20px' }} />} 
        />
        <StatCard 
          title="Pending Payments" 
          value={formatCurrency(calculatedPendingPayments)} 
          trend={pendingTrend} 
          isPositive={pendingDiff <= 0} 
          icon={<CreditCard style={{ width: '20px', height: '20px' }} />} 
        />
        <StatCard 
          title="Completed Projects" 
          value={calculatedCompletedProjects.toString()} 
          trend={projTrend} 
          isPositive={projDiff >= 0} 
          icon={<Briefcase style={{ width: '20px', height: '20px' }} />} 
        />
      </div>

      {/* Chart + Activity Row */}
      <div className="responsive-grid-2-1">
        {/* Revenue Chart */}
        <div className="glass-card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
            <div>
              <h2 className="section-title">Revenue Overview</h2>
              <p style={{ fontSize: '13px', color: '#5a5a78', marginTop: '4px' }}>Monthly revenue vs expenses</p>
            </div>
            <select className="filter-select">
              <option>This Year</option>
              <option>Last Year</option>
            </select>
          </div>
          <div style={{ height: '280px' }}>
            <RevenueChart />
          </div>
        </div>

        {/* Recent Activity */}
        <div className="glass-card" style={{ 
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 className="section-title">Recent Activity</h2>
            <button style={{
              fontSize: '12px',
              color: '#6366f1',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontWeight: 500,
            }}>View All</button>
          </div>
          <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {[
              { text: 'New project signed', detail: 'Website Redesign', sub: '2 hours ago • TechCorp Inc.' },
              { text: 'Invoice paid', detail: '₹45,000', sub: '4 hours ago • Nexus Properties' },
              { text: 'Lead converted', detail: 'Style Boutique', sub: '6 hours ago • Instagram' },
              { text: 'Project deployed', detail: 'Bloom E-commerce', sub: 'Yesterday • Vercel' },
              { text: 'Follow-up due', detail: 'Chen Tech', sub: 'Tomorrow • Proposal sent' },
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', gap: '14px', position: 'relative' }}>
                {i !== 4 && <div style={{
                  position: 'absolute',
                  left: '14px',
                  top: '32px',
                  bottom: '-20px',
                  width: '1px',
                  background: 'rgba(255,255,255,0.06)',
                }} />}
                <div style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  zIndex: 1,
                }}>
                  <div style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    background: '#6366f1',
                  }} />
                </div>
                <div style={{ minWidth: 0 }}>
                  <p style={{ fontSize: '13px', color: '#e0e0ff', margin: 0, lineHeight: '1.4' }}>
                    {item.text}: <span style={{ fontWeight: 600, color: '#818cf8' }}>{item.detail}</span>
                  </p>
                  <p style={{ fontSize: '11px', color: '#5a5a78', marginTop: '3px' }}>{item.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Report Preview */}
      {showReport && (
        <ReportPreview 
          onClose={() => setShowReport(false)}
          data={{
            stats: {
              totalRevenue: calculatedTotalRevenue,
              activeClients: calculatedActiveClients,
              completedProjects: calculatedCompletedProjects,
              pendingPayments: calculatedPendingPayments
            },
            leads: leads,
            clients: clients,
            projects: projects
          }}
        />
      )}
    </div>
  );
}

function StatCard({ title, value, trend, isPositive, icon }: { 
  title: string; value: string; trend: string; isPositive: boolean; icon: React.ReactNode 
}) {
  return (
    <div className="stat-card" style={{ padding: '22px' }}>
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: '1px',
        background: 'linear-gradient(90deg, transparent, rgba(99, 102, 241, 0.3), transparent)',
      }} />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
        <div style={{
          padding: '10px',
          borderRadius: '12px',
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.06)',
          color: '#8b8ba7',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          {icon}
        </div>
        <span style={{
          display: 'inline-flex', alignItems: 'center', gap: '4px',
          fontSize: '11px', fontWeight: 600,
          padding: '4px 8px', borderRadius: '8px',
          background: isPositive ? 'rgba(16, 185, 129, 0.1)' : 'rgba(244, 63, 94, 0.1)',
          color: isPositive ? '#10b981' : '#f43f5e',
          border: `1px solid ${isPositive ? 'rgba(16, 185, 129, 0.2)' : 'rgba(244, 63, 94, 0.2)'}`,
        }}>
          {isPositive 
            ? <ArrowUpRight style={{ width: '12px', height: '12px' }} /> 
            : <ArrowDownRight style={{ width: '12px', height: '12px' }} />
          }
          {trend}
        </span>
      </div>
      <div>
        <h3 style={{ fontSize: '12px', fontWeight: 500, color: '#8b8ba7', margin: '0 0 6px 0', letterSpacing: '0.02em' }}>{title}</h3>
        <p style={{ fontSize: '24px', fontWeight: 700, color: '#fff', margin: 0, letterSpacing: '-0.02em' }}>{value}</p>
      </div>
    </div>
  );
}
