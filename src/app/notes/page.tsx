"use client";

import { useState } from "react";
import { Plus, Search, Pin, Calendar, MoreVertical, X, Clock } from "lucide-react";

interface NoteType {
  id: string;
  title: string;
  content: string;
  category: string;
  date: string; // Legacy simple date for card view
  createdAt?: string;
  editedAt?: string;
  isPinned: boolean;
}

const mockNotes: NoteType[] = [
  { id: "1", title: "New Service Pricing Strategy Q3", content: "Consider increasing retainers for SEO packages by 15%. Include more local citations in base package. Need to run this by the accounting team before next Thursday.", category: "pricing", date: "Today", createdAt: "May 16, 2026, 09:00 AM", editedAt: "May 16, 2026, 10:15 AM", isPinned: true },
  { id: "2", title: "Client Portal Features", content: "List of features for the upcoming client dashboard: invoice history, project tracking, file downloads, direct messaging, and approval workflows.", category: "feature", date: "Yesterday", createdAt: "May 15, 2026, 02:30 PM", editedAt: "May 15, 2026, 04:45 PM", isPinned: true },
  { id: "3", title: "Content Ideas for LinkedIn", content: "1. The importance of fast loading speeds.\n2. Why custom websites beat templates.\n3. SEO myths debunked.\n4. Case study on our recent e-commerce client.", category: "content", date: "May 10", createdAt: "May 10, 2026, 11:20 AM", editedAt: "May 10, 2026, 11:20 AM", isPinned: false },
  { id: "4", title: "Notes: Call with Nexus Properties", content: "Client wants to add a blog section. Agreed on ₹15k additional budget. Deadline extended by 2 weeks. Need to sync with the content team for initial 5 posts.", category: "client", date: "May 08", createdAt: "May 08, 2026, 03:00 PM", editedAt: "May 08, 2026, 03:45 PM", isPinned: false },
  { id: "5", title: "Business Growth Roadmap 2025", content: "Focus on automated lead generation. Hire a VA for data entry. Move to a larger office space by Q4. Explore AI tools for internal processes.", category: "roadmap", date: "May 01", createdAt: "May 01, 2026, 10:00 AM", editedAt: "May 02, 2026, 09:15 AM", isPinned: false },
  { id: "6", title: "Pricing Calculator Ideas", content: "Build a calculator widget for the website that estimates project costs based on features selected. (Pages, integrations, timeline).", category: "idea", date: "Apr 25", createdAt: "Apr 25, 2026, 01:10 PM", editedAt: "Apr 25, 2026, 01:10 PM", isPinned: false },
];

function catColor(c: string) {
  if (c === 'pricing') return { color: '#10b981', border: 'rgba(16,185,129,0.2)' };
  if (c === 'feature') return { color: '#38bdf8', border: 'rgba(56,189,248,0.2)' };
  if (c === 'roadmap') return { color: '#8b5cf6', border: 'rgba(139,92,246,0.2)' };
  if (c === 'content') return { color: '#f59e0b', border: 'rgba(245,158,11,0.2)' };
  if (c === 'client') return { color: '#ec4899', border: 'rgba(236,72,153,0.2)' };
  return { color: '#8b8ba7', border: 'rgba(255,255,255,0.06)' };
}

