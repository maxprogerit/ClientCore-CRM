export type DealStage = "New" | "Qualified" | "Proposal" | "Negotiation" | "Won" | "Lost";
export type ClientStatus = "Active" | "At Risk" | "Prospect" | "Inactive";
export type EventType = "meeting" | "task" | "deadline" | "follow-up" | "reminder";

export interface ActivityItem {
  id: string;
  date: string;
  text: string;
}

export interface Client {
  id: string;
  name: string;
  email: string;
  companyId: string;
  status: ClientStatus;
  industry: string;
  dealValue: number;
  lastContact: string;
  aiScore: number;
  tags: string[];
  notes: string;
  contactIds: string[];
  dealIds: string[];
  activity: ActivityItem[];
}

export interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  companyId: string;
  clientId: string;
  lastCommunication: string;
  tags: string[];
  notes: string;
  communicationHistory: ActivityItem[];
}

export interface Deal {
  id: string;
  title: string;
  clientId: string;
  companyId: string;
  stage: DealStage;
  value: number;
  probability: number;
  ownerId: string;
  expectedClose: string;
}

export interface Company {
  id: string;
  name: string;
  industry: string;
  revenue: number;
  employees: number;
  clientStatus: ClientStatus;
  healthScore: number;
  contracts: number;
  linkedContactIds: string[];
  linkedDealIds: string[];
  activity: ActivityItem[];
}

export interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  type: EventType;
  linkedClientId?: string;
  linkedDealId?: string;
  notes?: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  permissions: string[];
  productivity: number;
  dealsClosed: number;
  revenueGenerated: number;
  tasksCompleted: number;
  winRate: number;
}

export interface AppNotification {
  id: string;
  text: string;
  date: string;
  read: boolean;
}

export interface AssistantMessage {
  id: string;
  sender: "user" | "assistant";
  text: string;
}

export interface AppSettings {
  profileName: string;
  workspaceName: string;
  billingPlan: "Starter" | "Pro" | "Enterprise";
  theme: "dark" | "dark-ocean";
  notificationsEnabled: boolean;
  securityAlerts: boolean;
  connectedApps: string[];
}
