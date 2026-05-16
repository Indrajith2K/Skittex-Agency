"use client";

import { useState } from "react";
import { Plus, Search, Filter, MoreHorizontal, ArrowUpRight, X } from "lucide-react";

interface ExpenseType {
  id: string;
  title: string;
  category: string;
  amount: number;
  date: string;
  recurring: boolean;
}

const fmt = (n: number) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", minimumFractionDigits: 0 }).format(n);

const mockExpenses: ExpenseType[] = [
  { id: "1", title: "AWS Hosting", category: "hosting", amount: 15000, date: "2024-05-12", recurring: true },
  { id: "2", title: "Facebook Ads - Nexus", category: "ads", amount: 25000, date: "2024-05-10", recurring: false },
  { id: "3", title: "Figma Subscription", category: "tools", amount: 1200, date: "2024-05-05", recurring: true },
  { id: "4", title: "Client Lunch - Doe", category: "client-related", amount: 3500, date: "2024-05-02", recurring: false },
  { id: "5", title: "Office Internet", category: "internet", amount: 2500, date: "2024-05-01", recurring: true },
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

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState<ExpenseType[]>(mockExpenses);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentExpense, setCurrentExpense] = useState<Partial<ExpenseType>>({
    title: '', category: 'tools', amount: 0, date: new Date().toISOString().split('T')[0], recurring: false
  });
  const [customCategory, setCustomCategory] = useState("");

  const defaultCategories = ['hosting', 'ads', 'tools', 'client-related', 'internet', 'travel', 'other'];

  // Derived State for Summary Cards
  const totalExpenses = expenses.reduce((acc, e) => acc + e.amount, 0);
  const recurringOverhead = expenses.filter(e => e.recurring).reduce((acc, e) => acc + e.amount, 0);
  
  const catTotals = expenses.reduce((acc, e) => {
    acc[e.category] = (acc[e.category] || 0) + e.amount;
    return acc;
  }, {} as Record<string, number>);
  const largestCat = Object.entries(catTotals).sort((a, b) => b[1] - a[1])[0] || ['none', 0];

  const filteredExpenses = expenses.filter(e => {
    const matchesSearch = e.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = categoryFilter === 'all' || e.category === categoryFilter;
    return matchesSearch && matchesFilter;
  });

  const openAddModal = () => {
    setCurrentExpense({ title: '', category: 'tools', amount: 0, date: new Date().toISOString().split('T')[0], recurring: false });
    setCustomCategory("");
    setIsModalOpen(true);
  };

  const openEditModal = (expense: ExpenseType) => {
    if (defaultCategories.includes(expense.category)) {
      setCurrentExpense(expense);
      setCustomCategory("");
    } else {
      setCurrentExpense({ ...expense, category: 'other' });
      setCustomCategory(expense.category);
    }
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (!currentExpense.title || !currentExpense.amount) return;

    let finalCategory = currentExpense.category;
    if (currentExpense.category === 'other' && customCategory.trim() !== '') {
      finalCategory = customCategory.trim().toLowerCase().replace(/\s+/g, '-');
    }

    const expenseToSave = { ...currentExpense, category: finalCategory } as ExpenseType;

    if (expenseToSave.id) {
      setExpenses(expenses.map(e => e.id === expenseToSave.id ? expenseToSave : e));
    } else {
      const newExpense: ExpenseType = { ...expenseToSave, id: Date.now().toString() };
      setExpenses([newExpense, ...expenses]);
    }
    setIsModalOpen(false);
  };

  const handleDelete = () => {
    if (currentExpense.id) {
      setExpenses(expenses.filter(e => e.id !== currentExpense.id));
      setIsModalOpen(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', height: '100%' }}>
      <div className="page-header">
        <div>
          <h1 style={{ fontSize: '28px', fontFamily: '"Outfit", sans-serif', fontWeight: 700, color: '#fff', letterSpacing: '-0.02em', margin: 0 }}>Expenses</h1>
          <p style={{ fontSize: '14px', color: '#8b8ba7', marginTop: '6px' }}>Track business expenses, subscriptions, and overheads.</p>
        </div>
        <button onClick={openAddModal} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '9px 16px', borderRadius: '10px', fontSize: '13px', fontWeight: 600, background: 'linear-gradient(135deg, #6366f1, #7c3aed)', color: '#fff', border: 'none', cursor: 'pointer', boxShadow: '0 4px 15px rgba(99,102,241,0.3)' }}>
          <Plus style={{ width: '16px', height: '16px' }} /> Add Expense
        </button>
      </div>

      {/* Summary */}
      <div className="responsive-grid-3">
        <div style={{ ...cardBase, padding: '22px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
            <p style={{ fontSize: '12px', color: '#8b8ba7', margin: 0 }}>Total Expenses (All Time)</p>
            <span style={{ fontSize: '11px', color: '#f43f5e', display: 'flex', alignItems: 'center', gap: '3px', background: 'rgba(244,63,94,0.1)', padding: '2px 8px', borderRadius: '6px', border: '1px solid rgba(244,63,94,0.2)' }}>
              <ArrowUpRight style={{ width: '12px', height: '12px' }} />
            </span>
          </div>
          <p style={{ fontSize: '28px', fontWeight: 700, color: '#fff', margin: 0, letterSpacing: '-0.02em' }}>{fmt(totalExpenses)}</p>
        </div>
        <div style={{ ...cardBase, padding: '22px' }}>
          <p style={{ fontSize: '12px', color: '#8b8ba7', margin: '0 0 8px 0' }}>Recurring Overhead</p>
          <p style={{ fontSize: '28px', fontWeight: 700, color: '#fff', margin: 0, letterSpacing: '-0.02em' }}>{fmt(recurringOverhead)}<span style={{ fontSize: '13px', color: '#5a5a78', fontWeight: 400 }}>/mo</span></p>
        </div>
        <div style={{ ...cardBase, padding: '22px' }}>
          <p style={{ fontSize: '12px', color: '#8b8ba7', margin: '0 0 8px 0' }}>Largest Category</p>
          <p style={{ fontSize: '28px', fontWeight: 700, color: '#fff', margin: 0, letterSpacing: '-0.02em', textTransform: 'capitalize' }}>
            {largestCat[0] === 'none' ? 'None' : largestCat[0].replace('-', ' ')}
          </p>
          <p style={{ fontSize: '13px', color: '#5a5a78', marginTop: '4px' }}>{fmt(largestCat[1])} total</p>
        </div>
      </div>

      {/* Search & Filters */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: '260px', maxWidth: '400px' }}>
          <Search style={{ width: '15px', height: '15px', position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#5a5a78' }} />
          <input 
            type="text" 
            placeholder="Search expenses by description..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ width: '100%', height: '38px', paddingLeft: '36px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '10px', color: '#f0f0ff', fontSize: '13px', fontFamily: '"Inter", sans-serif', outline: 'none' }} 
          />
        </div>
        <div style={{ position: 'relative' }}>
          <select 
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            style={{ appearance: 'none', padding: '9px 32px 9px 14px', borderRadius: '10px', fontSize: '13px', fontWeight: 500, background: 'rgba(255,255,255,0.02)', color: '#8b8ba7', border: '1px solid rgba(255,255,255,0.08)', cursor: 'pointer', outline: 'none', textTransform: 'capitalize' }}
          >
            <option value="all">All Categories</option>
            <option value="hosting">Hosting</option>
            <option value="ads">Ads</option>
            <option value="tools">Tools</option>
            <option value="client-related">Client Related</option>
            <option value="internet">Internet</option>
            <option value="travel">Travel</option>
            <option value="other">Other</option>
          </select>
          <Filter style={{ width: '14px', height: '14px', position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: '#5a5a78', pointerEvents: 'none' }} />
        </div>
      </div>

      {/* Table */}
      <div style={{ ...cardBase, overflowX: "auto" }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '600px' }}>
          <thead>
            <tr>
              <th style={th}>Description</th>
              <th style={th}>Category</th>
              <th style={th}>Date</th>
              <th style={th}>Recurring</th>
              <th style={{ ...th, textAlign: 'right' }}>Amount</th>
              <th style={{ ...th, width: '50px' }}></th>
            </tr>
          </thead>
          <tbody>
            {filteredExpenses.map((e) => (
              <tr 
                key={e.id} 
                onClick={() => openEditModal(e)}
                style={{ cursor: 'pointer', transition: 'background 0.2s' }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
              >
                <td style={{ ...tc, fontWeight: 600, color: '#fff' }}>{e.title}</td>
                <td style={tc}>
                  <span style={{ fontSize: '11px', padding: '3px 10px', borderRadius: '99px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)', color: '#8b8ba7', textTransform: 'capitalize' }}>
                    {e.category.replace('-', ' ')}
                  </span>
                </td>
                <td style={{ ...tc, color: '#8b8ba7', fontSize: '13px' }}>{formatDate(e.date)}</td>
                <td style={tc}>
                  {e.recurring
                    ? <span style={{ fontSize: '10px', fontWeight: 600, background: 'rgba(99,102,241,0.1)', color: '#818cf8', padding: '3px 8px', borderRadius: '6px', border: '1px solid rgba(99,102,241,0.2)' }}>Monthly</span>
                    : <span style={{ fontSize: '12px', color: '#5a5a78' }}>One-time</span>
                  }
                </td>
                <td style={{ ...tc, textAlign: 'right', fontWeight: 600, color: '#f43f5e' }}>{fmt(e.amount)}</td>
                <td style={{ ...tc, textAlign: 'right' }}>
                  <button onClick={(ev) => { ev.stopPropagation(); openEditModal(e); }} style={{ width: '30px', height: '30px', borderRadius: '8px', background: 'transparent', border: 'none', color: '#5a5a78', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <MoreHorizontal style={{ width: '15px', height: '15px' }} />
                  </button>
                </td>
              </tr>
            ))}
            {filteredExpenses.length === 0 && (
              <tr>
                <td colSpan={6} style={{ padding: '40px', textAlign: 'center', color: '#5a5a78', fontSize: '14px' }}>
                  No expenses found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ padding: '24px', maxWidth: '500px', width: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 600, color: '#fff', margin: 0 }}>
                {currentExpense.id ? 'Edit Expense' : 'Add New Expense'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} style={{ background: 'transparent', border: 'none', color: '#8b8ba7', cursor: 'pointer' }}>
                <X style={{ width: '20px', height: '20px' }} />
              </button>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', color: '#8b8ba7', marginBottom: '8px' }}>Description</label>
                <input type="text" className="input-base" value={currentExpense.title} onChange={e => setCurrentExpense({...currentExpense, title: e.target.value})} placeholder="e.g. AWS Hosting" />
              </div>

              <div className="responsive-grid-2" style={{ gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', color: '#8b8ba7', marginBottom: '8px' }}>Amount (₹)</label>
                  <input type="number" className="input-base" value={currentExpense.amount || ''} onChange={e => setCurrentExpense({...currentExpense, amount: Number(e.target.value)})} placeholder="e.g. 5000" />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', color: '#8b8ba7', marginBottom: '8px' }}>Category</label>
                  <select className="input-base" style={{ appearance: 'none', textTransform: 'capitalize' }} value={currentExpense.category} onChange={e => setCurrentExpense({...currentExpense, category: e.target.value})}>
                    <option value="hosting">Hosting</option>
                    <option value="ads">Ads</option>
                    <option value="tools">Tools</option>
                    <option value="client-related">Client Related</option>
                    <option value="internet">Internet</option>
                    <option value="travel">Travel</option>
                    <option value="other">Other (Custom)</option>
                  </select>
                  {currentExpense.category === 'other' && (
                    <input 
                      type="text" 
                      className="input-base" 
                      style={{ marginTop: '8px' }} 
                      placeholder="Type custom category..." 
                      value={customCategory} 
                      onChange={e => setCustomCategory(e.target.value)} 
                    />
                  )}
                </div>
              </div>
              
              <div className="responsive-grid-2" style={{ gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', color: '#8b8ba7', marginBottom: '8px' }}>Date</label>
                  <input 
                    type="date" 
                    className="input-base" 
                    value={currentExpense.date} 
                    onChange={e => setCurrentExpense({...currentExpense, date: e.target.value})} 
                    style={{ colorScheme: 'dark' }} 
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', color: '#8b8ba7', marginBottom: '8px' }}>Is this recurring?</label>
                  <div style={{ display: 'flex', alignItems: 'center', height: '42px' }}>
                     <button 
                       onClick={() => setCurrentExpense({...currentExpense, recurring: !currentExpense.recurring})}
                       style={{
                         width: '40px',
                         height: '24px',
                         borderRadius: '12px',
                         background: currentExpense.recurring ? '#6366f1' : 'rgba(255,255,255,0.1)',
                         border: 'none',
                         position: 'relative',
                         cursor: 'pointer',
                         transition: 'all 0.2s ease',
                       }}
                     >
                       <div style={{
                         width: '18px',
                         height: '18px',
                         borderRadius: '50%',
                         background: '#fff',
                         position: 'absolute',
                         top: '3px',
                         left: currentExpense.recurring ? '19px' : '3px',
                         transition: 'all 0.2s ease',
                         boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
                       }} />
                     </button>
                     <span style={{ marginLeft: '12px', fontSize: '13px', color: currentExpense.recurring ? '#fff' : '#8b8ba7' }}>
                       {currentExpense.recurring ? 'Yes, monthly' : 'No, one-time'}
                     </span>
                  </div>
                </div>
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '16px', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '20px' }}>
                <div>
                   {currentExpense.id && (
                     <button onClick={handleDelete} style={{ padding: '9px 18px', borderRadius: '10px', fontSize: '13px', fontWeight: 500, background: 'rgba(244,63,94,0.1)', color: '#f43f5e', border: '1px solid rgba(244,63,94,0.2)', cursor: 'pointer' }}>Delete Expense</button>
                   )}
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button onClick={() => setIsModalOpen(false)} className="btn btn-ghost">Cancel</button>
                  <button onClick={handleSave} className="btn btn-primary" disabled={!currentExpense.title || !currentExpense.amount} style={{ opacity: (!currentExpense.title || !currentExpense.amount) ? 0.5 : 1 }}>
                    {currentExpense.id ? 'Save Changes' : 'Add Expense'}
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
