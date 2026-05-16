import { create } from 'zustand';
import { Lead, Client, Project, Task, Invoice, Expense, Investment, DashboardStats } from '../types';

interface AppState {
  leads: Lead[];
  clients: Client[];
  projects: Project[];
  tasks: Task[];
  invoices: Invoice[];
  expenses: Expense[];
  investments: Investment[];
  stats: DashboardStats;
  
  // UI State
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  setSidebarOpen: (isOpen: boolean) => void;
  
  // Actions
  addLead: (lead: Lead) => void;
  updateLead: (id: string, lead: Partial<Lead>) => void;
  
  addClient: (client: Client) => void;
  updateClient: (id: string, client: Partial<Client>) => void;
  deleteClient: (id: string) => void;

  addProject: (project: Project) => void;
  updateProject: (id: string, project: Partial<Project>) => void;
  deleteProject: (id: string) => void;

  addInvoice: (invoice: any) => void;
  updateInvoice: (id: string, invoice: any) => void;
  deleteInvoice: (id: string) => void;
}

// Mock initial data
const initialClients: Client[] = [
  { 
    id: "1", name: "John Nexus", businessName: "Nexus Properties", status: "active", totalRevenue: 250000, joinedAt: "2024-01-15", 
    email: "contact@nexus.com", phone: "+1 555-0123", services: ["Web Design", "SEO"], tags: ["VIP", "Real Estate"], 
    activityLog: [], createdAt: "2024-01-15", updatedAt: "2024-01-15" 
  },
  { 
    id: "2", name: "Alice Flow", businessName: "Techflow AI", status: "active", totalRevenue: 850000, joinedAt: "2024-02-01", 
    email: "hello@techflow.ai", phone: "+1 555-0124", services: ["AI Integration", "Cloud"], tags: ["SaaS"], 
    activityLog: [], createdAt: "2024-02-01", updatedAt: "2024-02-01" 
  },
  { 
    id: "3", name: "Sarah Bloom", businessName: "Bloom Florals", status: "inactive", totalRevenue: 45000, joinedAt: "2023-11-20", 
    email: "sarah@bloom.com", phone: "+1 555-0125", services: ["Marketing"], tags: ["Local"], 
    activityLog: [], createdAt: "2023-11-20", updatedAt: "2023-11-20" 
  },
  { 
    id: "4", name: "Mike Doe", businessName: "Doe Consulting", status: "active", totalRevenue: 120000, joinedAt: "2024-03-10", 
    email: "mike@doe.co", phone: "+1 555-0126", services: ["Strategy"], tags: ["Consulting"], 
    activityLog: [], createdAt: "2024-03-10", updatedAt: "2024-03-10" 
  },
  { 
    id: "5", name: "Raj Mehta", businessName: "Mehta Legal", status: "active", totalRevenue: 380000, joinedAt: "2024-01-05", 
    email: "raj@mehtalegal.com", phone: "+1 555-0127", services: ["Compliance"], tags: ["Legal"], 
    activityLog: [], createdAt: "2024-01-05", updatedAt: "2024-01-05" 
  },
];

const initialProjects: Project[] = [
  { id: "1", name: "Nexus Corporate Website", clientId: "1", clientName: "John Nexus", type: "website", status: "in-progress", completionPercentage: 65, deadline: "2024-06-15", startDate: "2024-05-01", priority: "high", milestones: [], tasks: [], createdAt: "2024-05-01", updatedAt: "2024-05-01" },
  { id: "2", name: "Techflow Dashboard", clientId: "2", clientName: "Alice Flow", type: "ecommerce", status: "planning", completionPercentage: 15, deadline: "2024-07-30", startDate: "2024-05-10", priority: "medium", milestones: [], tasks: [], createdAt: "2024-05-10", updatedAt: "2024-05-10" },
  { id: "3", name: "Bloom E-commerce", clientId: "3", clientName: "Sarah Bloom", type: "ecommerce", status: "testing", completionPercentage: 90, deadline: "2024-05-20", startDate: "2024-04-15", priority: "high", milestones: [], tasks: [], createdAt: "2024-04-15", updatedAt: "2024-04-15" },
  { id: "4", name: "Doe Landing Page", clientId: "4", clientName: "Mike Doe", type: "landing-page", status: "completed", completionPercentage: 100, deadline: "2024-04-10", startDate: "2024-03-20", priority: "medium", milestones: [], tasks: [], createdAt: "2024-03-20", updatedAt: "2024-03-20" },
  { id: "5", name: "Mehta Legal Portal", clientId: "5", clientName: "Raj Mehta", type: "website", status: "in-progress", completionPercentage: 40, deadline: "2024-08-01", startDate: "2024-05-05", priority: "low", milestones: [], tasks: [], createdAt: "2024-05-05", updatedAt: "2024-05-05" },
];

