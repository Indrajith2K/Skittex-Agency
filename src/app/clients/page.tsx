"use client";

import { useState } from "react";
import { Plus, Search, Filter, ExternalLink, MoreVertical, X } from "lucide-react";

interface ClientType {
  id: string;
  name: string;
  business: string;
  status: string;
  revenue: number;
  joined: string;
  services: string[];
}
import { useStore } from "@/lib/store";
import { Client } from "@/types";

const fmt = (n: number) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", minimumFractionDigits: 0 }).format(n);

function formatDate(dateStr: string) {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr;
  return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}

const tableCell: React.CSSProperties = { padding: '16px 18px', borderBottom: '1px solid rgba(255,255,255,0.04)', fontSize: '13.5px' };
const tableHead: React.CSSProperties = { ...tableCell, fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#5a5a78', borderBottom: '1px solid rgba(255,255,255,0.06)' };

export default function ClientsPage() {
  const clients = useStore(state => state.clients);
  const addClient = useStore(state => state.addClient);
  const updateClient = useStore(state => state.updateClient);
  const deleteClient = useStore(state => state.deleteClient);

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentClient, setCurrentClient] = useState<Partial<Client> & { servicesInput?: string }>({
    name: '', businessName: '', status: 'active', totalRevenue: 0, joinedAt: new Date().toISOString().split('T')[0], servicesInput: ''
  });

  const filteredClients = clients.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) || c.businessName?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = statusFilter === 'all' || c.status === statusFilter;
    return matchesSearch && matchesFilter;
  });

  const openAddModal = () => {
    setCurrentClient({ name: '', businessName: '', status: 'active', totalRevenue: 0, joinedAt: new Date().toISOString().split('T')[0], servicesInput: '' });
    setIsModalOpen(true);
  };

  const openEditModal = (client: any) => {
    setCurrentClient({ ...client, servicesInput: client.services?.join(', ') || '' });
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (!currentClient.name || !currentClient.businessName) return;

    const servicesArray = currentClient.servicesInput 
      ? currentClient.servicesInput.split(',').map(s => s.trim()).filter(s => s) 
      : [];

    const clientToSave: any = {
      id: currentClient.id || Date.now().toString(),
      name: currentClient.name,
      businessName: currentClient.businessName,
      status: currentClient.status || 'active',
      totalRevenue: currentClient.totalRevenue || 0,
      joinedAt: currentClient.joinedAt || new Date().toISOString().split('T')[0],
      services: servicesArray,
      email: currentClient.email || '',
      phone: currentClient.phone || '',
      tags: currentClient.tags || [],
      activityLog: currentClient.activityLog || [],
      createdAt: currentClient.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (currentClient.id) {
      updateClient(currentClient.id, clientToSave);
    } else {
      addClient(clientToSave as any);
    }
    setIsModalOpen(false);
  };

  const handleDelete = () => {
    if (currentClient.id) {
      deleteClient(currentClient.id);
      setIsModalOpen(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', height: '100%' }}>
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 style={{ fontSize: '28px', fontFamily: '"Outfit", sans-serif', fontWeight: 700, color: '#fff', letterSpacing: '-0.02em', margin: 0 }}>Clients</h1>
          <p style={{ fontSize: '14px', color: '#8b8ba7', marginTop: '6px' }}>Manage your active clients, history, and credentials.</p>
        </div>
        <button onClick={openAddModal} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '9px 16px', borderRadius: '10px', fontSize: '13px', fontWeight: 600, background: 'linear-gradient(135deg, #6366f1, #7c3aed)', color: '#fff', border: 'none', cursor: 'pointer', boxShadow: '0 4px 15px rgba(99,102,241,0.3)' }}>
          <Plus style={{ width: '16px', height: '16px' }} /> Add Client
        </button>
      </div>

      {/* Search and Filter */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: '260px', maxWidth: '400px' }}>
          <Search style={{ width: '15px', height: '15px', position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#5a5a78' }} />
          <input 
            type="text" 
            placeholder="Search clients by name or business..." 
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
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          <Filter style={{ width: '14px', height: '14px', position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: '#5a5a78', pointerEvents: 'none' }} />
        </div>
      </div>

      {/* Table */}
      <div style={{ background: 'rgba(20,20,28,0.6)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '16px', overflowX: "auto", boxShadow: '0 4px 20px rgba(0,0,0,0.2)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '800px' }}>
          <thead>
            <tr>
              <th style={{ ...tableHead, textAlign: 'left' }}>Client / Business</th>
              <th style={{ ...tableHead, textAlign: 'left' }}>Status</th>
              <th style={{ ...tableHead, textAlign: 'left' }}>Services</th>
              <th style={{ ...tableHead, textAlign: 'left' }}>Total Revenue</th>
              <th style={{ ...tableHead, textAlign: 'left' }}>Joined</th>
              <th style={{ ...tableHead, textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredClients.map((c) => (
              <tr 
                key={c.id} 
                onClick={() => openEditModal(c)}
                style={{ cursor: 'pointer', transition: 'background 0.2s' }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
              >
                <td style={tableCell}>
                  <p style={{ fontWeight: 600, color: '#fff', margin: 0, fontFamily: '"Outfit", sans-serif', fontSize: '15px' }}>{c.businessName}</p>
                  <p style={{ fontSize: '12px', color: '#5a5a78', marginTop: '3px' }}>{c.name}</p>
                </td>
                <td style={tableCell}>
                  <span style={{ fontSize: '10px', fontWeight: 600, textTransform: 'uppercase', padding: '3px 10px', borderRadius: '99px', background: c.status === 'active' ? 'rgba(16,185,129,0.12)' : 'rgba(255,255,255,0.05)', color: c.status === 'active' ? '#10b981' : '#5a5a78', border: `1px solid ${c.status === 'active' ? 'rgba(16,185,129,0.2)' : 'rgba(255,255,255,0.06)'}`, letterSpacing: '0.04em' }}>{c.status}</span>
                </td>
                <td style={tableCell}>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                    {c.services?.map((s: string) => (
                      <span key={s} style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '6px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)', color: '#8b8ba7' }}>{s}</span>
                    ))}
                  </div>
                </td>
                <td style={{ ...tableCell, fontWeight: 600, color: '#10b981', fontSize: '15px' }}>{fmt(c.totalRevenue)}</td>
                <td style={{ ...tableCell, color: '#8b8ba7' }}>{formatDate(c.joinedAt)}</td>
                <td style={{ ...tableCell, textAlign: 'right' }}>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', color: '#5a5a78' }}>
                    <ExternalLink style={{ width: '16px', height: '16px', cursor: 'pointer' }} />
                    <MoreVertical style={{ width: '16px', height: '16px', cursor: 'pointer' }} />
                  </div>
                </td>
              </tr>
            ))}
            {filteredClients.length === 0 && (
              <tr>
                <td colSpan={6} style={{ padding: '40px', textAlign: 'center', color: '#5a5a78', fontSize: '14px' }}>
                  No clients found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="modal-overlay" style={{ zIndex: 100 }}>
          <div className="modal-content" style={{ padding: '24px', maxWidth: '600px', width: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 600, color: '#fff', margin: 0, fontFamily: '"Outfit", sans-serif' }}>
                {currentClient.id ? 'Edit Client' : 'Add New Client'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} style={{ background: 'transparent', border: 'none', color: '#8b8ba7', cursor: 'pointer' }}>
                <X style={{ width: '20px', height: '20px' }} />
              </button>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="responsive-grid-2" style={{ gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', color: '#8b8ba7', marginBottom: '8px' }}>Contact Name</label>
                  <input type="text" className="input-base" value={currentClient.name} onChange={e => setCurrentClient({...currentClient, name: e.target.value})} placeholder="e.g. David Miller" />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', color: '#8b8ba7', marginBottom: '8px' }}>Business Name</label>
                  <input type="text" className="input-base" value={currentClient.businessName || ''} onChange={e => setCurrentClient({...currentClient, businessName: e.target.value})} placeholder="e.g. Nexus Properties" />
                </div>
              </div>

              <div className="responsive-grid-3" style={{ gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', color: '#8b8ba7', marginBottom: '8px' }}>Status</label>
                  <select className="input-base" style={{ appearance: 'none' }} value={currentClient.status} onChange={e => setCurrentClient({...currentClient, status: e.target.value as any})}>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', color: '#8b8ba7', marginBottom: '8px' }}>Total Revenue (₹)</label>
                  <input type="number" className="input-base" value={currentClient.totalRevenue || ''} onChange={e => setCurrentClient({...currentClient, totalRevenue: Number(e.target.value)})} placeholder="e.g. 250000" />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', color: '#8b8ba7', marginBottom: '8px' }}>Joined Date</label>
                  <input 
                    type="date" 
                    className="input-base" 
                    value={currentClient.joinedAt || ''} 
                    onChange={e => setCurrentClient({...currentClient, joinedAt: e.target.value})} 
                    style={{ colorScheme: 'dark' }} 
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', color: '#8b8ba7', marginBottom: '8px' }}>Services (Comma separated)</label>
                <input 
                  type="text" 
                  className="input-base" 
                  value={currentClient.servicesInput} 
                  onChange={e => setCurrentClient({...currentClient, servicesInput: e.target.value})} 
                  placeholder="e.g. Website, SEO, Hosting" 
                />
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '16px', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '20px' }}>
                <div>
                   {currentClient.id && (
                     <button onClick={handleDelete} style={{ padding: '9px 18px', borderRadius: '10px', fontSize: '13px', fontWeight: 500, background: 'rgba(244,63,94,0.1)', color: '#f43f5e', border: '1px solid rgba(244,63,94,0.2)', cursor: 'pointer' }}>Delete Client</button>
                   )}
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button onClick={() => setIsModalOpen(false)} className="btn btn-ghost">Cancel</button>
                  <button onClick={handleSave} className="btn btn-primary" disabled={!currentClient.name || !currentClient.businessName} style={{ opacity: (!currentClient.name || !currentClient.businessName) ? 0.5 : 1 }}>
                    {currentClient.id ? 'Save Changes' : 'Add Client'}
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
