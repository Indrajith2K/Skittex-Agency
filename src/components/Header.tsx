"use client";

import { Bell, Search, Menu, CheckCircle2, MessageSquare, AlertCircle } from 'lucide-react';
import { useStore } from '@/lib/store';
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const mockNotifications = [
  { id: 1, title: 'New lead captured', desc: 'Sarah Jenkins from Style Boutique', time: '2m ago', icon: <AlertCircle style={{ color: '#38bdf8' }} size={16} /> },
  { id: 2, title: 'Invoice #INV-2024 paid', desc: 'Acme Corp paid ₹50,000', time: '1h ago', icon: <CheckCircle2 style={{ color: '#10b981' }} size={16} /> },
  { id: 3, title: 'New message', desc: 'Client requested a meeting tomorrow', time: '3h ago', icon: <MessageSquare style={{ color: '#f59e0b' }} size={16} /> },
];

export function Header() {
  const toggleSidebar = useStore(state => state.toggleSidebar);
  const [showNotifications, setShowNotifications] = useState(false);
  const [hasUnread, setHasUnread] = useState(true);
  const notifRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleMarkAllRead = () => {
    setHasUnread(false);
  };

  const handleViewAll = () => {
    setShowNotifications(false);
    router.push('/notifications');
  };

  return (
    <header style={{
      height: '60px',
      borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
      background: 'rgba(10, 10, 15, 0.8)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      position: 'sticky',
      top: 0,
      zIndex: 40,
    }}>
      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 28px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button 
            className="mobile-menu-btn" 
            onClick={toggleSidebar}
            style={{ color: '#8b8ba7', background: 'none', border: 'none', cursor: 'pointer', padding: '4px', lineHeight: 0 }}
          >
            <Menu style={{ width: '22px', height: '22px' }} />
          </button>
          <div className="header-search" style={{ position: 'relative' }}>
            <Search style={{
              width: '15px',
              height: '15px',
              position: 'absolute',
              left: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#5a5a78',
            }} />
            <input 
              type="text" 
              placeholder="Search anything... (Cmd+K)" 
              style={{
                width: '100%',
                minWidth: '240px',
                maxWidth: '320px',
                height: '36px',
                paddingLeft: '36px',
                paddingRight: '14px',
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(255, 255, 255, 0.06)',
                borderRadius: '10px',
                color: '#f0f0ff',
                fontSize: '13px',
                fontFamily: '"Inter", sans-serif',
                outline: 'none',
                transition: 'all 0.2s ease',
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.4)';
                e.currentTarget.style.background = 'rgba(99, 102, 241, 0.06)';
                e.currentTarget.style.boxShadow = '0 0 0 3px rgba(99, 102, 241, 0.1)';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.06)';
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            />
          </div>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div ref={notifRef} style={{ position: 'relative' }}>
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              style={{
                position: 'relative',
                color: showNotifications ? '#fff' : '#8b8ba7',
                background: showNotifications ? 'rgba(255,255,255,0.08)' : 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '8px',
                borderRadius: '8px',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Bell style={{ width: '20px', height: '20px' }} />
              {hasUnread && (
                <span style={{
                  width: '8px',
                  height: '8px',
                  background: '#f43f5e',
                  borderRadius: '50%',
                  position: 'absolute',
                  top: '6px',
                  right: '6px',
                  border: '1.5px solid #14141c',
                }} />
              )}
            </button>

            {showNotifications && (
              <div style={{
                position: 'absolute',
                top: 'calc(100% + 12px)',
                right: 0,
                width: '320px',
                background: 'rgba(20, 20, 28, 0.95)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '16px',
                boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
                overflow: 'hidden',
                animation: 'slide-in-right 0.2s ease',
              }}>
                <div style={{ padding: '16px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3 style={{ fontSize: '15px', fontWeight: 600, color: '#fff', margin: 0, fontFamily: '"Outfit", sans-serif' }}>Notifications</h3>
                  {hasUnread && (
                    <button 
                      onClick={handleMarkAllRead} 
                      style={{ background: 'none', border: 'none', fontSize: '12px', color: '#6366f1', cursor: 'pointer', fontWeight: 500 }}
                    >
                      Mark all as read
                    </button>
                  )}
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  {mockNotifications.map((notif, i) => (
                    <div key={notif.id} style={{ 
                      padding: '16px', 
                      display: 'flex', 
                      gap: '12px', 
                      borderBottom: i !== mockNotifications.length - 1 ? '1px solid rgba(255,255,255,0.03)' : 'none',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      opacity: hasUnread ? 1 : 0.6,
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                    >
                      <div style={{ 
                        width: '32px', height: '32px', borderRadius: '50%', 
                        background: hasUnread ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.04)', display: 'flex', 
                        alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                        transition: 'all 0.2s'
                      }}>
                        {notif.icon}
                      </div>
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                          <span style={{ fontSize: '13px', fontWeight: 600, color: hasUnread ? '#fff' : '#d1d1e0', transition: 'color 0.2s' }}>{notif.title}</span>
                          <span style={{ fontSize: '11px', color: '#5a5a78' }}>{notif.time}</span>
                        </div>
                        <p style={{ fontSize: '12px', color: '#8b8ba7', margin: 0, lineHeight: 1.4 }}>{notif.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div style={{ padding: '12px', borderTop: '1px solid rgba(255,255,255,0.05)', textAlign: 'center' }}>
                  <button 
                    onClick={handleViewAll} 
                    style={{ background: 'transparent', border: 'none', color: '#8b8ba7', fontSize: '12px', fontWeight: 500, cursor: 'pointer' }}
                  >
                    View all notifications
                  </button>
                </div>
              </div>
            )}
          </div>

          <button style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            padding: '8px 16px',
            borderRadius: '10px',
            fontSize: '13px',
            fontWeight: 600,
            fontFamily: '"Inter", sans-serif',
            cursor: 'pointer',
            border: 'none',
            background: 'linear-gradient(135deg, #6366f1, #7c3aed)',
            color: '#fff',
            boxShadow: '0 4px 15px rgba(99, 102, 241, 0.3)',
            transition: 'all 0.2s ease',
          }}>
            + Quick Add
          </button>
        </div>
      </div>
    </header>
  );
}
