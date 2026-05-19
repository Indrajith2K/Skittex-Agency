"use client";

import { useState } from "react";
import { Plus, Search, Filter, MoreVertical, Download, Send, X, AlertCircle, CheckCircle2, FileText, Trash2 } from "lucide-react";
import InvoicePreview from "@/components/InvoicePreview";

interface InvoiceItem {
  description: string;
  qty: number;
  price: number;
}

interface InvoiceType {
  id: string;
  number: string;
  client: string;
  clientJobTitle?: string;
  clientCompany?: string;
  clientAddress?: string;
  amount: number; // Total amount (calculated)
  date: string;
  due: string;
  status: 'paid' | 'pending' | 'sent' | 'draft' | 'overdue';
  items: InvoiceItem[];
}

import { useStore } from "@/lib/store";

const fmt = (n: number) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);

function formatDateDisplay(dateStr: string) {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr;
  return date.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
}

function statusStyle(s: string) {
  if (s === 'paid') return { bg: 'rgba(16,185,129,0.12)', color: '#10b981', border: 'rgba(16,185,129,0.2)' };
  if (s === 'overdue') return { bg: 'rgba(244,63,94,0.12)', color: '#f43f5e', border: 'rgba(244,63,94,0.2)' };
  if (s === 'sent' || s === 'pending') return { bg: 'rgba(99,102,241,0.12)', color: '#6366f1', border: 'rgba(99,102,241,0.2)' };
  return { bg: 'rgba(255,255,255,0.05)', color: '#8b8ba7', border: 'rgba(255,255,255,0.06)' };
}

