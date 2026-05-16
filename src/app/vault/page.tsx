"use client";

import { useState, useMemo } from "react";
import { Plus, Search, FileText, Image as ImageIcon, Lock, Folder, Download, MoreVertical, File, ChevronRight, ArrowLeft, X, Eye, Trash2, Shield } from "lucide-react";

interface VaultItem {
  id: string;
  name: string;
  type: 'folder' | 'pdf' | 'image' | 'archive' | 'document';
  size?: string;
  date: string;
  parentId: string | null;
  locked?: boolean;
}

const initialItems: VaultItem[] = [
  // Root Folders
  { id: "f1", name: "Client Contracts", type: "folder", date: "May 12, 2024", parentId: null },
  { id: "f2", name: "Brand Assets", type: "folder", date: "May 10, 2024", parentId: null },
  { id: "f3", name: "Finance & Tax", type: "folder", date: "May 01, 2024", parentId: null },
  { id: "f4", name: "Project Delivery", type: "folder", date: "Apr 28, 2024", parentId: null },
  
  // Client Contracts Folder
  { id: "1", name: "Master Services Agreement.pdf", type: "pdf", size: "2.4 MB", date: "May 12, 2024", parentId: "f1", locked: true },
  { id: "5", name: "Nexus Properties NDA.pdf", type: "pdf", size: "1.1 MB", date: "May 11, 2024", parentId: "f1" },
  
  // Brand Assets Folder
  { id: "2", name: "Nexus_Brand_Assets.zip", type: "archive", size: "15.8 MB", date: "May 10, 2024", parentId: "f2" },
  { id: "4", name: "AgencyOS_Logo.png", type: "image", size: "450 KB", date: "Apr 28, 2024", parentId: "f2" },
  { id: "f2_1", name: "Social Media Kits", type: "folder", date: "May 05, 2024", parentId: "f2" },

  // Social Media Kits (Nested)
  { id: "6", name: "Instagram_Post_Templates.psd", type: "document", size: "45 MB", date: "May 05, 2024", parentId: "f2_1" },

  // Root Files
  { id: "3", name: "Q2_Agency_Roadmap.pdf", type: "pdf", size: "3.2 MB", date: "May 15, 2024", parentId: null, locked: true },
];

