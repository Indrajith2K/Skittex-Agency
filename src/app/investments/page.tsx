"use client";

import { useState } from "react";
import { Plus, TrendingUp, PieChart as PieChartIcon, X } from "lucide-react";

interface InvestmentType {
  id: string;
  name: string;
  type: string;
  invested: number;
  current: number;
  returnPct: number;
  color: string;
}

const fmt = (n: number) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", minimumFractionDigits: 0 }).format(n);

const mockInvestments: InvestmentType[] = [
  { id: "1", name: "Nifty 50 Index Fund", type: "Mutual Fund", invested: 500000, current: 620000, returnPct: 24.0, color: '#8b5cf6' },
  { id: "2", name: "HDFC Bank", type: "Stocks", invested: 200000, current: 215000, returnPct: 7.5, color: '#3b82f6' },
  { id: "3", name: "Physical Gold", type: "Gold", invested: 300000, current: 345000, returnPct: 15.0, color: '#f59e0b' },
  { id: "4", name: "Bitcoin", type: "Crypto", invested: 50000, current: 85000, returnPct: 70.0, color: '#f43f5e' },
];

function getColorForType(type: string) {
  switch (type) {
    case 'Mutual Fund': return '#8b5cf6';
    case 'Stocks': return '#3b82f6';
    case 'Gold': return '#f59e0b';
    case 'Silver': return '#9ca3af';
    case 'FD': return '#14b8a6';
    case 'Crypto': return '#f43f5e';
    case 'Real Estate': return '#10b981';
    default: return '#6366f1';
  }
}

