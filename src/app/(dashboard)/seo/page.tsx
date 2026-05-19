"use client";

import { useState } from "react";
import { Search, Filter, TrendingUp, TrendingDown, ExternalLink, Plus, X } from "lucide-react";

interface SEOType {
  id: string;
  client: string;
  url: string;
  avgRank: number;
  change: string;
  indexed: number;
  keywords: number;
  gbp: string;
  lastAudit: string;
  auditNotes: string;
}

const mockSEO: SEOType[] = [
  { id: "1", client: "Nexus Properties", url: "nexusproperties.com", avgRank: 4.2, change: "+1.5", indexed: 145, keywords: 45, gbp: "Optimized", lastAudit: "2024-05-14", auditNotes: "All meta tags are looking good. Next month focus on backlinks." },
  { id: "2", client: "Bloom Florals", url: "bloomflorals.shop", avgRank: 12.5, change: "-0.5", indexed: 89, keywords: 22, gbp: "Action Needed", lastAudit: "2024-05-09", auditNotes: "Core web vitals need improvement. Homepage loading slowly." },
  { id: "3", client: "Doe Consulting", url: "doeconsulting.net", avgRank: 8.0, change: "+2.1", indexed: 42, keywords: 15, gbp: "Optimized", lastAudit: "2024-05-13", auditNotes: "Added schema markup. Rankings are improving steadily." },
];