export default function NotesPage() {
  const [search, setSearch] = useState("");
  const [notes, setNotes] = useState<NoteType[]>(mockNotes);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentNote, setCurrentNote] = useState<Partial<NoteType>>({ title: '', content: '', category: 'idea', isPinned: false });

  const filteredNotes = notes.filter(n => 
    n.title.toLowerCase().includes(search.toLowerCase()) || 
    n.content.toLowerCase().includes(search.toLowerCase())
  );

  const openAddModal = () => {
    setCurrentNote({ title: '', content: '', category: 'idea', isPinned: false });
    setIsModalOpen(true);
  };

  const openEditModal = (note: NoteType) => {
    setCurrentNote(note);
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (!currentNote.title) return;

    const now = new Date();
    const formattedDateTime = now.toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' });
    const formattedDate = now.toLocaleString('en-US', { month: 'short', day: 'numeric' });

    if (currentNote.id) {
      // Editing existing
      setNotes(notes.map(n => n.id === currentNote.id ? { ...n, ...currentNote, editedAt: formattedDateTime } as NoteType : n));
    } else {
      // Adding new
      setNotes([{
        id: Date.now().toString(),
        ...currentNote,
        date: formattedDate,
        createdAt: formattedDateTime,
        editedAt: formattedDateTime
      } as NoteType, ...notes]);
    }
    setIsModalOpen(false);
  };

  const handleDelete = () => {
    if (currentNote.id) {
      setNotes(notes.filter(n => n.id !== currentNote.id));
      setIsModalOpen(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      <div className="page-header">
        <div>
          <h1 style={{ fontSize: '28px', fontFamily: '"Outfit", sans-serif', fontWeight: 700, color: '#fff', letterSpacing: '-0.02em', margin: 0 }}>Idea Vault</h1>
          <p style={{ fontSize: '14px', color: '#8b8ba7', marginTop: '6px' }}>Your personal brain dump, strategies, and notes.</p>
        </div>
        <button onClick={openAddModal} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '9px 16px', borderRadius: '10px', fontSize: '13px', fontWeight: 600, background: 'linear-gradient(135deg, #6366f1, #7c3aed)', color: '#fff', border: 'none', cursor: 'pointer', boxShadow: '0 4px 15px rgba(99,102,241,0.3)' }}>
          <Plus style={{ width: '16px', height: '16px' }} /> New Note
        </button>
      </div>

      {/* Search */}
      <div style={{ position: 'relative', maxWidth: '500px' }}>
        <Search style={{ width: '15px', height: '15px', position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#5a5a78' }} />
        <input 
          type="text" 
          placeholder="Search notes, ideas, strategies..." 
          value={search} 
          onChange={(e) => setSearch(e.target.value)} 
          style={{ width: '100%', height: '38px', paddingLeft: '36px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '10px', color: '#f0f0ff', fontSize: '13px', fontFamily: '"Inter", sans-serif', outline: 'none' }} 
        />
      </div>

      {/* Notes Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
        {filteredNotes.map(note => {
          const cc = catColor(note.category);
          return (
            <div 
              key={note.id} 
              onClick={() => openEditModal(note)}
              style={{
                background: 'rgba(20,20,28,0.6)',
                backdropFilter: 'blur(12px)',
                border: '1px solid rgba(255,255,255,0.05)',
                borderRadius: '16px',
                padding: '22px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                display: 'flex',
                flexDirection: 'column',
                height: '240px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {note.isPinned && <Pin style={{ width: '13px', height: '13px', color: '#6366f1' }} fill="#6366f1" />}
                  <span style={{ fontSize: '10px', fontWeight: 600, textTransform: 'uppercase', padding: '3px 8px', borderRadius: '99px', background: 'rgba(255,255,255,0.04)', color: cc.color, border: `1px solid ${cc.border}`, letterSpacing: '0.04em' }}>
                    {note.category}
                  </span>
                </div>
                <button onClick={(e) => e.stopPropagation()} style={{ background: 'none', border: 'none', color: '#5a5a78', cursor: 'pointer' }}>
                  <MoreVertical style={{ width: '14px', height: '14px' }} />
                </button>
              </div>
              <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#fff', margin: '0 0 8px 0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{note.title}</h3>
              <p style={{ fontSize: '13px', color: '#8b8ba7', margin: 0, lineHeight: '1.5', flex: 1, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' }}>
                {note.content}
              </p>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '11px', color: '#5a5a78', marginTop: '16px', paddingTop: '14px', borderTop: '1px solid rgba(255,255,255,0.04)' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Calendar style={{ width: '11px', height: '11px' }} /> Created: {note.createdAt || note.date}
                </span>
                {(note.editedAt && note.editedAt !== note.createdAt) && (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Clock style={{ width: '11px', height: '11px' }} /> Edited: {note.editedAt}
                  </span>
                )}
              </div>
            </div>
          );
        })}
        {filteredNotes.length === 0 && (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px 0', color: '#5a5a78', fontSize: '14px' }}>
            No notes found.
          </div>
        )}
      </div>

      {/* Add/Edit Note Modal */}
      {isModalOpen && (
        <div className="modal-overlay" style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(5px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '20px' }}>
          <div className="modal-content" style={{ background: '#12121a', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', width: '100%', maxWidth: '700px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <input 
                type="text" 
                placeholder="Note Title..."
                value={currentNote.title}
                onChange={e => setCurrentNote({...currentNote, title: e.target.value})}
                style={{ background: 'transparent', border: 'none', color: '#fff', fontSize: '24px', fontWeight: 600, outline: 'none', fontFamily: '"Outfit", sans-serif', width: '100%' }}
              />
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0 }}>
                <button 
                  onClick={() => setCurrentNote({...currentNote, isPinned: !currentNote.isPinned})} 
                  style={{ background: currentNote.isPinned ? 'rgba(99,102,241,0.1)' : 'transparent', border: '1px solid ' + (currentNote.isPinned ? 'rgba(99,102,241,0.2)' : 'transparent'), padding: '6px', borderRadius: '8px', color: currentNote.isPinned ? '#818cf8' : '#5a5a78', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  title="Pin Note"
                >
                  <Pin style={{ width: '16px', height: '16px' }} fill={currentNote.isPinned ? '#818cf8' : 'none'} />
                </button>
                <button onClick={() => setIsModalOpen(false)} style={{ background: 'transparent', border: 'none', color: '#8b8ba7', cursor: 'pointer', padding: '4px' }}>
                  <X style={{ width: '20px', height: '20px' }} />
                </button>
              </div>
            </div>

            <div>
              <select 
                value={currentNote.category}
                onChange={e => setCurrentNote({...currentNote, category: e.target.value})}
                style={{ padding: '6px 12px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '8px', color: '#e0e0ff', fontSize: '12px', fontWeight: 500, outline: 'none', appearance: 'none', textTransform: 'uppercase' }}
              >
                <option value="idea">Idea</option>
                <option value="pricing">Pricing</option>
                <option value="feature">Feature</option>
                <option value="content">Content</option>
                <option value="client">Client</option>
                <option value="roadmap">Roadmap</option>
              </select>
            </div>

            <textarea 
              placeholder="Start typing your note here..."
              value={currentNote.content}
              onChange={e => setCurrentNote({...currentNote, content: e.target.value})}
              style={{ width: '100%', height: '350px', background: 'transparent', border: 'none', color: '#d1d1e0', fontSize: '15px', lineHeight: '1.6', outline: 'none', resize: 'none', fontFamily: '"Inter", sans-serif' }}
            />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '20px' }}>
               <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '11px', color: '#5a5a78' }}>
                 <span>Created: {currentNote.createdAt || 'Not saved yet'}</span>
                 {(currentNote.editedAt && currentNote.editedAt !== currentNote.createdAt) && (
                    <span>Last Edited: {currentNote.editedAt}</span>
                 )}
               </div>
               
               <div style={{ display: 'flex', gap: '12px' }}>
                {currentNote.id && (
                  <button onClick={handleDelete} style={{ padding: '9px 18px', borderRadius: '10px', fontSize: '13px', fontWeight: 500, background: 'rgba(244,63,94,0.1)', color: '#f43f5e', border: '1px solid rgba(244,63,94,0.2)', cursor: 'pointer' }}>Delete</button>
                )}
                <button onClick={() => setIsModalOpen(false)} style={{ padding: '9px 18px', borderRadius: '10px', fontSize: '13px', fontWeight: 500, background: 'transparent', color: '#8b8ba7', border: '1px solid rgba(255,255,255,0.08)', cursor: 'pointer' }}>Discard</button>
                <button onClick={handleSave} disabled={!currentNote.title} style={{ padding: '9px 18px', borderRadius: '10px', fontSize: '13px', fontWeight: 600, background: 'linear-gradient(135deg, #6366f1, #7c3aed)', color: '#fff', border: 'none', cursor: 'pointer', opacity: !currentNote.title ? 0.5 : 1 }}>Save Note</button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
