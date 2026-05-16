"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useStore } from '@/lib/store';
import { 
  LayoutDashboard, 
  Users, 
  Briefcase, 
  CheckSquare, 
  FileText, 
  CreditCard, 
  TrendingUp, 
  PieChart, 
  Search, 
  FolderLock, 
  Settings, 
  Lightbulb,
  X
} from 'lucide-react';

const navItems = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Leads', href: '/leads', icon: Users },
  { name: 'Clients', href: '/clients', icon: Briefcase },
  { name: 'Projects', href: '/projects', icon: CheckSquare },
  { name: 'Invoices', href: '/invoices', icon: FileText },
  { name: 'Expenses', href: '/expenses', icon: CreditCard },
  { name: 'Analytics', href: '/analytics', icon: TrendingUp },
  { name: 'Investments', href: '/investments', icon: PieChart },
  { name: 'Tasks', href: '/tasks', icon: CheckSquare },
  { name: 'SEO', href: '/seo', icon: Search },
  { name: 'Vault', href: '/vault', icon: FolderLock },
  { name: 'Notes', href: '/notes', icon: Lightbulb },
];

export function Sidebar() {
  const pathname = usePathname();
  const sidebarOpen = useStore(state => state.sidebarOpen);
  const setSidebarOpen = useStore(state => state.setSidebarOpen);

  const closeSidebar = () => setSidebarOpen(false);

  return (
    <>
      {/* Mobile Backdrop — only visible when sidebar is open on mobile */}
      {sidebarOpen && (
        <div
          onClick={closeSidebar}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.55)',
            backdropFilter: 'blur(4px)',
            zIndex: 49,
            display: 'none',
          }}
          className="mobile-backdrop"
        />
      )}

      <aside
        className="sidebar-nav"
        style={{
          width: '256px',
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          background: 'rgba(12, 12, 20, 0.95)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          borderRight: '1px solid rgba(255, 255, 255, 0.06)',
          boxShadow: '4px 0 30px rgba(0, 0, 0, 0.3)',
          flexShrink: 0,
          position: 'relative',
          zIndex: 50,
          overflowY: 'auto',
          overflowX: 'hidden',
          // On mobile, CSS sets transform: translateX(-100%) by default.
          // When open, inline style overrides to translateX(0).
          // On desktop (>768px), CSS display is flex so transform doesn't apply.
          transform: sidebarOpen ? 'translateX(0)' : undefined,
          transition: 'transform 0.3s ease',
        }}
      >
        {/* Logo */}
        <div style={{ padding: '24px 24px 16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontWeight: 800,
              fontSize: '16px',
              boxShadow: '0 4px 15px rgba(99, 102, 241, 0.4)',
              flexShrink: 0,
            }}>
              A
            </div>
            <span style={{
              fontSize: '20px',
              fontFamily: '"Outfit", sans-serif',
              fontWeight: 700,
              color: '#ffffff',
              letterSpacing: '-0.02em',
            }}>
              Skittex CRM
            </span>
          </div>
          {/* X button — only visible on mobile via CSS */}
          <button
            className="sidebar-close-btn"
            onClick={closeSidebar}
            style={{ color: '#8b8ba7', background: 'none', border: 'none', cursor: 'pointer', padding: '4px', lineHeight: 0 }}
          >
            <X style={{ width: '20px', height: '20px' }} />
          </button>
        </div>

        {/* Divider */}
        <div style={{ height: '1px', background: 'rgba(255,255,255,0.06)', margin: '0 16px' }} />

        {/* Navigation */}
        <nav style={{ flex: 1, overflowY: 'auto', padding: '12px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/' && pathname?.startsWith(`${item.href}/`));
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '10px 14px',
                  borderRadius: '10px',
                  fontSize: '13.5px',
                  fontWeight: 500,
                  fontFamily: '"Inter", sans-serif',
                  color: isActive ? '#fff' : '#8b8ba7',
                  background: isActive ? 'rgba(99, 102, 241, 0.12)' : 'transparent',
                  border: isActive ? '1px solid rgba(99, 102, 241, 0.15)' : '1px solid transparent',
                  textDecoration: 'none',
                  transition: 'all 0.2s ease',
                  cursor: 'pointer',
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)';
                    e.currentTarget.style.color = '#e0e0ff';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = '#8b8ba7';
                  }
                }}
                onClick={closeSidebar}
              >
                <Icon style={{ 
                  width: '18px', 
                  height: '18px', 
                  color: isActive ? '#818cf8' : '#5a5a78',
                  flexShrink: 0,
                }} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Bottom Section */}
        <div style={{ padding: '12px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <Link
            href="/settings"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '10px 14px',
              borderRadius: '10px',
              fontSize: '13.5px',
              fontWeight: 500,
              fontFamily: '"Inter", sans-serif',
              color: pathname === '/settings' ? '#fff' : '#8b8ba7',
              background: pathname === '/settings' ? 'rgba(99, 102, 241, 0.12)' : 'transparent',
              border: pathname === '/settings' ? '1px solid rgba(99, 102, 241, 0.15)' : '1px solid transparent',
              textDecoration: 'none',
              transition: 'all 0.2s ease',
            }}
            onClick={closeSidebar}
          >
            <Settings style={{ width: '18px', height: '18px', color: '#5a5a78' }} />
            Settings
          </Link>

          {/* Profile */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '12px 14px 8px 14px',
            marginTop: '8px',
          }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #6366f1, #ec4899)',
              padding: '2px',
              flexShrink: 0,
            }}>
              <div style={{
                width: '100%',
                height: '100%',
                borderRadius: '50%',
                background: '#0c0c14',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <span style={{ fontSize: '12px', fontWeight: 700, color: '#fff' }}>IN</span>
              </div>
            </div>
            <div>
              <p style={{ fontSize: '13px', fontWeight: 600, color: '#fff', margin: 0, letterSpacing: '0.02em' }}>INDRAJITH</p>
              <p style={{ fontSize: '11px', color: '#5a5a78', margin: 0, letterSpacing: '0.04em' }}>FOUNDER</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
