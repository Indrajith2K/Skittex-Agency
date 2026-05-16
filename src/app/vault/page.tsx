"use client";

import { Plus, Search, FileText, Image as ImageIcon, Lock, Folder, Download, MoreVertical, File } from "lucide-react";

const mockFiles = [
  { id: "1", name: "Master Services Agreement.pdf", type: "pdf", size: "2.4 MB", date: "May 12, 2024", locked: true },
  { id: "2", name: "Nexus_Brand_Assets.zip", type: "archive", size: "15.8 MB", date: "May 10, 2024", locked: false },
  { id: "3", name: "Q2_Financial_Report.xlsx", type: "document", size: "1.2 MB", date: "May 01, 2024", locked: true },
  { id: "4", name: "AgencyOS_Logo.png", type: "image", size: "450 KB", date: "Apr 28, 2024", locked: false },
];

const folders = ['Client Contracts', 'Invoices', 'Tax Documents', 'Brand Assets', 'Passwords', 'Personal'];

const cardBase: React.CSSProperties = { background: 'rgba(20,20,28,0.6)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.2)' };
const tc: React.CSSProperties = { padding: '16px 18px', borderBottom: '1px solid rgba(255,255,255,0.04)', fontSize: '13.5px' };
const th: React.CSSProperties = { ...tc, fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#5a5a78', borderBottom: '1px solid rgba(255,255,255,0.06)', textAlign: 'left' };

function typeIcon(type: string) {
  const s = { width: '16px', height: '16px' };
  if (type === 'pdf') return { icon: <FileText style={s} />, bg: 'rgba(244,63,94,0.1)', color: '#f43f5e' };
  if (type === 'image') return { icon: <ImageIcon style={s} />, bg: 'rgba(56,189,248,0.1)', color: '#38bdf8' };
  return { icon: <File style={s} />, bg: 'rgba(16,185,129,0.1)', color: '#10b981' };
}

export default function VaultPage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      <div className="page-header">
        <div>
          <h1 style={{ fontSize: '28px', fontFamily: '"Outfit", sans-serif', fontWeight: 700, color: '#fff', letterSpacing: '-0.02em', margin: 0 }}>Document Vault</h1>
          <p style={{ fontSize: '14px', color: '#8b8ba7', marginTop: '6px' }}>Securely store contracts, credentials, and assets.</p>
        </div>
        <button style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '9px 16px', borderRadius: '10px', fontSize: '13px', fontWeight: 600, background: 'linear-gradient(135deg, #6366f1, #7c3aed)', color: '#fff', border: 'none', cursor: 'pointer', boxShadow: '0 4px 15px rgba(99,102,241,0.3)' }}>
          <Plus style={{ width: '16px', height: '16px' }} /> Upload File
        </button>
      </div>

      {/* Search */}
      <div style={{ position: 'relative', maxWidth: '400px' }}>
        <Search style={{ width: '15px', height: '15px', position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#5a5a78' }} />
        <input type="text" placeholder="Search files and folders..." style={{ width: '100%', height: '38px', paddingLeft: '36px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '10px', color: '#f0f0ff', fontSize: '13px', fontFamily: '"Inter", sans-serif', outline: 'none' }} />
      </div>

      {/* Folders */}
      <div className="responsive-grid-6">
        {folders.map(f => (
          <div key={f} style={{ ...cardBase, padding: '20px 16px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', textAlign: 'center', transition: 'all 0.2s ease' }}>
            <Folder style={{ width: '36px', height: '36px', color: '#818cf8', marginBottom: '12px' }} />
            <span style={{ fontSize: '12px', fontWeight: 600, color: '#fff' }}>{f}</span>
          </div>
        ))}
      </div>

      {/* Files Table */}
      <div style={{ ...cardBase, overflowX: "auto" }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
          <h2 style={{ fontSize: '14px', fontWeight: 600, color: '#fff', margin: 0 }}>Recent Files</h2>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={th}>Name</th>
              <th style={th}>Size</th>
              <th style={th}>Date Modified</th>
              <th style={{ ...th, textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {mockFiles.map(file => {
              const ti = typeIcon(file.type);
              return (
                <tr key={file.id} style={{ cursor: 'pointer' }}>
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
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '4px' }}>
                      <button style={{ width: '30px', height: '30px', borderRadius: '8px', background: 'transparent', border: 'none', color: '#5a5a78', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Download style={{ width: '15px', height: '15px' }} /></button>
                      <button style={{ width: '30px', height: '30px', borderRadius: '8px', background: 'transparent', border: 'none', color: '#5a5a78', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><MoreVertical style={{ width: '15px', height: '15px' }} /></button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
