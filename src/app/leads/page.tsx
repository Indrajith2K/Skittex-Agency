"use client";

import { useState, useEffect } from "react";
import { Plus, Search, Filter, LayoutGrid, List, Phone, Mail, Calendar, MoreHorizontal, X, MessageSquare } from "lucide-react";
import { useStore } from "@/lib/store";

const initialColumns = [
  { id: "new", title: "New Leads", color: "#38bdf8" },
  { id: "contacted", title: "Contacted", color: "#f59e0b" },
  { id: "negotiation", title: "Negotiation", color: "#8b5cf6" },
  { id: "converted", title: "Converted", color: "#10b981" },
  { id: "rejected", title: "Rejected", color: "#f43f5e" },
];

interface LeadType {
  id: string;
  name: string;
  company: string;
  value: string; // Store as formatted string for display
  numericValue: number; // Store raw number for editing
  status: string;
  date: string;
  tag: string;
  phone?: string;
  countryCode?: string;
  isWhatsappSame?: boolean;
  whatsappNumber?: string;
  whatsappCountryCode?: string;
  email?: string;
}

const mockLeads: LeadType[] = [
  { id: "1", name: "Sarah Jenkins", company: "Style Boutique", value: "₹45,000", numericValue: 45000, status: "new", date: "2h ago", tag: "Website", phone: "9876543210", countryCode: "+91", isWhatsappSame: true, email: "sarah@style.com" },
  { id: "2", name: "Mike Chen", company: "Chen Tech", value: "₹1,20,000", numericValue: 120000, status: "new", date: "5h ago", tag: "Web App" },
  { id: "3", name: "Raj Patel", company: "Spice Route", value: "₹35,000", numericValue: 35000, status: "new", date: "1d ago", tag: "SEO" },
  { id: "4", name: "Emma Watson", company: "Watson Legal", value: "₹85,000", numericValue: 85000, status: "contacted", date: "1d ago", tag: "Website" },
  { id: "5", name: "Arjun Nair", company: "Nair Fitness", value: "₹60,000", numericValue: 60000, status: "contacted", date: "2d ago", tag: "GBP" },
  { id: "6", name: "Lisa Park", company: "Park Designs", value: "₹1,50,000", numericValue: 150000, status: "negotiation", date: "3d ago", tag: "E-commerce" },
];

const cardStyle: React.CSSProperties = {
  background: 'rgba(20, 20, 28, 0.6)',
  backdropFilter: 'blur(12px)',
  border: '1px solid rgba(255,255,255,0.05)',
  borderRadius: '14px',
  padding: '16px',
  boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
  cursor: 'grab',
  transition: 'all 0.2s ease',
};

function Toggle({ checked, onChange }: { checked: boolean; onChange: (c: boolean) => void }) {
  return (
    <button 
      onClick={(e) => { e.preventDefault(); onChange(!checked); }}
      style={{
        width: '36px',
        height: '20px',
        borderRadius: '10px',
        background: checked ? '#10b981' : 'rgba(255,255,255,0.1)',
        border: 'none',
        position: 'relative',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        flexShrink: 0
      }}
    >
      <div style={{
        width: '14px',
        height: '14px',
        borderRadius: '50%',
        background: '#fff',
        position: 'absolute',
        top: '3px',
        left: checked ? '19px' : '3px',
        transition: 'all 0.2s ease',
        boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
      }} />
    </button>
  );
}