const cardBase: React.CSSProperties = { background: 'rgba(20,20,28,0.6)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.2)' };
const tc: React.CSSProperties = { padding: '16px 18px', borderBottom: '1px solid rgba(255,255,255,0.04)', fontSize: '13.5px' };
const th: React.CSSProperties = { ...tc, fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#5a5a78', borderBottom: '1px solid rgba(255,255,255,0.06)', textAlign: 'left' };

function typeIcon(type: string) {
  const s = { width: '16px', height: '16px' };
  if (type === 'pdf') return { icon: <FileText style={s} />, bg: 'rgba(244,63,94,0.1)', color: '#f43f5e' };
  if (type === 'image') return { icon: <ImageIcon style={s} />, bg: 'rgba(56,189,248,0.1)', color: '#38bdf8' };
  if (type === 'archive') return { icon: <Download style={s} />, bg: 'rgba(245,158,11,0.1)', color: '#f59e0b' };
  return { icon: <File style={s} />, bg: 'rgba(16,185,129,0.1)', color: '#10b981' };
}

export default function VaultPage() {
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [items, setItems] = useState<VaultItem[]>(initialItems);
  const [selectedItem, setSelectedItem] = useState<VaultItem | null>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  const filteredItems = useMemo(() => {
    if (searchQuery) {
      return items.filter(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()));
    }
    return items.filter(item => item.parentId === currentFolderId);
  }, [items, currentFolderId, searchQuery]);

  const breadcrumbs = useMemo(() => {
    const path = [];
    let current = items.find(i => i.id === currentFolderId);
    while (current) {
      path.unshift(current);
      const parentId = current.parentId;
      current = parentId ? items.find(i => i.id === parentId) : undefined;
    }
    return path;
  }, [items, currentFolderId]);

  const handleUpload = (e: any) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const newItem: VaultItem = {
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      type: file.type.includes('image') ? 'image' : file.type.includes('pdf') ? 'pdf' : 'document',
      size: (file.size / (1024 * 1024)).toFixed(1) + " MB",
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
      parentId: currentFolderId
    };
    setItems([newItem, ...items]);
    setIsUploadModalOpen(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', height: '100%' }}>
      {/* Hidden File Input */}
      <input 
        type="file" 
        id="fileInput" 
        style={{ display: 'none' }} 
        onChange={handleUpload}
      />
      <div className="page-header">
        <div>
          <h1 style={{ fontSize: '28px', fontFamily: '"Outfit", sans-serif', fontWeight: 700, color: '#fff', letterSpacing: '-0.02em', margin: 0 }}>Document Vault</h1>
          <p style={{ fontSize: '14px', color: '#8b8ba7', marginTop: '6px' }}>Securely store contracts, credentials, and assets.</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button 
            onClick={() => setIsUploadModalOpen(true)}
            style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 18px', borderRadius: '12px', fontSize: '13px', fontWeight: 600, background: 'linear-gradient(135deg, #6366f1, #7c3aed)', color: '#fff', border: 'none', cursor: 'pointer', boxShadow: '0 4px 15px rgba(99,102,241,0.3)' }}
          >
            <Plus style={{ width: '16px', height: '16px' }} /> Upload File
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '20px' }}>
        {/* Breadcrumbs */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#8b8ba7' }}>
          <button 
            onClick={() => { setCurrentFolderId(null); setSearchQuery(""); }}
            style={{ background: 'none', border: 'none', color: currentFolderId === null ? '#fff' : '#8b8ba7', fontWeight: currentFolderId === null ? 700 : 500, cursor: 'pointer', padding: 0 }}
          >Vault</button>
          {breadcrumbs.map((crumb, i) => (
            <div key={crumb.id} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ChevronRight style={{ width: '14px', height: '14px' }} />
              <button 
                onClick={() => { setCurrentFolderId(crumb.id); setSearchQuery(""); }}
                style={{ background: 'none', border: 'none', color: i === breadcrumbs.length - 1 ? '#fff' : '#8b8ba7', fontWeight: i === breadcrumbs.length - 1 ? 700 : 500, cursor: 'pointer', padding: 0 }}
              >{crumb.name}</button>
            </div>
          ))}
          {searchQuery && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ChevronRight style={{ width: '14px', height: '14px' }} />
              <span style={{ color: '#818cf8', fontWeight: 600 }}>Search: "{searchQuery}"</span>
            </div>
          )}
        </div>

        {/* Search Input */}
        <div style={{ position: 'relative', width: '320px' }}>
          <Search style={{ width: '15px', height: '15px', position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#5a5a78' }} />
          <input 
            type="text" 
            placeholder="Search vault..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ width: '100%', height: '40px', paddingLeft: '38px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', color: '#f0f0ff', fontSize: '13px', outline: 'none', transition: 'all 0.2s' }} 
          />
          {searchQuery && <button onClick={() => setSearchQuery("")} style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#5a5a78', cursor: 'pointer' }}><X style={{ width: '14px', height: '14px' }} /></button>}
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
        {/* Folders Section */}
        {filteredItems.some(i => i.type === 'folder') && (
          <div>
            <h2 style={{ fontSize: '14px', fontWeight: 600, color: '#8b8ba7', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Folder style={{ width: '16px', height: '16px' }} /> Folders
            </h2>
            <div className="responsive-grid-4">
              {filteredItems.filter(i => i.type === 'folder').map(folder => (
                <div 
                  key={folder.id} 
                  onClick={() => { setCurrentFolderId(folder.id); setSearchQuery(""); }}
                  style={{ ...cardBase, padding: '20px 24px', display: 'flex', alignItems: 'center', gap: '16px', cursor: 'pointer', transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)' }}
                  className="folder-card"
                >
                  <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(99, 102, 241, 0.1)', color: '#818cf8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Folder style={{ width: '22px', height: '22px' }} />
                  </div>
                  <div>
                    <span style={{ fontSize: '13px', fontWeight: 600, color: '#fff', display: 'block' }}>{folder.name}</span>
                    <span style={{ fontSize: '11px', color: '#5a5a78' }}>{items.filter(i => i.parentId === folder.id).length} items</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Files Section */}
        <div style={{ ...cardBase, overflowX: "auto" }}>
          <div style={{ padding: '20px 24px', borderBottom: '1px solid rgba(255,255,255,0.04)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ fontSize: '14px', fontWeight: 600, color: '#fff', margin: 0 }}>Files</h2>
            <span style={{ fontSize: '12px', color: '#5a5a78' }}>{filteredItems.filter(i => i.type !== 'folder').length} Total</span>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={th}>File Name</th>
                <th style={th}>Size</th>
                <th style={th}>Last Modified</th>
                <th style={{ ...th, textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.filter(i => i.type !== 'folder').map(file => {
                const ti = typeIcon(file.type);
                return (
                  <tr key={file.id} className="table-row-hover" onClick={() => setSelectedItem(file)} style={{ cursor: 'pointer' }}>
                    <td style={tc}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ padding: '8px', borderRadius: '10px', background: ti.bg, color: ti.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{ti.icon}</div>
                        <span style={{ fontWeight: 600, color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
                          {file.name}
                          {file.locked && <Lock style={{ width: '12px', height: '12px', color: '#f59e0b' }} />}
                        </span>
                      </div>
                    </td>
                    <td style={{ ...tc, color: '#8b8ba7' }}>{file.size}</td>
                    <td style={{ ...tc, color: '#8b8ba7' }}>{file.date}</td>
                    <td style={{ ...tc, textAlign: 'right' }}>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }} onClick={(e) => e.stopPropagation()}>
                        <button className="icon-btn"><Download style={{ width: '15px', height: '15px' }} /></button>
                        <button className="icon-btn"><MoreVertical style={{ width: '15px', height: '15px' }} /></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filteredItems.filter(i => i.type !== 'folder').length === 0 && (
                <tr>
                  <td colSpan={4} style={{ padding: '60px', textAlign: 'center', color: '#5a5a78' }}>
                    <div style={{ marginBottom: '12px' }}><File style={{ width: '32px', height: '32px', opacity: 0.2 }} /></div>
                    <p style={{ fontSize: '14px' }}>No files found in this directory</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* File Preview Modal */}
      {selectedItem && (
        <div className="modal-overlay" onClick={() => setSelectedItem(null)}>
          <div className="modal-content glass-card" style={{ maxWidth: '600px', padding: 0, overflow: 'hidden' }} onClick={e => e.stopPropagation()}>
            <div style={{ padding: '24px', background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ padding: '10px', borderRadius: '12px', background: 'rgba(99,102,241,0.1)', color: '#818cf8' }}>
                  <FileText style={{ width: '20px', height: '20px' }} />
                </div>
                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#fff', margin: 0 }}>{selectedItem.name}</h3>
                  <p style={{ fontSize: '12px', color: '#8b8ba7', margin: '4px 0 0 0' }}>{selectedItem.size} • Modified {selectedItem.date}</p>
                </div>
              </div>
              <button onClick={() => setSelectedItem(null)} className="icon-btn"><X style={{ width: '20px', height: '20px' }} /></button>
            </div>
            
            <div style={{ padding: '32px', textAlign: 'center', background: 'rgba(0,0,0,0.2)' }}>
              {selectedItem.type === 'image' ? (
                <div style={{ width: '100%', height: '250px', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <ImageIcon style={{ width: '48px', height: '48px', color: '#5a5a78', opacity: 0.3 }} />
                </div>
              ) : (
                <div style={{ padding: '48px', border: '2px dashed rgba(255,255,255,0.05)', borderRadius: '16px' }}>
                  <FileText style={{ width: '64px', height: '64px', color: '#5a5a78', opacity: 0.2, marginBottom: '20px' }} />
                  <p style={{ color: '#8b8ba7', fontSize: '14px' }}>Document Preview is only available for premium subscribers</p>
                </div>
              )}
            </div>

            <div style={{ padding: '24px', display: 'flex', gap: '12px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
              <button className="btn btn-primary" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                <Download style={{ width: '16px', height: '16px' }} /> Download
              </button>
              <button className="btn btn-ghost" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                <Shield style={{ width: '16px', height: '16px' }} /> Secure View
              </button>
              <button className="icon-btn" style={{ padding: '12px', color: '#f43f5e' }}><Trash2 style={{ width: '18px', height: '18px' }} /></button>
            </div>
          </div>
        </div>
      )}

      {/* Upload Modal */}
      {isUploadModalOpen && (
        <div className="modal-overlay" onClick={() => setIsUploadModalOpen(false)}>
          <div className="modal-content glass-card" style={{ maxWidth: '450px' }} onClick={e => e.stopPropagation()}>
            <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#fff', marginBottom: '8px' }}>Upload Document</h2>
            <p style={{ fontSize: '13px', color: '#8b8ba7', marginBottom: '24px' }}>File will be saved to: <span style={{ color: '#818cf8', fontWeight: 600 }}>{breadcrumbs.length > 0 ? breadcrumbs[breadcrumbs.length-1].name : 'Vault Root'}</span></p>
            
            <div style={{ border: '2px dashed rgba(255,255,255,0.1)', borderRadius: '16px', padding: '40px', textAlign: 'center', marginBottom: '24px' }}>
              <Download style={{ width: '40px', height: '40px', color: '#6366f1', opacity: 0.5, marginBottom: '16px' }} />
              <p style={{ fontSize: '14px', color: '#fff', fontWeight: 600, marginBottom: '4px' }}>Drag & drop files here</p>
              <p style={{ fontSize: '12px', color: '#5a5a78' }}>Support PDF, PNG, JPG, ZIP (Max 50MB)</p>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button onClick={() => setIsUploadModalOpen(false)} className="btn btn-ghost" style={{ flex: 1 }}>Cancel</button>
              <button 
                onClick={() => document.getElementById('fileInput')?.click()} 
                className="btn btn-primary" 
                style={{ flex: 1 }}
              >Select & Upload</button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .folder-card:hover {
          background: rgba(255, 255, 255, 0.05) !important;
          transform: translateY(-2px);
          border-color: rgba(99, 102, 241, 0.3) !important;
        }
        .table-row-hover:hover {
          background: rgba(255, 255, 255, 0.02);
        }
        .icon-btn {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          background: transparent;
          border: none;
          color: #5a5a78;
          cursor: pointer;
          display: flex;
          alignItems: center;
          justifyContent: center;
          transition: all 0.2s;
        }
        .icon-btn:hover {
          background: rgba(255,255,255,0.05);
          color: #fff;
        }
      `}</style>
    </div>
  );
}