const cardBase: React.CSSProperties = { background: 'rgba(20,20,28,0.6)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.2)' };
const tc: React.CSSProperties = { padding: '16px 18px', borderBottom: '1px solid rgba(255,255,255,0.04)', fontSize: '13.5px' };
const th: React.CSSProperties = { ...tc, fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#5a5a78', borderBottom: '1px solid rgba(255,255,255,0.06)', textAlign: 'left' };

export default function InvoicesPage() {
  const invoices = useStore(state => state.invoices) as any[];
  const addInvoice = useStore(state => state.addInvoice);
  const updateInvoice = useStore(state => state.updateInvoice);
  const deleteInvoice = useStore(state => state.deleteInvoice);

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [previewInvoice, setPreviewInvoice] = useState<InvoiceType | null>(null);
  
  const [currentInvoice, setCurrentInvoice] = useState<Partial<InvoiceType>>({
    number: '', 
    client: '', 
    clientJobTitle: '',
    clientCompany: '',
    clientAddress: '',
    amount: 0, 
    date: new Date().toISOString().split('T')[0], 
    due: '', 
    status: 'draft', 
    items: [{ description: '', qty: 1, price: 0 }]
  });

  const filteredInvoices = invoices.filter(inv => {
    const matchesSearch = inv.number.toLowerCase().includes(searchQuery.toLowerCase()) || inv.client.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || inv.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totals = invoices.reduce((acc, inv) => {
    if (inv.status === 'paid') acc.paid += inv.amount;
    else if (inv.status === 'overdue') acc.overdue += inv.amount;
    else if (inv.status === 'draft') acc.draft += inv.amount;
    else acc.outstanding += inv.amount;
    return acc;
  }, { paid: 0, overdue: 0, draft: 0, outstanding: 0 });

  const openAddModal = () => {
    const nextNum = `INV-2024-${(invoices.length + 1).toString().padStart(3, '0')}`;
    setCurrentInvoice({
      number: nextNum,
      client: '',
      clientJobTitle: '',
      clientCompany: '',
      clientAddress: '',
      amount: 0,
      date: new Date().toISOString().split('T')[0],
      due: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
      status: 'draft',
      items: [{ description: '', qty: 1, price: 0 }]
    });
    setIsModalOpen(true);
  };

  const openEditModal = (inv: InvoiceType) => {
    setCurrentInvoice(inv);
    setIsModalOpen(true);
  };

  const addItem = () => {
    setCurrentInvoice({
      ...currentInvoice,
      items: [...(currentInvoice.items || []), { description: '', qty: 1, price: 0 }]
    });
  };

  const removeItem = (index: number) => {
    const newItems = [...(currentInvoice.items || [])];
    newItems.splice(index, 1);
    setCurrentInvoice({ ...currentInvoice, items: newItems });
  };

  const updateItem = (index: number, field: keyof InvoiceItem, value: any) => {
    const newItems = [...(currentInvoice.items || [])];
    newItems[index] = { ...newItems[index], [field]: value };
    setCurrentInvoice({ ...currentInvoice, items: newItems });
  };

  const handleSave = () => {
    if (!currentInvoice.number || !currentInvoice.client) return;

    const items = currentInvoice.items || [];
    const totalAmount = items.reduce((sum, item) => sum + (item.qty * item.price), 0);

    const invoiceToSave = {
      ...currentInvoice,
      id: currentInvoice.id || Date.now().toString(),
      amount: totalAmount,
      items: items
    } as InvoiceType;

    if (currentInvoice.id) {
      updateInvoice(currentInvoice.id, invoiceToSave);
    } else {
      addInvoice(invoiceToSave);
    }
    setIsModalOpen(false);
  };

  const handleDelete = () => {
    if (currentInvoice.id) {
      deleteInvoice(currentInvoice.id);
      setIsModalOpen(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', height: '100%' }}>
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 style={{ fontSize: '28px', fontFamily: '"Outfit", sans-serif', fontWeight: 700, color: '#fff', letterSpacing: '-0.02em', margin: 0 }}>Invoices</h1>
          <p style={{ fontSize: '14px', color: '#8b8ba7', marginTop: '6px' }}>Manage billing, send quotations, and track payments.</p>
        </div>
        <button onClick={openAddModal} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '9px 16px', borderRadius: '10px', fontSize: '13px', fontWeight: 600, background: 'linear-gradient(135deg, #6366f1, #7c3aed)', color: '#fff', border: 'none', cursor: 'pointer', boxShadow: '0 4px 15px rgba(99,102,241,0.3)' }}>
          <Plus style={{ width: '16px', height: '16px' }} /> Create Invoice
        </button>
      </div>

      {/* Summary Cards */}
      <div className="responsive-grid-4">
        {[
          { label: 'Total Outstanding', value: fmt(totals.outstanding), color: '#fff' },
          { label: 'Overdue', value: fmt(totals.overdue), color: '#f43f5e' },
          { label: 'Paid this Month', value: fmt(totals.paid), color: '#10b981' },
          { label: 'Drafts', value: fmt(totals.draft), color: '#8b8ba7' },
        ].map((item, i) => (
          <div key={i} style={{ ...cardBase, padding: '20px' }}>
            <p style={{ fontSize: '12px', color: '#8b8ba7', margin: '0 0 8px 0' }}>{item.label}</p>
            <p style={{ fontSize: '22px', fontWeight: 700, color: item.color, margin: 0, letterSpacing: '-0.02em' }}>{item.value}</p>
          </div>
        ))}
      </div>

      {/* Search and Filter */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: '260px', maxWidth: '400px' }}>
          <Search style={{ width: '15px', height: '15px', position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#5a5a78' }} />
          <input 
            type="text" 
            placeholder="Search by invoice number or client..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ width: '100%', height: '38px', paddingLeft: '36px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '10px', color: '#f0f0ff', fontSize: '13px', fontFamily: '"Inter", sans-serif', outline: 'none' }} 
          />
        </div>
        <div style={{ position: 'relative' }}>
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{ appearance: 'none', padding: '9px 32px 9px 14px', borderRadius: '10px', fontSize: '13px', fontWeight: 500, background: 'rgba(255,255,255,0.02)', color: '#8b8ba7', border: '1px solid rgba(255,255,255,0.08)', cursor: 'pointer', outline: 'none', textTransform: 'capitalize' }}
          >
            <option value="all">Status: All</option>
            <option value="paid">Paid</option>
            <option value="sent">Sent</option>
            <option value="overdue">Overdue</option>
            <option value="draft">Draft</option>
          </select>
          <Filter style={{ width: '14px', height: '14px', position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: '#5a5a78', pointerEvents: 'none' }} />
        </div>
      </div>

      {/* Table */}
      <div style={{ ...cardBase, overflowX: "auto" }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '900px' }}>
          <thead>
            <tr>
              <th style={th}>Invoice #</th>
              <th style={th}>Client</th>
              <th style={th}>Amount</th>
              <th style={th}>Issue Date</th>
              <th style={th}>Due Date</th>
              <th style={th}>Status</th>
              <th style={{ ...th, textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredInvoices.map((inv) => {
              const ss = statusStyle(inv.status);
              return (
                <tr 
                  key={inv.id} 
                  onClick={() => openEditModal(inv)}
                  style={{ cursor: 'pointer', transition: 'background 0.2s' }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  <td style={{ ...tc, fontWeight: 600, color: '#fff', fontFamily: '"Outfit", sans-serif' }}>{inv.number}</td>
                  <td style={{ ...tc, color: '#fff', fontWeight: 500 }}>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span>{inv.client}</span>
                      <span style={{ fontSize: '11px', color: '#8b8ba7' }}>{inv.clientCompany}</span>
                    </div>
                  </td>
                  <td style={{ ...tc, fontWeight: 700, color: inv.status === 'paid' ? '#10b981' : '#fff' }}>{fmt(inv.amount)}</td>
                  <td style={{ ...tc, color: '#8b8ba7', fontSize: '13px' }}>{formatDateDisplay(inv.date)}</td>
                  <td style={{ ...tc, color: '#8b8ba7', fontSize: '13px' }}>{formatDateDisplay(inv.due)}</td>
                  <td style={tc}>
                    <span style={{ fontSize: '10px', fontWeight: 600, textTransform: 'uppercase', padding: '3px 10px', borderRadius: '99px', background: ss.bg, color: ss.color, border: `1px solid ${ss.border}`, letterSpacing: '0.04em' }}>{inv.status}</span>
                  </td>
                  <td style={{ ...tc, textAlign: 'right' }}>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                      <button 
                        onClick={(e) => { e.stopPropagation(); setPreviewInvoice(inv); }} 
                        style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px', borderRadius: '8px', background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)', color: '#818cf8', cursor: 'pointer', fontSize: '11px', fontWeight: 600 }}
                        title="Generate Invoice"
                      >
                        <FileText style={{ width: '13px', height: '13px' }} /> Generate
                      </button>
                      <button onClick={(e) => { e.stopPropagation(); /* more logic */ }} style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'transparent', border: 'none', color: '#5a5a78', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><MoreVertical style={{ width: '16px', height: '16px' }} /></button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Create/Edit Invoice Modal */}
      {isModalOpen && (
        <div className="modal-overlay" style={{ zIndex: 100 }}>
          <div className="modal-content" style={{ padding: '0', maxWidth: '800px', width: '95%', maxHeight: '90vh', overflowY: 'auto', background: '#0f0f13' }}>
            <div style={{ position: 'sticky', top: 0, background: '#0f0f13', padding: '24px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 10 }}>
              <h2 style={{ fontSize: '20px', fontWeight: 600, color: '#fff', margin: 0, fontFamily: '"Outfit", sans-serif' }}>
                {currentInvoice.id ? 'Edit Invoice' : 'Create New Invoice'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} style={{ background: 'transparent', border: 'none', color: '#8b8ba7', cursor: 'pointer' }}>
                <X style={{ width: '20px', height: '20px' }} />
              </button>
            </div>
            
            <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '28px' }}>
              
              {/* Basic Info Section */}
              <section>
                <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#818cf8', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Basic Information</h3>
                <div className="responsive-grid-2" style={{ gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', color: '#8b8ba7', marginBottom: '8px' }}>Invoice Number</label>
                    <input type="text" className="input-base" value={currentInvoice.number} onChange={e => setCurrentInvoice({...currentInvoice, number: e.target.value})} placeholder="INV-2024-001" />
                  </div>
                  <div className="responsive-grid-2" style={{ gap: '12px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '13px', color: '#8b8ba7', marginBottom: '8px' }}>Issue Date</label>
                      <input type="date" className="input-base" value={currentInvoice.date} onChange={e => setCurrentInvoice({...currentInvoice, date: e.target.value})} style={{ colorScheme: 'dark' }} />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '13px', color: '#8b8ba7', marginBottom: '8px' }}>Due Date</label>
                      <input type="date" className="input-base" value={currentInvoice.due} onChange={e => setCurrentInvoice({...currentInvoice, due: e.target.value})} style={{ colorScheme: 'dark' }} />
                    </div>
                  </div>
                </div>
              </section>

              {/* Client Details Section */}
              <section>
                <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#818cf8', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Client Details</h3>
                <div className="responsive-grid-2" style={{ gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', color: '#8b8ba7', marginBottom: '8px' }}>Client Name</label>
                    <input type="text" className="input-base" value={currentInvoice.client} onChange={e => setCurrentInvoice({...currentInvoice, client: e.target.value})} placeholder="e.g. Sarah Montgomery" />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', color: '#8b8ba7', marginBottom: '8px' }}>Job Title</label>
                    <input type="text" className="input-base" value={currentInvoice.clientJobTitle} onChange={e => setCurrentInvoice({...currentInvoice, clientJobTitle: e.target.value})} placeholder="e.g. Systems Architect" />
                  </div>
                </div>
                <div style={{ marginTop: '16px' }}>
                  <label style={{ display: 'block', fontSize: '13px', color: '#8b8ba7', marginBottom: '8px' }}>Company Name</label>
                  <input type="text" className="input-base" value={currentInvoice.clientCompany} onChange={e => setCurrentInvoice({...currentInvoice, clientCompany: e.target.value})} placeholder="e.g. TechVision Dynamics Inc." />
                </div>
                <div style={{ marginTop: '16px' }}>
                  <label style={{ display: 'block', fontSize: '13px', color: '#8b8ba7', marginBottom: '8px' }}>Client Address</label>
                  <textarea className="input-base" style={{ height: '80px', paddingTop: '12px' }} value={currentInvoice.clientAddress} onChange={e => setCurrentInvoice({...currentInvoice, clientAddress: e.target.value})} placeholder="455 Enterprise Way, Floor 12, Austin, TX 78701"></textarea>
                </div>
              </section>

              {/* Line Items Section */}
              <section>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#818cf8', margin: 0, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Line Items</h3>
                  <button onClick={addItem} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#818cf8', background: 'rgba(99,102,241,0.1)', border: 'none', padding: '6px 12px', borderRadius: '8px', cursor: 'pointer' }}>
                    <Plus size={14} /> Add Item
                  </button>
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {(currentInvoice.items || []).map((item, idx) => (
                    <div key={idx} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                      <div style={{ flex: 1 }}>
                        <input type="text" className="input-base" value={item.description} onChange={e => updateItem(idx, 'description', e.target.value)} placeholder="Item Description" />
                      </div>
                      <div style={{ width: '80px' }}>
                        <input type="number" className="input-base" value={item.qty} onChange={e => updateItem(idx, 'qty', Number(e.target.value))} placeholder="Qty" />
                      </div>
                      <div style={{ width: '120px' }}>
                        <input type="number" className="input-base" value={item.price} onChange={e => updateItem(idx, 'price', Number(e.target.value))} placeholder="Price" />
                      </div>
                      <button onClick={() => removeItem(idx)} style={{ padding: '10px', color: '#f43f5e', background: 'transparent', border: 'none', cursor: 'pointer' }}>
                        <Trash2 size={18} />
                      </button>
                    </div>
                  ))}
                </div>
              </section>

              {/* Status Section */}
              <section>
                <label style={{ display: 'block', fontSize: '13px', color: '#8b8ba7', marginBottom: '12px' }}>Invoice Status</label>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  {['draft', 'sent', 'paid', 'overdue'].map(s => (
                    <button
                      key={s}
                      onClick={() => setCurrentInvoice({...currentInvoice, status: s as any})}
                      style={{
                        padding: '8px 16px',
                        borderRadius: '10px',
                        fontSize: '12px',
                        fontWeight: 600,
                        textTransform: 'capitalize',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        background: currentInvoice.status === s ? 'rgba(99,102,241,0.15)' : 'rgba(255,255,255,0.03)',
                        color: currentInvoice.status === s ? '#818cf8' : '#8b8ba7',
                        border: `1px solid ${currentInvoice.status === s ? 'rgba(99,102,241,0.3)' : 'rgba(255,255,255,0.08)'}`,
                      }}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </section>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '12px', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '20px' }}>
                <div>
                   {currentInvoice.id && (
                     <button onClick={handleDelete} style={{ padding: '9px 18px', borderRadius: '10px', fontSize: '13px', fontWeight: 500, background: 'rgba(244,63,94,0.1)', color: '#f43f5e', border: '1px solid rgba(244,63,94,0.2)', cursor: 'pointer' }}>Delete Invoice</button>
                   )}
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button onClick={() => setIsModalOpen(false)} className="btn btn-ghost">Cancel</button>
                  <button onClick={handleSave} className="btn btn-primary" disabled={!currentInvoice.number || !currentInvoice.client || (currentInvoice.items?.length || 0) === 0}>
                    {currentInvoice.id ? 'Save Changes' : 'Create Invoice'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Invoice Preview Modal */}
      {previewInvoice && (
        <InvoicePreview invoice={previewInvoice} onClose={() => setPreviewInvoice(null)} />
      )}
    </div>
  );
}