export default function LeadsPage() {
  const [view, setView] = useState<"kanban" | "list">("kanban");
  const leads = useStore(state => state.leads) as any[];
  const addLead = useStore(state => state.addLead);
  const updateLead = useStore(state => state.updateLead);
  
  const [searchQuery, setSearchQuery] = useState("");
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentLead, setCurrentLead] = useState<Partial<LeadType>>({ 
    name: '', company: '', numericValue: 0, tag: 'Website', phone: '', countryCode: '+91', isWhatsappSame: true, whatsappNumber: '', whatsappCountryCode: '+91', email: '' 
  });
  
  const [draggedOverCol, setDraggedOverCol] = useState<string | null>(null);

  const handleDragStart = (e: React.DragEvent, id: string) => {
    e.dataTransfer.setData("leadId", id);
    setTimeout(() => {
      (e.target as HTMLElement).style.opacity = '0.5';
    }, 0);
  };

  const handleDragEnd = (e: React.DragEvent) => {
    (e.target as HTMLElement).style.opacity = '1';
    setDraggedOverCol(null);
  };

  const handleDragOver = (e: React.DragEvent, colId: string) => {
    e.preventDefault();
    if (draggedOverCol !== colId) {
      setDraggedOverCol(colId);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDraggedOverCol(null);
  };

  const handleDrop = (e: React.DragEvent, status: string) => {
    e.preventDefault();
    const leadId = e.dataTransfer.getData("leadId");
    updateLead(leadId, { status: status as any });
    setDraggedOverCol(null);
  };

  const openAddModal = (status = 'new') => {
    setCurrentLead({ 
      name: '', company: '', numericValue: 0, tag: 'Website', phone: '', countryCode: '+91', isWhatsappSame: true, whatsappNumber: '', whatsappCountryCode: '+91', email: '', status 
    });
    setIsModalOpen(true);
  };

  const openEditModal = (lead: LeadType) => {
    setCurrentLead({
      countryCode: '+91',
      isWhatsappSame: true,
      whatsappCountryCode: '+91',
      ...lead
    });
    setIsModalOpen(true);
  };

  const handleSaveLead = () => {
    if (!currentLead.name || !currentLead.company) return;

    const rawValue = currentLead.numericValue || 0;
    const formattedValue = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(rawValue);

    const leadToSave = { 
      ...currentLead, 
      value: formattedValue, 
      numericValue: rawValue,
      status: currentLead.status || 'new'
    } as any;

    if (currentLead.id) {
      updateLead(currentLead.id, leadToSave);
    } else {
      addLead({ 
        ...leadToSave,
        id: Date.now().toString(), 
        date: 'Just now'
      });
    }
    
    setIsModalOpen(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', height: '100%' }}>
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 style={{ fontSize: '28px', fontFamily: '"Outfit", sans-serif', fontWeight: 700, color: '#fff', letterSpacing: '-0.02em', margin: 0 }}>Leads</h1>
          <p style={{ fontSize: '14px', color: '#8b8ba7', marginTop: '6px' }}>Manage your incoming prospects and sales pipeline.</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ display: 'flex', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', padding: '3px' }}>
            <button onClick={() => setView('kanban')} style={{ padding: '6px 8px', borderRadius: '7px', border: 'none', cursor: 'pointer', background: view === 'kanban' ? 'rgba(255,255,255,0.1)' : 'transparent', color: view === 'kanban' ? '#fff' : '#5a5a78' }}>
              <LayoutGrid style={{ width: '16px', height: '16px' }} />
            </button>
            <button onClick={() => setView('list')} style={{ padding: '6px 8px', borderRadius: '7px', border: 'none', cursor: 'pointer', background: view === 'list' ? 'rgba(255,255,255,0.1)' : 'transparent', color: view === 'list' ? '#fff' : '#5a5a78' }}>
              <List style={{ width: '16px', height: '16px' }} />
            </button>
          </div>
          <button 
            onClick={() => openAddModal()}
            style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '9px 16px', borderRadius: '10px', fontSize: '13px', fontWeight: 600, background: 'linear-gradient(135deg, #6366f1, #7c3aed)', color: '#fff', border: 'none', cursor: 'pointer', boxShadow: '0 4px 15px rgba(99,102,241,0.3)' }}
          >
            <Plus style={{ width: '16px', height: '16px' }} /> Add Lead
          </button>
        </div>
      </div>

      {/* Search */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: '260px', maxWidth: '400px' }}>
          <Search style={{ width: '15px', height: '15px', position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#5a5a78' }} />
          <input 
            type="text" 
            placeholder="Search leads by name or company..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ width: '100%', height: '38px', paddingLeft: '36px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '10px', color: '#f0f0ff', fontSize: '13px', fontFamily: '"Inter", sans-serif', outline: 'none' }} 
          />
        </div>
        <button style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '9px 14px', borderRadius: '10px', fontSize: '13px', fontWeight: 500, background: 'transparent', color: '#8b8ba7', border: '1px solid rgba(255,255,255,0.08)', cursor: 'pointer' }}>
          <Filter style={{ width: '14px', height: '14px' }} /> Filters
        </button>
      </div>

      {/* Kanban Board */}
      <div style={{ 
        display: 'flex', 
        gap: '12px', 
        flex: 1, 
        overflowX: 'auto', 
        paddingBottom: '20px', 
        minHeight: '500px',
        alignItems: 'flex-start'
      }}>
        {initialColumns.map((col) => {
          const colLeads = leads.filter(l => 
            l.status === col.id && 
            (l.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
             l.company.toLowerCase().includes(searchQuery.toLowerCase()))
          );
          const isOver = draggedOverCol === col.id;
          
          return (
            <div key={col.id} style={{ minWidth: '180px', flex: 1, display: 'flex', flexDirection: 'column' }}>
              {/* Column Header */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', padding: '0 4px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#fff', margin: 0, fontFamily: '"Outfit", sans-serif' }}>{col.title}</h3>
                  <span style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '99px', background: 'rgba(255,255,255,0.06)', color: '#8b8ba7', fontWeight: 600 }}>{colLeads.length}</span>
                </div>
                <button style={{ background: 'none', border: 'none', color: '#5a5a78', cursor: 'pointer' }}>
                  <MoreHorizontal style={{ width: '16px', height: '16px' }} />
                </button>
              </div>

              {/* Column Body */}
              <div 
                onDragOver={(e) => handleDragOver(e, col.id)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, col.id)}
                style={{ 
                  background: isOver ? 'rgba(99, 102, 241, 0.05)' : 'rgba(20, 20, 28, 0.4)', 
                  border: isOver ? `1px solid ${col.color}40` : '1px solid rgba(255,255,255,0.04)', 
                  borderRadius: '16px', 
                  padding: '12px', 
                  display: 'flex', 
                  flexDirection: 'column', 
                  gap: '12px',
                  transition: 'all 0.2s ease',
                  minHeight: '100px'
                }}
              >
                {colLeads.map(lead => {
                  const hasWhatsapp = lead.isWhatsappSame ? !!lead.phone : !!lead.whatsappNumber;
                  const whatsappLink = lead.isWhatsappSame 
                    ? `https://wa.me/${(lead.countryCode || '').replace('+','')}${lead.phone}`
                    : `https://wa.me/${(lead.whatsappCountryCode || '').replace('+','')}${lead.whatsappNumber}`;
                  
                  return (
                    <div 
                      key={lead.id} 
                      draggable
                      onDragStart={(e) => handleDragStart(e, lead.id)}
                      onDragEnd={handleDragEnd}
                      onClick={() => openEditModal(lead)}
                      style={cardStyle}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                          <h4 style={{ fontSize: '14px', fontWeight: 600, color: '#fff', margin: 0, fontFamily: '"Outfit", sans-serif' }}>{lead.company}</h4>
                          <p style={{ fontSize: '12px', color: '#8b8ba7', marginTop: '3px' }}>{lead.name}</p>
                        </div>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px' }}>
                        <span style={{ fontSize: '13px', fontWeight: 700, color: '#10b981' }}>{lead.value}</span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: '#5a5a78' }}>
                          <Calendar style={{ width: '11px', height: '11px' }} /> {lead.date}
                        </span>
                      </div>
                      <div style={{ height: '1px', background: 'rgba(255,255,255,0.05)', margin: '14px 0' }} />
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button 
                            onClick={(e) => { e.stopPropagation(); lead.phone ? window.open(`tel:${lead.countryCode || ''}${lead.phone}`) : alert('No phone number saved') }}
                            style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#8b8ba7', cursor: 'pointer' }}
                          >
                            <Phone style={{ width: '12px', height: '12px' }} />
                          </button>
                          {hasWhatsapp && (
                            <button 
                              onClick={(e) => { e.stopPropagation(); window.open(whatsappLink, '_blank') }}
                              style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#8b8ba7', cursor: 'pointer' }}
                            >
                              <MessageSquare style={{ width: '12px', height: '12px' }} />
                            </button>
                          )}
                          <button 
                            onClick={(e) => { e.stopPropagation(); lead.email ? window.open(`mailto:${lead.email}`) : alert('No email saved') }}
                            style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#8b8ba7', cursor: 'pointer' }}
                          >
                            <Mail style={{ width: '12px', height: '12px' }} />
                          </button>
                        </div>
                        <span style={{ fontSize: '10px', fontWeight: 600, textTransform: 'uppercase', padding: '3px 8px', borderRadius: '6px', background: 'rgba(56,189,248,0.08)', color: '#38bdf8', border: '1px solid rgba(56,189,248,0.1)', letterSpacing: '0.04em' }}>{lead.tag}</span>
                      </div>
                    </div>
                  )
                })}
                
                {colLeads.length === 0 && !isOver && (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '120px', border: '1px dashed rgba(255,255,255,0.05)', borderRadius: '12px', color: '#5a5a78', fontSize: '13px' }}>
                    No leads here
                  </div>
                )}
                
                <button 
                  onClick={() => openAddModal(col.id)}
                  style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px dashed rgba(255,255,255,0.08)', background: 'transparent', color: '#5a5a78', fontSize: '13px', cursor: 'pointer', fontFamily: '"Inter", sans-serif' }}
                >
                  + Add Card
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {/* Add/Edit Lead Modal */}
      {isModalOpen && (
        <div className="modal-overlay" style={{ zIndex: 100 }}>
          <div className="modal-content" style={{ padding: '24px', maxWidth: '600px', width: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 600, color: '#fff', margin: 0, fontFamily: '"Outfit", sans-serif' }}>
                {currentLead.id ? 'Edit Lead Details' : 'Add New Lead'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} style={{ background: 'transparent', border: 'none', color: '#8b8ba7', cursor: 'pointer' }}>
                <X style={{ width: '20px', height: '20px' }} />
              </button>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="responsive-grid-2" style={{ gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', color: '#8b8ba7', marginBottom: '8px' }}>Contact Name</label>
                  <input type="text" className="input-base" value={currentLead.name} onChange={e => setCurrentLead({...currentLead, name: e.target.value})} placeholder="e.g. John Doe" />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', color: '#8b8ba7', marginBottom: '8px' }}>Company</label>
                  <input type="text" className="input-base" value={currentLead.company} onChange={e => setCurrentLead({...currentLead, company: e.target.value})} placeholder="e.g. Acme Corp" />
                </div>
              </div>

              <div className="responsive-grid-2" style={{ gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', color: '#8b8ba7', marginBottom: '8px' }}>Phone Number</label>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <select 
                      className="input-base" 
                      style={{ width: '90px', appearance: 'none', padding: '0 10px' }} 
                      value={currentLead.countryCode || '+91'} 
                      onChange={e => setCurrentLead({...currentLead, countryCode: e.target.value})}
                    >
                      <option value="+91">IN (+91)</option>
                      <option value="+1">US (+1)</option>
                      <option value="+44">UK (+44)</option>
                    </select>
                    <input 
                      type="text" 
                      className="input-base" 
                      style={{ flex: 1 }}
                      value={currentLead.phone} 
                      onChange={e => setCurrentLead({...currentLead, phone: e.target.value})} 
                      placeholder="98765 43210" 
                    />
                  </div>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', color: '#8b8ba7', marginBottom: '8px' }}>Email Address</label>
                  <input type="email" className="input-base" value={currentLead.email} onChange={e => setCurrentLead({...currentLead, email: e.target.value})} placeholder="john@acme.com" />
                </div>
              </div>

              <div style={{ background: 'rgba(255,255,255,0.02)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <p style={{ fontSize: '14px', color: '#fff', fontWeight: 500, margin: 0 }}>Is WhatsApp same as phone?</p>
                  <Toggle checked={currentLead.isWhatsappSame ?? true} onChange={(c) => setCurrentLead({...currentLead, isWhatsappSame: c})} />
                </div>
                {!currentLead.isWhatsappSame && (
                  <div style={{ marginTop: '16px' }}>
                    <label style={{ display: 'block', fontSize: '13px', color: '#8b8ba7', marginBottom: '8px' }}>WhatsApp Number</label>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <select 
                        className="input-base" 
                        style={{ width: '90px', appearance: 'none', padding: '0 10px' }} 
                        value={currentLead.whatsappCountryCode || '+91'} 
                        onChange={e => setCurrentLead({...currentLead, whatsappCountryCode: e.target.value})}
                      >
                        <option value="+91">IN (+91)</option>
                        <option value="+1">US (+1)</option>
                        <option value="+44">UK (+44)</option>
                      </select>
                      <input 
                        type="text" 
                        className="input-base" 
                        style={{ flex: 1 }}
                        value={currentLead.whatsappNumber || ''} 
                        onChange={e => setCurrentLead({...currentLead, whatsappNumber: e.target.value})} 
                        placeholder="98765 43210" 
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="responsive-grid-2" style={{ gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', color: '#8b8ba7', marginBottom: '8px' }}>Estimated Value (₹)</label>
                  <input 
                    type="number" 
                    className="input-base" 
                    value={currentLead.numericValue} 
                    onChange={e => setCurrentLead({...currentLead, numericValue: Number(e.target.value)})} 
                    placeholder="e.g. 50000" 
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', color: '#8b8ba7', marginBottom: '8px' }}>Service Required</label>
                  <select className="input-base" style={{ appearance: 'none' }} value={currentLead.tag} onChange={e => setCurrentLead({...currentLead, tag: e.target.value})}>
                    <option value="Website">Website</option>
                    <option value="Web App">Web App</option>
                    <option value="SEO">SEO</option>
                    <option value="GBP">GBP</option>
                    <option value="E-commerce">E-commerce</option>
                  </select>
                </div>
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '16px', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '20px' }}>
                <button onClick={() => setIsModalOpen(false)} className="btn btn-ghost">Cancel</button>
                <button onClick={handleSaveLead} className="btn btn-primary" disabled={!currentLead.name || !currentLead.company}>
                  {currentLead.id ? 'Save Changes' : 'Create Lead'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
