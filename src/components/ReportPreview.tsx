"use client";

import { X, Printer, FileText, CheckCircle2, Users, TrendingUp, Briefcase } from "lucide-react";
import { useEffect } from "react";

interface ReportPreviewProps {
  data: {
    stats: {
      totalRevenue: number;
      activeClients: number;
      completedProjects: number;
      pendingPayments: number;
    };
    leads: any[];
    clients: any[];
    projects: any[];
  };
  onClose: () => void;
}

export default function ReportPreview({ data, onClose }: ReportPreviewProps) {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = 'unset'; };
  }, []);

  const fmt = (n: number) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);
  const formatDate = (d: string) => {
    if (!d) return 'N/A';
    const date = new Date(d);
    return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const today = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <div 
      className="report-preview-overlay"
      style={{
        position: 'fixed',
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        zIndex: 9999,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
        padding: '40px',
        overflowY: 'auto',
        fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
      }}
    >
      {/* Controls */}
      <div 
        className="print-hidden"
        style={{
          position: 'fixed',
          top: '24px',
          right: '24px',
          display: 'flex',
          gap: '12px',
          zIndex: 10000
        }}
      >
        <button 
          onClick={() => window.print()}
          style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            padding: '10px 24px', backgroundColor: '#6366f1', color: '#fff',
            borderRadius: '10px', border: 'none', cursor: 'pointer',
            fontWeight: 600, fontSize: '14px', boxShadow: '0 4px 15px rgba(99,102,241,0.3)'
          }}
        >
          <Printer size={18} /> Print Report
        </button>
        <button 
          onClick={onClose}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            width: '40px', height: '40px', backgroundColor: 'rgba(255,255,255,0.1)', color: '#fff',
            borderRadius: '50%', border: 'none', cursor: 'pointer', backdropFilter: 'blur(4px)'
          }}
        >
          <X size={20} />
        </button>
      </div>

      {/* Report Paper */}
      <div 
        id="report-paper" 
        style={{
          backgroundColor: '#f6f5ef', // Minimalist beige
          width: '100%',
          maxWidth: '1000px',
          minHeight: '1400px',
          margin: '0 auto',
          padding: '80px 60px',
          boxSizing: 'border-box',
          color: '#111',
          boxShadow: '0 10px 40px rgba(0,0,0,0.5)',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '50px' }}>
          <div>
            <h1 style={{ fontSize: '14px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.2em', margin: '0 0 12px 0', color: '#6366f1' }}>Agency Performance Report</h1>
            <h2 style={{ fontSize: '56px', fontWeight: 800, margin: 0, letterSpacing: '-0.04em', lineHeight: 0.9 }}>Skittex CRM</h2>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '14px', fontWeight: 600 }}>{today}</div>
            <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>Confidential Internal Document</div>
          </div>
        </div>

        <hr style={{ border: 'none', borderTop: '2px solid #111', margin: '0 0 40px 0' }} />

        {/* Executive Summary */}
        <section style={{ marginBottom: '60px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '24px', borderLeft: '4px solid #111', paddingLeft: '16px' }}>I. Executive Summary</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
            <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '4px', border: '1px solid #ddd' }}>
              <div style={{ fontSize: '11px', fontWeight: 700, color: '#666', textTransform: 'uppercase', marginBottom: '8px' }}>Total Revenue</div>
              <div style={{ fontSize: '20px', fontWeight: 800 }}>{fmt(data.stats.totalRevenue)}</div>
            </div>
            <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '4px', border: '1px solid #ddd' }}>
              <div style={{ fontSize: '11px', fontWeight: 700, color: '#666', textTransform: 'uppercase', marginBottom: '8px' }}>Active Clients</div>
              <div style={{ fontSize: '20px', fontWeight: 800 }}>{data.stats.activeClients}</div>
            </div>
            <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '4px', border: '1px solid #ddd' }}>
              <div style={{ fontSize: '11px', fontWeight: 700, color: '#666', textTransform: 'uppercase', marginBottom: '8px' }}>Completed Projects</div>
              <div style={{ fontSize: '20px', fontWeight: 800 }}>{data.stats.completedProjects}</div>
            </div>
            <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '4px', border: '1px solid #ddd' }}>
              <div style={{ fontSize: '11px', fontWeight: 700, color: '#666', textTransform: 'uppercase', marginBottom: '8px' }}>Pending Payments</div>
              <div style={{ fontSize: '20px', fontWeight: 800 }}>{fmt(data.stats.pendingPayments)}</div>
            </div>
          </div>
        </section>

        {/* Leads Section */}
        <section style={{ marginBottom: '60px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '24px', borderLeft: '4px solid #111', paddingLeft: '16px' }}>II. New Leads (Last 30 Days)</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #111' }}>
                <th style={{ textAlign: 'left', padding: '12px 8px', fontSize: '13px' }}>Name</th>
                <th style={{ textAlign: 'left', padding: '12px 8px', fontSize: '13px' }}>Email</th>
                <th style={{ textAlign: 'left', padding: '12px 8px', fontSize: '13px' }}>Source</th>
                <th style={{ textAlign: 'left', padding: '12px 8px', fontSize: '13px' }}>Status</th>
                <th style={{ textAlign: 'right', padding: '12px 8px', fontSize: '13px' }}>Est. Value</th>
              </tr>
            </thead>
            <tbody>
              {data.leads.map((lead, i) => (
                <tr key={i} style={{ borderBottom: '1px solid #ddd' }}>
                  <td style={{ padding: '12px 8px', fontSize: '13px', fontWeight: 600 }}>{lead.name}</td>
                  <td style={{ padding: '12px 8px', fontSize: '13px' }}>{lead.email}</td>
                  <td style={{ padding: '12px 8px', fontSize: '13px' }}>{lead.source}</td>
                  <td style={{ padding: '12px 8px', fontSize: '13px', textTransform: 'capitalize' }}>{lead.status}</td>
                  <td style={{ padding: '12px 8px', fontSize: '13px', textAlign: 'right', fontWeight: 600 }}>{fmt(lead.value || 0)}</td>
                </tr>
              ))}
              {data.leads.length === 0 && (
                <tr><td colSpan={5} style={{ padding: '24px', textAlign: 'center', color: '#666' }}>No recent leads found.</td></tr>
              )}
            </tbody>
          </table>
        </section>

        {/* Clients Section */}
        <section style={{ marginBottom: '60px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '24px', borderLeft: '4px solid #111', paddingLeft: '16px' }}>III. Client Portfolio</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
            {data.clients.map((client, i) => (
              <div key={i} style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '4px', border: '1px solid #ddd', display: 'flex', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontSize: '15px', fontWeight: 700 }}>{client.businessName}</div>
                  <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>Contact: {client.name}</div>
                  <div style={{ fontSize: '11px', color: '#888', marginTop: '8px' }}>Joined: {formatDate(client.joinedAt)}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: '#10b981' }}>{fmt(client.totalRevenue)}</div>
                  <div style={{ fontSize: '10px', textTransform: 'uppercase', color: '#888', marginTop: '4px' }}>Lifetime Value</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Projects Section */}
        <section style={{ marginBottom: '60px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '24px', borderLeft: '4px solid #111', paddingLeft: '16px' }}>IV. Project Status & Pipeline</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {data.projects.map((proj, i) => (
              <div key={i} style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '4px', border: '1px solid #ddd' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                  <div>
                    <div style={{ fontSize: '15px', fontWeight: 700 }}>{proj.name}</div>
                    <div style={{ fontSize: '12px', color: '#666' }}>Client: {proj.clientName}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', color: proj.status === 'completed' ? '#10b981' : '#6366f1' }}>{proj.status}</div>
                    <div style={{ fontSize: '11px', color: '#888' }}>Due: {formatDate(proj.deadline)}</div>
                  </div>
                </div>
                <div style={{ width: '100%', height: '6px', backgroundColor: '#f0f0f0', borderRadius: '99px', overflow: 'hidden' }}>
                  <div style={{ width: `${proj.completionPercentage}%`, height: '100%', backgroundColor: proj.status === 'completed' ? '#10b981' : '#6366f1' }}></div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px' }}>
                   <div style={{ fontSize: '11px', color: '#888' }}>{proj.type}</div>
                   <div style={{ fontSize: '11px', fontWeight: 700 }}>{proj.completionPercentage}% Complete</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Footer */}
        <div style={{ marginTop: 'auto', borderTop: '1px solid #ddd', paddingTop: '30px', textAlign: 'center' }}>
          <div style={{ fontSize: '12px', color: '#888' }}>Skittex Studio Agency Management System</div>
          <div style={{ fontSize: '10px', color: '#aaa', marginTop: '4px' }}>Generated by Skittex CRM • Automated Performance Tracking</div>
        </div>
      </div>

      <style jsx global>{`
        @media print {
          @page {
            size: A4;
            margin: 10mm; /* Small margin to avoid printer non-printable areas */
          }
          body {
            margin: 0;
            padding: 0;
            background-color: #f6f5ef !important;
          }
          body * {
            visibility: hidden;
          }
          .report-preview-overlay, .report-preview-overlay * {
            visibility: visible;
          }
          .report-preview-overlay {
            position: absolute !important;
            top: 0 !important;
            left: 0 !important;
            width: 100% !important;
            height: auto !important;
            background-color: #f6f5ef !important;
            padding: 0 !important;
            margin: 0 !important;
            overflow: visible !important;
          }
          #report-paper {
            position: relative !important;
            width: 210mm !important; /* A4 Width */
            min-height: 297mm !important; /* A4 Height */
            margin: 0 auto !important;
            padding: 30mm 25mm !important; /* Generous padding for breathing room */
            box-shadow: none !important;
            background-color: #f6f5ef !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            display: block !important;
          }
          section {
            margin-bottom: 80px !important;
            page-break-inside: avoid;
          }
          h3 {
            margin-top: 40px !important;
          }
          .print-hidden {
            display: none !important;
          }
          /* Prevent page breaks inside rows */
          tr, .glass-card, section > div {
            page-break-inside: avoid;
          }
        }
      `}</style>
    </div>
  );
}
