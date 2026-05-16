// types/index.ts - All TypeScript types for AgencyOS

export type LeadStatus =
  | "new"
  | "contacted"
  | "interested"
  | "follow-up"
  | "proposal-sent"
  | "negotiation"
  | "converted"
  | "rejected"
  | "inactive";

export type LeadSource =
  | "instagram"
  | "referral"
  | "whatsapp"
  | "direct"
  | "cold-outreach"
  | "linkedin"
  | "facebook"
  | "google"
  | "client-referral";

export type Priority = "low" | "medium" | "high" | "urgent";

export interface Lead {
  id: string;
  leadId: string;
  clientName: string;
  businessName: string;
  phone: string;
  email: string;
  whatsapp?: string;
  instagram?: string;
  address?: string;
  source: LeadSource;
  status: LeadStatus;
  priority: Priority;
  notes?: string;
  followUpDate?: string;
  tags: string[];
  estimatedValue?: number;
  activityLog: ActivityEntry[];
  createdAt: string;
  updatedAt: string;
}

export type ClientStatus = "active" | "inactive" | "churned" | "prospect";

export interface Client {
  id: string;
  name: string;
  businessName: string;
  email: string;
  phone: string;
  whatsapp?: string;
  address?: string;
  status: ClientStatus;
  services: string[];
  totalRevenue: number;
  joinedAt: string;
  websiteUrl?: string;
  websiteCredentials?: Credentials;
  hostingCredentials?: Credentials;
  domainDetails?: DomainDetail[];
  gbpDetails?: GBPDetail;
  tags: string[];
  notes?: string;
  activityLog: ActivityEntry[];
  createdAt: string;
  updatedAt: string;
}

export interface Credentials {
  platform?: string;
  loginUrl?: string;
  username?: string;
  password?: string;
  notes?: string;
}

export interface DomainDetail {
  domain: string;
  registrar?: string;
  expiryDate?: string;
  autoRenew?: boolean;
}

export interface GBPDetail {
  businessName: string;
  profileUrl?: string;
  category?: string;
  verificationStatus?: "verified" | "pending" | "not-verified";
  lastOptimized?: string;
}

export type ProjectStatus =
  | "pending"
  | "planning"
  | "in-progress"
  | "waiting-client"
  | "revision"
  | "testing"
  | "deployed"
  | "completed"
  | "archived";

export type ProjectType =
  | "website"
  | "ecommerce"
  | "landing-page"
  | "seo"
  | "gbp"
  | "branding"
  | "maintenance"
  | "other";

export interface Milestone {
  id: string;
  title: string;
  completed: boolean;
  dueDate?: string;
}

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  priority: Priority;
  dueDate?: string;
  notes?: string;
}

export interface Project {
  id: string;
  name: string;
  type: ProjectType;
  clientId: string;
  clientName: string;
  startDate: string;
  deadline?: string;
  status: ProjectStatus;
  priority: Priority;
  completionPercentage: number;
  milestones: Milestone[];
  tasks: Task[];
  githubUrl?: string;
  vercelUrl?: string;
  liveUrl?: string;
  domainStatus?: string;
  seoProgress?: number;
  notes?: string;
  budget?: number;
  invoiceId?: string;
  createdAt: string;
  updatedAt: string;
}

export type InvoiceStatus = "draft" | "sent" | "viewed" | "paid" | "overdue" | "cancelled";

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  clientId: string;
  clientName: string;
  clientEmail?: string;
  clientAddress?: string;
  clientGST?: string;
  projectId?: string;
  status: InvoiceStatus;
  items: InvoiceItem[];
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  discount: number;
  total: number;
  currency: string;
  issueDate: string;
  dueDate: string;
  paidDate?: string;
  notes?: string;
  paymentMethod?: string;
  paymentReference?: string;
  createdAt: string;
  updatedAt: string;
}

export type ExpenseCategory =
  | "domains"
  | "hosting"
  | "subscriptions"
  | "travel"
  | "internet"
  | "tools"
  | "ads"
  | "client-related"
  | "personal"
  | "investments"
  | "other";

export interface Expense {
  id: string;
  title: string;
  category: ExpenseCategory;
  amount: number;
  date: string;
  isRecurring: boolean;
  recurringPeriod?: "monthly" | "yearly" | "weekly";
  notes?: string;
  receiptUrl?: string;
  createdAt: string;
}

export type InvestmentType =
  | "stocks"
  | "sip"
  | "mutual-fund"
  | "gold"
  | "silver"
  | "crypto"
  | "fd"
  | "ppf"
  | "real-estate"
  | "other";

export interface Investment {
  id: string;
  name: string;
  type: InvestmentType;
  investedAmount: number;
  currentValue: number;
  investmentDate: string;
  platform?: string;
  notes?: string;
  units?: number;
  avgPrice?: number;
  createdAt: string;
  updatedAt: string;
}

export interface ActivityEntry {
  id: string;
  type: "note" | "call" | "email" | "meeting" | "status-change" | "payment" | "other";
  description: string;
  timestamp: string;
  metadata?: Record<string, string | number | boolean>;
}

export interface ReminderTask {
  id: string;
  title: string;
  description?: string;
  type: "follow-up" | "meeting" | "renewal" | "payment" | "deadline" | "callback" | "other";
  priority: Priority;
  dueDate: string;
  isCompleted: boolean;
  isRecurring: boolean;
  recurringPeriod?: "daily" | "weekly" | "monthly";
  relatedId?: string;
  relatedType?: "lead" | "client" | "project" | "invoice";
  createdAt: string;
}

export interface SEOClient {
  id: string;
  clientId: string;
  clientName: string;
  keywords: SEOKeyword[];
  backlinks: number;
  domainAuthority?: number;
  lastAuditDate?: string;
  indexedPages?: number;
  gbpOptimized: boolean;
  metaOptimized: boolean;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SEOKeyword {
  id: string;
  keyword: string;
  currentRank?: number;
  targetRank?: number;
  searchVolume?: number;
  lastChecked?: string;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  category: "idea" | "plan" | "pricing" | "feature" | "client" | "roadmap" | "content" | "other";
  isPinned: boolean;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Document {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string;
  folder: string;
  tags: string[];
  isEncrypted?: boolean;
  uploadedAt: string;
}

export interface DashboardStats {
  totalLeads: number;
  activeClients: number;
  completedProjects: number;
  ongoingProjects: number;
  pendingPayments: number;
  totalRevenue: number;
  monthlyRevenue: number;
  totalExpenses: number;
  netProfit: number;
  investmentSummary: number;
  conversionRate: number;
  upcomingRenewals: number;
}