const initialInvoices: any[] = [
  { 
    id: "inv1", number: "INV-2024-001", client: "John Nexus", clientJobTitle: "CEO", clientCompany: "Nexus Properties", clientAddress: "455 Enterprise Way, Floor 12, Austin, TX", 
    amount: 250000, date: "2024-05-01", due: "2024-05-15", status: "paid", 
    items: [
      { description: "Corporate Website Development", qty: 1, price: 180000 },
      { description: "SEO Strategy & Setup", qty: 1, price: 70000 }
    ]
  },
  { 
    id: "inv2", number: "INV-2024-002", client: "Alice Flow", clientJobTitle: "Product Lead", clientCompany: "Techflow AI", clientAddress: "88 Cloud Lane, San Jose, CA", 
    amount: 850000, date: "2024-05-10", due: "2024-05-24", status: "paid", 
    items: [
      { description: "AI Dashboard UI/UX Design", qty: 1, price: 350000 },
      { description: "Dashboard Implementation (React)", qty: 1, price: 500000 }
    ]
  },
  { 
    id: "inv3", number: "INV-2024-003", client: "Sarah Bloom", clientJobTitle: "Founder", clientCompany: "Bloom Florals", clientAddress: "12 Garden St, Portland, OR", 
    amount: 120000, date: "2024-05-12", due: "2024-05-26", status: "paid", 
    items: [
      { description: "E-commerce Platform Setup", qty: 1, price: 120000 }
    ]
  },
  { 
    id: "inv4", number: "INV-2024-004", client: "Mike Doe", clientJobTitle: "Principal Consultant", clientCompany: "Doe Consulting", clientAddress: "22 Strategy Dr, New York, NY", 
    amount: 45000, date: "2024-04-15", due: "2024-04-29", status: "paid", 
    items: [
      { description: "Conversion Landing Page", qty: 1, price: 45000 }
    ]
  },
  { 
    id: "inv5", number: "INV-2024-005", client: "Raj Mehta", clientJobTitle: "Senior Partner", clientCompany: "Mehta Legal", clientAddress: "99 Justice Square, Coimbatore, TN", 
    amount: 380000, date: "2024-05-16", due: "2024-05-30", status: "paid", 
    items: [
      { description: "Legal Management Portal", qty: 1, price: 300000 },
      { description: "Security Audit & Compliance", qty: 1, price: 80000 }
    ]
  },
];

const initialStats: DashboardStats = {
  totalLeads: 124,
  activeClients: 42,
  completedProjects: 89,
  ongoingProjects: 12,
  pendingPayments: 450000, // in INR
  totalRevenue: 8500000,
  monthlyRevenue: 750000,
  totalExpenses: 210000,
  netProfit: 540000,
  investmentSummary: 1200000,
  conversionRate: 34,
  upcomingRenewals: 8
};

export const useStore = create<AppState>((set) => ({
  leads: [],
  clients: initialClients,
  projects: initialProjects,
  tasks: [],
  invoices: initialInvoices,
  expenses: [],
  investments: [],
  stats: initialStats,
  sidebarOpen: false,

  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setSidebarOpen: (isOpen) => set({ sidebarOpen: isOpen }),

  addLead: (lead) => set((state) => ({ leads: [...state.leads, lead] })),
  updateLead: (id, updatedLead) => set((state) => ({
    leads: state.leads.map(lead => lead.id === id ? { ...lead, ...updatedLead } : lead)
  })),

  addClient: (client) => set((state) => ({ clients: [client, ...state.clients] })),
  updateClient: (id, updatedClient) => set((state) => ({
    clients: state.clients.map(c => c.id === id ? { ...c, ...updatedClient } : c)
  })),
  deleteClient: (id) => set((state) => ({
    clients: state.clients.filter(c => c.id !== id)
  })),

  addProject: (project) => set((state) => ({ projects: [project, ...state.projects] })),
  updateProject: (id, updatedProject) => set((state) => ({
    projects: state.projects.map(p => p.id === id ? { ...p, ...updatedProject } : p)
  })),
  deleteProject: (id) => set((state) => ({
    projects: state.projects.filter(p => p.id !== id)
  })),

  addInvoice: (invoice) => set((state) => ({ invoices: [invoice, ...state.invoices] })),
  updateInvoice: (id, updatedInvoice) => set((state) => ({
    invoices: state.invoices.map(inv => inv.id === id ? { ...inv, ...updatedInvoice } : inv)
  })),
  deleteInvoice: (id) => set((state) => ({
    invoices: state.invoices.filter(inv => inv.id !== id)
  }))
}));
