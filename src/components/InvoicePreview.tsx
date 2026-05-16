"use client";

import { X, Printer, Download } from "lucide-react";
import { useEffect } from "react";

interface InvoiceItem {
  description: string;
  qty: number;
  price: number;
}

interface InvoiceType {
  id: string;
  number: string;
  client: string;
  clientJobTitle?: string;
  clientCompany?: string;
  clientAddress?: string;
  amount: number;
  date: string;
  due: string;
  status: 'paid' | 'pending' | 'sent' | 'draft' | 'overdue';
  items: InvoiceItem[];
}

export default function InvoicePreview({ invoice, onClose }: { invoice: InvoiceType; onClose: () => void }) {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = 'unset'; };
  }, []);

  const items = invoice.items && invoice.items.length > 0 ? invoice.items : [{ description: 'General Service', qty: 1, price: invoice.amount }];
  
  const subtotal = items.reduce((sum, item) => sum + (item.qty * item.price), 0);
  const tax = 0; // 0% tax as per the image reference
  const total = subtotal + tax;

  const fmt = (n: number) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);
  const formatDate = (d: string) => {
    if (!d) return '';
    const date = new Date(d);
    return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }); // 16 June 2025
  };

  return (
    <div 
      className="invoice-preview-overlay"
      style={{
        position: 'fixed',
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
        zIndex: 9999,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
        padding: '40px',
        overflowY: 'auto',
        fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
      }}
    >
      {/* Controls Overlay */}
      <div 
        className="print-hidden"
        style={{
          position: 'fixed',
          top: '24px',
          right: '24px',
          display: 'flex',
          gap: '12px',
          zIndex: 10000
        }}
      >
        <button 
          onClick={() => window.print()}
          style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            padding: '10px 20px', backgroundColor: '#111', color: '#fff',
            borderRadius: '8px', border: 'none', cursor: 'pointer',
            fontWeight: 600, fontSize: '14px', boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
          }}
        >
          <Printer size={18} /> Print Invoice
        </button>
        <button 
          onClick={onClose}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            width: '40px', height: '40px', backgroundColor: 'rgba(255,255,255,0.1)', color: '#fff',
            borderRadius: '50%', border: 'none', cursor: 'pointer', backdropFilter: 'blur(4px)'
          }}
        >
          <X size={20} />
        </button>
      </div>

      {/* The Invoice Paper */}
      <div 
        id="invoice-paper" 
        style={{
          backgroundColor: '#f6f5ef', // Minimalist beige
          width: '100%',
          maxWidth: '820px',
          minHeight: '1056px', // Standard letter/A4 height roughly
          margin: '0 auto',
          padding: '60px 60px',
          boxSizing: 'border-box',
          color: '#111',
          boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        
        {/* Top Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '30px' }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <h1 style={{ fontSize: '90px', fontWeight: 800, margin: 0, letterSpacing: '-0.04em', lineHeight: 0.85 }}>
              Invoice
            </h1>
            <div style={{
               display: 'inline-flex', alignItems: 'center', padding: '6px 14px', 
               backgroundColor: invoice.status === 'paid' ? '#e6f4ea' : invoice.status === 'overdue' ? '#fce8e6' : invoice.status === 'sent' ? '#e8f0fe' : '#f1f3f4',
               color: invoice.status === 'paid' ? '#137333' : invoice.status === 'overdue' ? '#c5221f' : invoice.status === 'sent' ? '#1967d2' : '#5f6368',
               borderRadius: '6px', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', width: 'fit-content', marginTop: '16px', letterSpacing: '0.05em'
            }}>
               STATUS: {invoice.status}
            </div>
          </div>
          <div style={{ textAlign: 'right', fontSize: '15px', color: '#111', marginBottom: '8px' }}>
            <div style={{ marginBottom: '4px' }}>{formatDate(invoice.date)}</div>
            <div style={{ fontWeight: 700 }}>Invoice No. {invoice.number.replace('INV-', '')}</div>
          </div>
        </div>

        {/* Separator */}
        <hr style={{ border: 'none', borderTop: '1px solid #ccc9bc', margin: '0 0 30px 0' }} />

        {/* Billed To */}
        <div style={{ marginBottom: '50px' }}>
          <div style={{ fontWeight: 700, fontSize: '15px', marginBottom: '12px' }}>Billed to:</div>
          <div style={{ fontSize: '15px', lineHeight: 1.6, color: '#333' }}>
            <div>{invoice.client}</div>
            {invoice.clientCompany && <div>{invoice.clientCompany}</div>}
            {invoice.clientAddress && <div>{invoice.clientAddress}</div>}
          </div>
        </div>

        {/* Table Header Separator */}
        <hr style={{ border: 'none', borderTop: '1px solid #ccc9bc', margin: '0 0 12px 0' }} />

        {/* Table Headers */}
        <div style={{ display: 'flex', fontWeight: 700, fontSize: '15px', paddingBottom: '12px' }}>
          <div style={{ flex: 2 }}>Description</div>
          <div style={{ flex: 1, textAlign: 'center' }}>Rate</div>
          <div style={{ flex: 1, textAlign: 'center' }}>Qty</div>
          <div style={{ flex: 1, textAlign: 'right' }}>Amount</div>
        </div>

        <hr style={{ border: 'none', borderTop: '1px solid #ccc9bc', margin: '0 0 12px 0' }} />

        {/* Table Rows */}
        <div style={{ flexGrow: 1 }}>
          {items.map((item, i) => (
            <div key={i} style={{ display: 'flex', fontSize: '15px', paddingBottom: '16px', color: '#333' }}>
              <div style={{ flex: 2 }}>{item.description}</div>
              <div style={{ flex: 1, textAlign: 'center' }}>{fmt(item.price)}</div>
              <div style={{ flex: 1, textAlign: 'center' }}>{item.qty}</div>
              <div style={{ flex: 1, textAlign: 'right' }}>{fmt(item.qty * item.price)}</div>
            </div>
          ))}
          
          <hr style={{ border: 'none', borderTop: '1px solid #ccc9bc', margin: '0 0 20px 0' }} />

          {/* Totals */}
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <div style={{ width: '250px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', fontSize: '15px' }}>
                <div style={{ fontWeight: 700 }}>Subtotal</div>
                <div>{fmt(subtotal)}</div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', fontSize: '15px' }}>
                <div style={{ fontWeight: 700 }}>Tax (0%)</div>
                <div>{fmt(tax)}</div>
              </div>
              <hr style={{ border: 'none', borderTop: '1px solid #ccc9bc', margin: '0 0 16px 0' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '15px' }}>
                <div style={{ fontWeight: 700 }}>Total</div>
                <div style={{ fontWeight: 700 }}>{fmt(total)}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div style={{ marginTop: 'auto', paddingTop: '60px' }}>
          <hr style={{ border: 'none', borderTop: '1px solid #ccc9bc', margin: '0 0 30px 0' }} />
          
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '15px', lineHeight: 1.6, color: '#333' }}>
            <div>
              <div style={{ fontWeight: 700, color: '#111', marginBottom: '12px' }}>Payment Information</div>
              <div>Skittex Studio</div>
              <div>Bank: State Bank Of India</div>
              <div>UPI ID: idgamming2021-1@okisbi</div>
              <div>UPI Number: 9384084213 (Idgamming)</div>
            </div>
            <div style={{ textAlign: 'left', minWidth: '250px' }}>
              <div style={{ fontWeight: 700, color: '#111', marginBottom: '12px' }}>Skittex Studio</div>
              <div>Coimbatore, Tamilnadu, India</div>
              <div>+91 9384084213</div>
              <div>billing.skittex@gmail.com</div>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #invoice-paper, #invoice-paper * {
            visibility: visible;
          }
          #invoice-paper {
            position: absolute;
            left: 0;
            top: 0;
            width: 100% !important;
            max-width: none !important;
            box-shadow: none !important;
            padding: 40px !important;
            margin: 0 !important;
            background-color: #f6f5ef !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .print-hidden {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}
