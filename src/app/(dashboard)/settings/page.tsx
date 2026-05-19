"use client";

import { Save } from "lucide-react";
import { useState } from "react";

const cardBase: React.CSSProperties = { background: 'rgba(20,20,28,0.6)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.2)' };

const settingsTabs = ['Profile', 'Agency Details', 'Notifications', 'Security', 'Data & Backups'];

const inputStyle: React.CSSProperties = {
  width: '100%',
  height: '40px',
  padding: '0 14px',
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(255,255,255,0.06)',
  borderRadius: '10px',
  color: '#f0f0ff',
  fontSize: '13.5px',
  fontFamily: '"Inter", sans-serif',
  outline: 'none',
};

function Toggle({ checked }: { checked: boolean }) {
  const [isOn, setIsOn] = useState(checked);
  return (
    <button 
      onClick={() => setIsOn(!isOn)}
      style={{
        width: '40px',
        height: '24px',
        borderRadius: '12px',
        background: isOn ? '#6366f1' : 'rgba(255,255,255,0.1)',
        border: 'none',
        position: 'relative',
        cursor: 'pointer',
        transition: 'all 0.2s ease'
      }}
    >
      <div style={{
        width: '18px',
        height: '18px',
        borderRadius: '50%',
        background: '#fff',
        position: 'absolute',
        top: '3px',
        left: isOn ? '19px' : '3px',
        transition: 'all 0.2s ease',
        boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
      }} />
    </button>
  );
}

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('Profile');

  const renderContent = () => {
    switch (activeTab) {
      case 'Profile':
        return (
          <>
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', paddingBottom: '24px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              <div style={{ width: '72px', height: '72px', borderRadius: '50%', background: 'linear-gradient(135deg, #6366f1, #ec4899)', padding: '2px' }}>
                <div style={{ width: '100%', height: '100%', borderRadius: '50%', background: '#0c0c14', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontSize: '22px', fontWeight: 700, color: '#fff' }}>JD</span>
                </div>
              </div>
              <div>
                <button style={{ padding: '7px 14px', borderRadius: '8px', fontSize: '12px', fontWeight: 500, background: 'transparent', color: '#8b8ba7', border: '1px solid rgba(255,255,255,0.08)', cursor: 'pointer', fontFamily: '"Inter", sans-serif', marginBottom: '6px' }}>Change Avatar</button>
                <p style={{ fontSize: '11px', color: '#5a5a78', margin: 0 }}>JPG, GIF or PNG. Max size of 800K</p>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '24px' }}>
              <div className="responsive-grid-2" style={{ gap: "16px" }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#fff', marginBottom: '8px' }}>First Name</label>
                  <input type="text" defaultValue="John" style={inputStyle} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#fff', marginBottom: '8px' }}>Last Name</label>
                  <input type="text" defaultValue="Doe" style={inputStyle} />
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#fff', marginBottom: '8px' }}>Email Address</label>
                <input type="email" defaultValue="founder@agency.com" style={inputStyle} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#fff', marginBottom: '8px' }}>Timezone</label>
                <select style={{ ...inputStyle, appearance: 'none' as const }}>
                  <option>Asia/Kolkata (IST)</option>
                  <option>America/New_York (EST)</option>
                  <option>Europe/London (GMT)</option>
                </select>
              </div>
            </div>
          </>
        );
      case 'Agency Details':
        return (
          <>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#fff', marginBottom: '8px' }}>Agency Name</label>
                <input type="text" defaultValue="AgencyOS Inc." style={inputStyle} />
              </div>
              <div className="responsive-grid-2" style={{ gap: "16px" }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#fff', marginBottom: '8px' }}>Website URL</label>
                  <input type="url" defaultValue="https://agencyos.com" style={inputStyle} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#fff', marginBottom: '8px' }}>Tax ID / GSTIN</label>
                  <input type="text" defaultValue="GST123456789" style={inputStyle} />
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#fff', marginBottom: '8px' }}>Business Address</label>
                <textarea rows={3} defaultValue="123 Business Avenue, Suite 100\nTech District" style={{ ...inputStyle, height: 'auto', padding: '12px 14px', resize: 'vertical' }} />
              </div>
            </div>
          </>
        );
      case 'Notifications':
        return (
          <>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#fff', margin: 0 }}>Email Notifications</h3>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <p style={{ fontSize: '14px', color: '#fff', margin: 0, fontWeight: 500 }}>Daily Summary</p>
                  <p style={{ fontSize: '12px', color: '#5a5a78', margin: '4px 0 0 0' }}>Receive a daily summary of all agency activities.</p>
                </div>
                <Toggle checked={true} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <p style={{ fontSize: '14px', color: '#fff', margin: 0, fontWeight: 500 }}>New Lead Alerts</p>
                  <p style={{ fontSize: '12px', color: '#5a5a78', margin: '4px 0 0 0' }}>Instant notifications when a new lead is captured.</p>
                </div>
                <Toggle checked={true} />
              </div>
              
              <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#fff', margin: '16px 0 0 0' }}>Integration Alerts</h3>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <p style={{ fontSize: '14px', color: '#fff', margin: 0, fontWeight: 500 }}>Slack Notifications</p>
                  <p style={{ fontSize: '12px', color: '#5a5a78', margin: '4px 0 0 0' }}>Push important alerts to your Slack workspace.</p>
                </div>
                <Toggle checked={false} />
              </div>
            </div>
          </>
        );
      case 'Security':
        return (
          <>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#fff', margin: 0 }}>Change Password</h3>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#fff', marginBottom: '8px' }}>Current Password</label>
                  <input type="password" style={inputStyle} />
                </div>
                <div className="responsive-grid-2" style={{ gap: "16px" }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#fff', marginBottom: '8px' }}>New Password</label>
                    <input type="password" style={inputStyle} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#fff', marginBottom: '8px' }}>Confirm New Password</label>
                    <input type="password" style={inputStyle} />
                  </div>
                </div>
              </div>
              
              <div style={{ height: '1px', background: 'rgba(255,255,255,0.05)', margin: '8px 0' }} />
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <p style={{ fontSize: '14px', color: '#fff', margin: 0, fontWeight: 500 }}>Two-Factor Authentication (2FA)</p>
                  <p style={{ fontSize: '12px', color: '#5a5a78', margin: '4px 0 0 0' }}>Add an extra layer of security to your account.</p>
                </div>
                <button style={{ padding: '7px 14px', borderRadius: '8px', fontSize: '12px', fontWeight: 500, background: 'rgba(99, 102, 241, 0.1)', color: '#818cf8', border: '1px solid rgba(99, 102, 241, 0.2)', cursor: 'pointer', fontFamily: '"Inter", sans-serif' }}>Enable 2FA</button>
              </div>
            </div>
          </>
        );
      case 'Data & Backups':
        return (
          <>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <p style={{ fontSize: '14px', color: '#fff', margin: 0, fontWeight: 500 }}>Automated Daily Backups</p>
                  <p style={{ fontSize: '12px', color: '#5a5a78', margin: '4px 0 0 0' }}>Automatically backup your agency data every 24 hours.</p>
                </div>
                <Toggle checked={true} />
              </div>

              <div style={{ height: '1px', background: 'rgba(255,255,255,0.05)' }} />

              <div>
                <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#fff', margin: '0 0 16px 0' }}>Export Data</h3>
                <p style={{ fontSize: '13px', color: '#8b8ba7', margin: '0 0 16px 0', lineHeight: 1.5 }}>
                  Download a complete copy of your agency data including leads, clients, projects, and invoices. The export will be delivered as a secure ZIP file containing CSV and JSON formats.
                </p>
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                  <button style={{ padding: '9px 18px', borderRadius: '10px', fontSize: '13px', fontWeight: 500, background: 'transparent', color: '#fff', border: '1px solid rgba(255,255,255,0.2)', cursor: 'pointer', fontFamily: '"Inter", sans-serif' }}>
                    Export as CSV
                  </button>
                  <button style={{ padding: '9px 18px', borderRadius: '10px', fontSize: '13px', fontWeight: 500, background: 'transparent', color: '#fff', border: '1px solid rgba(255,255,255,0.2)', cursor: 'pointer', fontFamily: '"Inter", sans-serif' }}>
                    Export as JSON
                  </button>
                </div>
              </div>
            </div>
          </>
        )
      default:
        return null;
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', maxWidth: '960px', margin: '0 auto', width: '100%' }}>
      <div>
        <h1 style={{ fontSize: '28px', fontFamily: '"Outfit", sans-serif', fontWeight: 700, color: '#fff', letterSpacing: '-0.02em', margin: 0 }}>Settings</h1>
        <p style={{ fontSize: '14px', color: '#8b8ba7', marginTop: '6px' }}>Manage your agency preferences and account settings.</p>
      </div>

      <div style={{ display: 'flex', gap: '28px', flexWrap: 'wrap' }}>
        {/* Tabs sidebar */}
        <div style={{ width: '100%', maxWidth: '220px', flexShrink: 0, display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {settingsTabs.map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} style={{
              textAlign: 'left',
              padding: '10px 16px',
              borderRadius: '10px',
              fontSize: '13.5px',
              fontWeight: 500,
              fontFamily: '"Inter", sans-serif',
              cursor: 'pointer',
              border: 'none',
              background: activeTab === tab ? 'rgba(255,255,255,0.08)' : 'transparent',
              color: activeTab === tab ? '#fff' : '#8b8ba7',
              transition: 'all 0.2s ease',
            }}>
              {tab}
            </button>
          ))}
        </div>

        {/* Content */}
        <div style={{ ...cardBase, padding: '28px', flex: 1, minWidth: '300px' }}>
          {renderContent()}

          {/* Save - Always shown at the bottom of the card */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '28px', paddingTop: '24px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
            <button style={{ padding: '9px 18px', borderRadius: '10px', fontSize: '13px', fontWeight: 500, background: 'transparent', color: '#8b8ba7', border: '1px solid rgba(255,255,255,0.08)', cursor: 'pointer', fontFamily: '"Inter", sans-serif' }}>Cancel</button>
            <button style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '9px 18px', borderRadius: '10px', fontSize: '13px', fontWeight: 600, background: 'linear-gradient(135deg, #6366f1, #7c3aed)', color: '#fff', border: 'none', cursor: 'pointer', boxShadow: '0 4px 15px rgba(99,102,241,0.3)' }}>
              <Save style={{ width: '14px', height: '14px' }} /> Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