const cardBase: React.CSSProperties = { background: 'rgba(20,20,28,0.6)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.2)' };
const tc: React.CSSProperties = { padding: '16px 18px', borderBottom: '1px solid rgba(255,255,255,0.04)', fontSize: '13.5px' };
const th: React.CSSProperties = { ...tc, fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#5a5a78', borderBottom: '1px solid rgba(255,255,255,0.06)', textAlign: 'left' };

export default function InvestmentsPage() {
  const [investments, setInvestments] = useState<InvestmentType[]>(mockInvestments);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentInv, setCurrentInv] = useState<Partial<InvestmentType>>({
    name: '', type: 'Mutual Fund', invested: 0, current: 0
  });

  const totalInvested = investments.reduce((a, c) => a + c.invested, 0);
  const currentVal = investments.reduce((a, c) => a + c.current, 0);
  const totalReturn = currentVal - totalInvested;
  const returnPct = totalInvested > 0 ? ((totalReturn) / totalInvested) * 100 : 0;

  // Group by Asset Type for Allocation
  const allocationByType = investments.reduce((acc, curr) => {
    if (!acc[curr.type]) {
      acc[curr.type] = { type: curr.type, total: 0, color: curr.color };
    }
    acc[curr.type].total += curr.current;
    return acc;
  }, {} as Record<string, { type: string, total: number, color: string }>);

  const allocationArray = Object.values(allocationByType).sort((a, b) => b.total - a.total);

  const openAddModal = () => {
    setCurrentInv({ name: '', type: 'Mutual Fund', invested: 0, current: 0 });
    setIsModalOpen(true);
  };

  const openEditModal = (inv: InvestmentType) => {
    setCurrentInv(inv);
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (!currentInv.name || currentInv.invested === undefined || currentInv.current === undefined) return;

    const computedReturnPct = currentInv.invested > 0 
      ? ((currentInv.current - currentInv.invested) / currentInv.invested) * 100 
      : 0;

    const invToSave: InvestmentType = {
      id: currentInv.id || Date.now().toString(),
      name: currentInv.name,
      type: currentInv.type || 'Mutual Fund',
      invested: currentInv.invested,
      current: currentInv.current,
      returnPct: Number(computedReturnPct.toFixed(2)),
      color: getColorForType(currentInv.type || 'Mutual Fund')
    };

    if (currentInv.id) {
      setInvestments(investments.map(i => i.id === invToSave.id ? invToSave : i));
    } else {
      setInvestments([invToSave, ...investments]);
    }
    setIsModalOpen(false);
  };

  const handleDelete = () => {
    if (currentInv.id) {
      setInvestments(investments.filter(i => i.id !== currentInv.id));
      setIsModalOpen(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      <div className="page-header">
        <div>
          <h1 style={{ fontSize: '28px', fontFamily: '"Outfit", sans-serif', fontWeight: 700, color: '#fff', letterSpacing: '-0.02em', margin: 0 }}>Investments</h1>
          <p style={{ fontSize: '14px', color: '#8b8ba7', marginTop: '6px' }}>Track your personal wealth and agency reserves.</p>
        </div>
        <button onClick={openAddModal} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '9px 16px', borderRadius: '10px', fontSize: '13px', fontWeight: 600, background: 'linear-gradient(135deg, #6366f1, #7c3aed)', color: '#fff', border: 'none', cursor: 'pointer', boxShadow: '0 4px 15px rgba(99,102,241,0.3)' }}>
          <Plus style={{ width: '16px', height: '16px' }} /> Add Investment
        </button>
      </div>

      {/* Summary */}
      <div className="responsive-grid-3">
        <div style={{ ...cardBase, padding: '24px', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', right: '-20px', bottom: '-20px', opacity: 0.04 }}>
            <PieChartIcon style={{ width: '160px', height: '160px', color: '#fff' }} />
          </div>
          <p style={{ fontSize: '13px', color: '#8b8ba7', margin: '0 0 8px 0', fontWeight: 500 }}>Total Portfolio Value</p>
          <p style={{ fontSize: '32px', fontWeight: 700, color: '#fff', margin: '0 0 16px 0', letterSpacing: '-0.02em' }}>{fmt(currentVal)}</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}>
            <span style={{ color: '#5a5a78' }}>Invested:</span>
            <span style={{ color: '#fff', fontWeight: 500 }}>{fmt(totalInvested)}</span>
          </div>
        </div>
        <div style={{ ...cardBase, padding: '24px', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', right: '-20px', bottom: '-20px', opacity: 0.04 }}>
            <TrendingUp style={{ width: '160px', height: '160px', color: '#fff' }} />
          </div>
          <p style={{ fontSize: '13px', color: '#8b8ba7', margin: '0 0 8px 0', fontWeight: 500 }}>Total Returns</p>
          <p style={{ fontSize: '32px', fontWeight: 700, color: totalReturn >= 0 ? '#10b981' : '#f43f5e', margin: '0 0 16px 0', letterSpacing: '-0.02em' }}>
            {totalReturn >= 0 ? '+' : ''}{fmt(totalReturn)}
          </p>
          <span style={{ fontSize: '11px', fontWeight: 600, background: totalReturn >= 0 ? 'rgba(16,185,129,0.1)' : 'rgba(244,63,94,0.1)', color: totalReturn >= 0 ? '#10b981' : '#f43f5e', padding: '4px 10px', borderRadius: '6px', border: `1px solid ${totalReturn >= 0 ? 'rgba(16,185,129,0.2)' : 'rgba(244,63,94,0.2)'}` }}>
            {totalReturn >= 0 ? '+' : ''}{returnPct.toFixed(2)}% All time
          </span>
        </div>
        <div style={{ ...cardBase, padding: '24px' }}>
          <h3 style={{ fontSize: '13px', fontWeight: 600, color: '#fff', margin: '0 0 20px 0' }}>Allocation</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {allocationArray.length > 0 ? allocationArray.map(alloc => (
              <div key={alloc.type}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '6px' }}>
                  <span style={{ color: '#8b8ba7' }}>{alloc.type}</span>
                  <span style={{ color: '#fff', fontWeight: 500 }}>{((alloc.total / currentVal) * 100).toFixed(1)}%</span>
                </div>
                <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '99px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', borderRadius: '99px', background: alloc.color, width: `${(alloc.total / currentVal) * 100}%` }} />
                </div>
              </div>
            )) : (
              <p style={{ fontSize: '13px', color: '#5a5a78' }}>No investments found.</p>
            )}
          </div>
        </div>
      </div>

      {/* Table */}
      <div style={{ ...cardBase, overflowX: "auto" }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '600px' }}>
          <thead>
            <tr>
              <th style={th}>Asset Name</th>
              <th style={th}>Type</th>
              <th style={{ ...th, textAlign: 'right' }}>Invested</th>
              <th style={{ ...th, textAlign: 'right' }}>Current Value</th>
              <th style={{ ...th, textAlign: 'right' }}>Returns</th>
            </tr>
          </thead>
          <tbody>
            {investments.map((inv) => (
              <tr 
                key={inv.id} 
                onClick={() => openEditModal(inv)}
                style={{ cursor: 'pointer', transition: 'background 0.2s' }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
              >
                <td style={{ ...tc, fontWeight: 600, color: '#fff' }}>{inv.name}</td>
                <td style={tc}>
                  <span style={{ fontSize: '11px', padding: '3px 10px', borderRadius: '6px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)', color: '#8b8ba7' }}>{inv.type}</span>
                </td>
                <td style={{ ...tc, textAlign: 'right', color: '#8b8ba7' }}>{fmt(inv.invested)}</td>
                <td style={{ ...tc, textAlign: 'right', fontWeight: 600, color: '#fff' }}>{fmt(inv.current)}</td>
                <td style={{ ...tc, textAlign: 'right' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                    <span style={{ color: (inv.current - inv.invested) >= 0 ? '#10b981' : '#f43f5e', fontWeight: 600 }}>
                      {(inv.current - inv.invested) >= 0 ? '+' : ''}{fmt(inv.current - inv.invested)}
                    </span>
                    <span style={{ fontSize: '11px', color: (inv.current - inv.invested) >= 0 ? 'rgba(16,185,129,0.7)' : 'rgba(244,63,94,0.7)', marginTop: '2px' }}>
                      {inv.returnPct >= 0 ? '+' : ''}{inv.returnPct}%
                    </span>
                  </div>
                </td>
              </tr>
            ))}
            {investments.length === 0 && (
              <tr>
                <td colSpan={5} style={{ padding: '40px', textAlign: 'center', color: '#5a5a78', fontSize: '14px' }}>
                  No investments found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ padding: '24px', maxWidth: '500px', width: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 600, color: '#fff', margin: 0 }}>
                {currentInv.id ? 'Edit Investment' : 'Add New Investment'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} style={{ background: 'transparent', border: 'none', color: '#8b8ba7', cursor: 'pointer' }}>
                <X style={{ width: '20px', height: '20px' }} />
              </button>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', color: '#8b8ba7', marginBottom: '8px' }}>Asset Name</label>
                <input type="text" className="input-base" value={currentInv.name} onChange={e => setCurrentInv({...currentInv, name: e.target.value})} placeholder="e.g. Nifty 50 Index Fund" />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', color: '#8b8ba7', marginBottom: '8px' }}>Asset Type</label>
                <select className="input-base" style={{ appearance: 'none' }} value={currentInv.type} onChange={e => setCurrentInv({...currentInv, type: e.target.value})}>
                  <option value="Mutual Fund">Mutual Fund</option>
                  <option value="Stocks">Stocks</option>
                  <option value="Gold">Gold</option>
                  <option value="Silver">Silver</option>
                  <option value="FD">Fixed Deposit (FD)</option>
                  <option value="Crypto">Crypto</option>
                  <option value="Real Estate">Real Estate</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="responsive-grid-2" style={{ gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', color: '#8b8ba7', marginBottom: '8px' }}>Invested Amount (₹)</label>
                  <input type="number" className="input-base" value={currentInv.invested || ''} onChange={e => setCurrentInv({...currentInv, invested: Number(e.target.value)})} placeholder="e.g. 500000" />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', color: '#8b8ba7', marginBottom: '8px' }}>Current Value (₹)</label>
                  <input type="number" className="input-base" value={currentInv.current || ''} onChange={e => setCurrentInv({...currentInv, current: Number(e.target.value)})} placeholder="e.g. 620000" />
                </div>
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '16px', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '20px' }}>
                <div>
                   {currentInv.id && (
                     <button onClick={handleDelete} style={{ padding: '9px 18px', borderRadius: '10px', fontSize: '13px', fontWeight: 500, background: 'rgba(244,63,94,0.1)', color: '#f43f5e', border: '1px solid rgba(244,63,94,0.2)', cursor: 'pointer' }}>Delete Investment</button>
                   )}
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button onClick={() => setIsModalOpen(false)} className="btn btn-ghost">Cancel</button>
                  <button onClick={handleSave} className="btn btn-primary" disabled={!currentInv.name || currentInv.invested === undefined} style={{ opacity: (!currentInv.name || currentInv.invested === undefined) ? 0.5 : 1 }}>
                    {currentInv.id ? 'Save Changes' : 'Add Investment'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