function formatDate(dateStr: string) {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

const cardBase: React.CSSProperties = { background: 'rgba(20,20,28,0.6)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.2)' };
const tc: React.CSSProperties = { padding: '16px 18px', borderBottom: '1px solid rgba(255,255,255,0.04)', fontSize: '13.5px' };
const th: React.CSSProperties = { ...tc, fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#5a5a78', borderBottom: '1px solid rgba(255,255,255,0.06)', textAlign: 'left' };

export default function SEOPage() {
  const [seoItems, setSeoItems] = useState<SEOType[]>(mockSEO);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentSeo, setCurrentSeo] = useState<Partial<SEOType>>({
    client: '', url: '', avgRank: 0, change: '0.0', indexed: 0, keywords: 0, gbp: 'Optimized', lastAudit: new Date().toISOString().split('T')[0], auditNotes: ''
  });

  const filteredSEO = seoItems.filter(item => {
    const matchesSearch = item.client.toLowerCase().includes(searchQuery.toLowerCase()) || item.url.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = statusFilter === 'all' || item.gbp === statusFilter;
    return matchesSearch && matchesFilter;
  });

  // Calculate dynamic stats
  const totalKeywords = seoItems.reduce((acc, curr) => acc + curr.keywords, 0);
  const avgPosition = seoItems.length > 0 ? (seoItems.reduce((acc, curr) => acc + curr.avgRank, 0) / seoItems.length).toFixed(1) : "0.0";
  const actionNeededCount = seoItems.filter(item => item.gbp === 'Action Needed').length;

  const openAddModal = () => {
    setCurrentSeo({ client: '', url: '', avgRank: 0, change: '+0.0', indexed: 0, keywords: 0, gbp: 'Optimized', lastAudit: new Date().toISOString().split('T')[0], auditNotes: '' });
    setIsModalOpen(true);
  };

  const openEditModal = (seo: SEOType) => {
    setCurrentSeo(seo);
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (!currentSeo.client || !currentSeo.url) return;

    if (currentSeo.id) {
      setSeoItems(seoItems.map(item => item.id === currentSeo.id ? { ...item, ...currentSeo } as SEOType : item));
    } else {
      setSeoItems([{
        id: Date.now().toString(),
        ...currentSeo,
      } as SEOType, ...seoItems]);
    }
    setIsModalOpen(false);
  };

  const handleDelete = () => {
    if (currentSeo.id) {
      setSeoItems(seoItems.filter(item => item.id !== currentSeo.id));
      setIsModalOpen(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', height: '100%' }}>
      <div className="page-header">
        <div>
          <h1 style={{ fontSize: '28px', fontFamily: '"Outfit", sans-serif', fontWeight: 700, color: '#fff', letterSpacing: '-0.02em', margin: 0 }}>SEO Operations</h1>
          <p style={{ fontSize: '14px', color: '#8b8ba7', marginTop: '6px' }}>Track client rankings, audits, and GBP optimizations.</p>
        </div>
        <button onClick={openAddModal} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '9px 16px', borderRadius: '10px', fontSize: '13px', fontWeight: 600, background: 'linear-gradient(135deg, #6366f1, #7c3aed)', color: '#fff', border: 'none', cursor: 'pointer', boxShadow: '0 4px 15px rgba(99,102,241,0.3)' }}>
          <Plus style={{ width: '16px', height: '16px' }} /> Add SEO Client
        </button>
      </div>

      {/* Stats */}
      <div className="responsive-grid-4">
        {[
          { label: 'Total Keywords Tracked', value: totalKeywords.toString(), color: '#fff' },
          { label: 'Overall Avg Position', value: avgPosition, color: '#10b981' },
          { label: 'SEO Profiles Managed', value: seoItems.length.toString(), color: '#fff' },
          { label: 'Action Required', value: `${actionNeededCount} Audits`, color: '#f43f5e' },
        ].map((s, i) => (
          <div key={i} style={{ ...cardBase, padding: '20px' }}>
            <p style={{ fontSize: '12px', color: '#8b8ba7', margin: '0 0 8px 0' }}>{s.label}</p>
            <p style={{ fontSize: '22px', fontWeight: 700, color: s.color, margin: 0, letterSpacing: '-0.02em' }}>
              {s.value}
            </p>
          </div>
        ))}
      </div>

      {/* Search & Filters */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: '260px', maxWidth: '400px' }}>
          <Search style={{ width: '15px', height: '15px', position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#5a5a78' }} />
          <input 
            type="text" 
            placeholder="Search clients or domains..." 
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
            <option value="all">All Statuses</option>
            <option value="Optimized">Optimized</option>
            <option value="Action Needed">Action Needed</option>
          </select>
          <Filter style={{ width: '14px', height: '14px', position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: '#5a5a78', pointerEvents: 'none' }} />
        </div>
      </div>

      {/* Table */}
      <div style={{ ...cardBase, overflowX: "auto" }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '800px' }}>
          <thead>
            <tr>
              <th style={th}>Client / Domain</th>
              <th style={th}>Avg Rank</th>
              <th style={th}>Keywords</th>
              <th style={th}>Indexed Pages</th>
              <th style={th}>SEO Status</th>
              <th style={th}>Last Audit</th>
            </tr>
          </thead>
          <tbody>
            {filteredSEO.map((seo) => (
              <tr 
                key={seo.id} 
                onClick={() => openEditModal(seo)}
                style={{ cursor: 'pointer', transition: 'background 0.2s' }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
              >
                <td style={tc}>
                  <p style={{ fontWeight: 600, color: '#fff', margin: 0 }}>{seo.client}</p>
                  <a href={`https://${seo.url}`} target="_blank" onClick={(e) => e.stopPropagation()} style={{ fontSize: '11px', color: '#38bdf8', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '3px', textDecoration: 'none' }}>
                    {seo.url} <ExternalLink style={{ width: '10px', height: '10px' }} />
                  </a>
                </td>
                <td style={tc}>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontWeight: 600, color: '#fff' }}>{seo.avgRank}</span>
                    <span style={{ fontSize: '11px', display: 'flex', alignItems: 'center', color: seo.change.startsWith('+') ? '#10b981' : seo.change.startsWith('-') ? '#f43f5e' : '#8b8ba7', marginTop: '2px' }}>
                      {seo.change.startsWith('+') && <TrendingUp style={{ width: '12px', height: '12px', marginRight: '3px' }} />}
                      {seo.change.startsWith('-') && <TrendingDown style={{ width: '12px', height: '12px', marginRight: '3px' }} />}
                      {seo.change}
                    </span>
                  </div>
                </td>
                <td style={{ ...tc, fontWeight: 500, color: '#fff' }}>{seo.keywords}</td>
                <td style={{ ...tc, fontWeight: 500, color: '#8b8ba7' }}>{seo.indexed}</td>
                <td style={tc}>
                  <span style={{ fontSize: '10px', fontWeight: 600, textTransform: 'uppercase', padding: '3px 10px', borderRadius: '99px', letterSpacing: '0.04em', ...(seo.gbp === 'Optimized' ? { background: 'rgba(16,185,129,0.12)', color: '#10b981', border: '1px solid rgba(16,185,129,0.2)' } : { background: 'rgba(245,158,11,0.12)', color: '#f59e0b', border: '1px solid rgba(245,158,11,0.2)' }) }}>{seo.gbp}</span>
                </td>
                <td style={{ ...tc, color: '#8b8ba7', fontSize: '13px' }}>{formatDate(seo.lastAudit)}</td>
              </tr>
            ))}
            {filteredSEO.length === 0 && (
              <tr>
                <td colSpan={6} style={{ padding: '40px', textAlign: 'center', color: '#5a5a78', fontSize: '14px' }}>
                  No SEO records found.
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
              <h2 style={{ fontSize: '20px', fontWeight: 600, color: '#fff', margin: 0 }}>
                {currentSeo.id ? 'Edit SEO Record' : 'Add New SEO Client'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} style={{ background: 'transparent', border: 'none', color: '#8b8ba7', cursor: 'pointer' }}>
                <X style={{ width: '20px', height: '20px' }} />
              </button>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="responsive-grid-2" style={{ gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', color: '#8b8ba7', marginBottom: '8px' }}>Website/Client Name</label>
                  <input type="text" className="input-base" value={currentSeo.client} onChange={e => setCurrentSeo({...currentSeo, client: e.target.value})} placeholder="e.g. Nexus Properties" />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', color: '#8b8ba7', marginBottom: '8px' }}>Domain URL</label>
                  <input type="text" className="input-base" value={currentSeo.url} onChange={e => setCurrentSeo({...currentSeo, url: e.target.value})} placeholder="e.g. nexusproperties.com" />
                </div>
              </div>

              <div className="responsive-grid-3" style={{ gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', color: '#8b8ba7', marginBottom: '8px' }}>Google Rank (Avg)</label>
                  <input type="number" step="0.1" className="input-base" value={currentSeo.avgRank || ''} onChange={e => setCurrentSeo({...currentSeo, avgRank: Number(e.target.value)})} placeholder="e.g. 4.2" />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', color: '#8b8ba7', marginBottom: '8px' }}>Rank Change (e.g. +1.5)</label>
                  <input type="text" className="input-base" value={currentSeo.change} onChange={e => setCurrentSeo({...currentSeo, change: e.target.value})} placeholder="e.g. +1.5" />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', color: '#8b8ba7', marginBottom: '8px' }}>Total Keywords Tracked</label>
                  <input type="number" className="input-base" value={currentSeo.keywords || ''} onChange={e => setCurrentSeo({...currentSeo, keywords: Number(e.target.value)})} placeholder="e.g. 45" />
                </div>
              </div>

              <div className="responsive-grid-3" style={{ gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', color: '#8b8ba7', marginBottom: '8px' }}>Indexed Pages</label>
                  <input type="number" className="input-base" value={currentSeo.indexed || ''} onChange={e => setCurrentSeo({...currentSeo, indexed: Number(e.target.value)})} placeholder="e.g. 145" />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', color: '#8b8ba7', marginBottom: '8px' }}>SEO Status</label>
                  <select className="input-base" style={{ appearance: 'none' }} value={currentSeo.gbp} onChange={e => setCurrentSeo({...currentSeo, gbp: e.target.value})}>
                    <option value="Optimized">Optimized</option>
                    <option value="Action Needed">Action Needed</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', color: '#8b8ba7', marginBottom: '8px' }}>Last Audit Date</label>
                  <input 
                    type="date" 
                    className="input-base" 
                    value={currentSeo.lastAudit} 
                    onChange={e => setCurrentSeo({...currentSeo, lastAudit: e.target.value})} 
                    style={{ colorScheme: 'dark' }} 
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', color: '#8b8ba7', marginBottom: '8px' }}>Audit Notes</label>
                <textarea 
                  className="input-base" 
                  value={currentSeo.auditNotes} 
                  onChange={e => setCurrentSeo({...currentSeo, auditNotes: e.target.value})} 
                  placeholder="Enter detailed SEO audit notes, technical fixes, or backlink strategies..."
                  style={{ minHeight: '100px', resize: 'vertical' }}
                />
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '16px', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '20px' }}>
                <div>
                   {currentSeo.id && (
                     <button onClick={handleDelete} style={{ padding: '9px 18px', borderRadius: '10px', fontSize: '13px', fontWeight: 500, background: 'rgba(244,63,94,0.1)', color: '#f43f5e', border: '1px solid rgba(244,63,94,0.2)', cursor: 'pointer' }}>Delete Record</button>
                   )}
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button onClick={() => setIsModalOpen(false)} className="btn btn-ghost">Cancel</button>
                  <button onClick={handleSave} className="btn btn-primary" disabled={!currentSeo.client || !currentSeo.url} style={{ opacity: (!currentSeo.client || !currentSeo.url) ? 0.5 : 1 }}>
                    {currentSeo.id ? 'Save Changes' : 'Add SEO Record'}
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
