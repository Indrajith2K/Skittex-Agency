"use client";

import { useState } from "react";
import { CheckCircle2, MessageSquare, AlertCircle, Clock, Search, Filter, TrendingUp, MoreVertical } from "lucide-react";

const mockNotifications = [
  { id: 1, title: 'New lead captured', desc: 'Sarah Jenkins from Style Boutique has filled out the contact form on your main landing page. Immediate follow-up recommended.', time: '2 mins ago', type: 'alert', read: false, icon: <AlertCircle style={{ color: '#38bdf8' }} size={20} /> },
  { id: 2, title: 'Invoice #INV-2024 paid', desc: 'Acme Corp has successfully completed payment for Invoice #INV-2024 (₹50,000). The funds should reflect in your account within 24 hours.', time: '1 hour ago', type: 'success', read: false, icon: <CheckCircle2 style={{ color: '#10b981' }} size={20} /> },
  { id: 3, title: 'New message received', desc: 'Doe Consulting requested a follow-up meeting tomorrow to discuss the Phase 2 wireframes.', time: '3 hours ago', type: 'message', read: false, icon: <MessageSquare style={{ color: '#f59e0b' }} size={20} /> },
  { id: 4, title: 'Weekly Analytics Report', desc: 'Your website traffic increased by 15% this week. View the full report in the Analytics dashboard.', time: '1 day ago', type: 'info', read: true, icon: <TrendingUp style={{ color: '#6366f1' }} size={20} /> },
  { id: 5, title: 'Server Maintenance', desc: 'Scheduled maintenance will occur tonight at 2 AM EST. Expect 15 minutes of downtime.', time: '2 days ago', type: 'alert', read: true, icon: <AlertCircle style={{ color: '#f43f5e' }} size={20} /> },
];

const cardBase: React.CSSProperties = { background: 'rgba(20,20,28,0.6)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.2)' };

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(mockNotifications);
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("all");

  const filteredNotifs = notifications.filter(n => {
    const matchesSearch = n.title.toLowerCase().includes(searchQuery.toLowerCase()) || n.desc.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filter === 'all' || (filter === 'unread' ? !n.read : n.read);
    return matchesSearch && matchesFilter;
  });

  const markAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const toggleRead = (id: number) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, read: !n.read } : n));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', height: '100%', maxWidth: '800px', margin: '0 auto', width: '100%' }}>
      <div className="page-header">
        <div>
          <h1 style={{ fontSize: '28px', fontFamily: '"Outfit", sans-serif', fontWeight: 700, color: '#fff', letterSpacing: '-0.02em', margin: 0 }}>Notifications</h1>
          <p style={{ fontSize: '14px', color: '#8b8ba7', marginTop: '6px' }}>Manage your alerts, messages, and system updates.</p>
        </div>
        <button onClick={markAllRead} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '9px 16px', borderRadius: '10px', fontSize: '13px', fontWeight: 600, background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer', transition: 'all 0.2s' }}>
          <CheckCircle2 style={{ width: '16px', height: '16px' }} /> Mark all as read
        </button>
      </div>

      {/* Search & Filters */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: '260px' }}>
          <Search style={{ width: '15px', height: '15px', position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#5a5a78' }} />
          <input 
            type="text" 
            placeholder="Search notifications..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ width: '100%', height: '38px', paddingLeft: '36px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '10px', color: '#f0f0ff', fontSize: '13px', fontFamily: '"Inter", sans-serif', outline: 'none' }} 
          />
        </div>
        <div style={{ position: 'relative' }}>
          <select 
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            style={{ appearance: 'none', padding: '9px 32px 9px 14px', borderRadius: '10px', fontSize: '13px', fontWeight: 500, background: 'rgba(255,255,255,0.02)', color: '#8b8ba7', border: '1px solid rgba(255,255,255,0.08)', cursor: 'pointer', outline: 'none' }}
          >
            <option value="all">All Notifications</option>
            <option value="unread">Unread Only</option>
            <option value="read">Read Only</option>
          </select>
          <Filter style={{ width: '14px', height: '14px', position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: '#5a5a78', pointerEvents: 'none' }} />
        </div>
      </div>

      {/* List */}
      <div style={{ ...cardBase, padding: '8px' }}>
        {filteredNotifs.length === 0 ? (
          <div style={{ padding: '60px 20px', textAlign: 'center', color: '#5a5a78' }}>
            <AlertCircle style={{ width: '40px', height: '40px', margin: '0 auto 12px auto', opacity: 0.5 }} />
            <p style={{ fontSize: '14px' }}>No notifications found.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {filteredNotifs.map((n, i) => (
              <div 
                key={n.id} 
                style={{ 
                  padding: '20px', 
                  display: 'flex', 
                  gap: '16px', 
                  borderBottom: i !== filteredNotifs.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
                  background: n.read ? 'transparent' : 'rgba(99,102,241,0.03)',
                  transition: 'background 0.2s ease',
                  borderRadius: '8px',
                  position: 'relative'
                }}
              >
                {!n.read && (
                   <div style={{ position: 'absolute', left: '0', top: '20px', bottom: '20px', width: '3px', background: '#6366f1', borderRadius: '0 4px 4px 0' }} />
                )}
                
                <div style={{ 
                  width: '42px', height: '42px', borderRadius: '50%', 
                  background: n.read ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.06)', 
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 
                }}>
                  {n.icon}
                </div>
                
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                    <h3 style={{ fontSize: '15px', fontWeight: n.read ? 500 : 600, color: n.read ? '#d1d1e0' : '#fff', margin: 0, fontFamily: '"Outfit", sans-serif' }}>
                      {n.title}
                    </h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span style={{ fontSize: '12px', color: '#5a5a78', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Clock style={{ width: '12px', height: '12px' }} /> {n.time}
                      </span>
                      <button onClick={() => toggleRead(n.id)} style={{ background: 'none', border: 'none', color: '#5a5a78', cursor: 'pointer', padding: '0' }} title="Mark as read/unread">
                        <MoreVertical style={{ width: '16px', height: '16px' }} />
                      </button>
                    </div>
                  </div>
                  <p style={{ fontSize: '13px', color: '#8b8ba7', margin: 0, lineHeight: 1.5 }}>
                    {n.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
