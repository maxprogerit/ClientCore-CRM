import { AppNotification, AppSettings, AssistantMessage, CalendarEvent, Client, Company, Contact, Deal, TeamMember } from "../types";

export const teamSeed: TeamMember[] = [
  {
    id: "tm-1",
    name: "Sofia Martinez",
    role: "VP Sales",
    permissions: ["Admin", "Billing", "Reports"],
    productivity: 97,
    dealsClosed: 19,
    revenueGenerated: 840000,
    tasksCompleted: 124,
    winRate: 72
  },
  {
    id: "tm-2",
    name: "Ethan Brown",
    role: "Account Executive",
    permissions: ["Deals", "Clients"],
    productivity: 91,
    dealsClosed: 14,
    revenueGenerated: 540000,
    tasksCompleted: 101,
    winRate: 68
  },
  {
    id: "tm-3",
    name: "Maya Chen",
    role: "Customer Success Lead",
    permissions: ["Clients", "Calendar"],
    productivity: 94,
    dealsClosed: 11,
    revenueGenerated: 460000,
    tasksCompleted: 136,
    winRate: 74
  }
];

export const companiesSeed: Company[] = [
  {
    id: "co-1",
    name: "Acme Global",
    industry: "Fintech",
    revenue: 24000000,
    employees: 420,
    clientStatus: "Active",
    healthScore: 93,
    contracts: 4,
    linkedContactIds: ["ct-1", "ct-2"],
    linkedDealIds: ["dl-1", "dl-2"],
    activity: [
      { id: "a1", date: "2026-05-24", text: "Q2 enterprise expansion call completed" },
      { id: "a2", date: "2026-05-20", text: "Renewal terms draft shared" }
    ]
  },
  {
    id: "co-2",
    name: "Northwind Labs",
    industry: "Healthcare SaaS",
    revenue: 8200000,
    employees: 180,
    clientStatus: "At Risk",
    healthScore: 71,
    contracts: 2,
    linkedContactIds: ["ct-3"],
    linkedDealIds: ["dl-3"],
    activity: [{ id: "a3", date: "2026-05-22", text: "Support escalation resolved" }]
  },
  {
    id: "co-3",
    name: "Helio Agency",
    industry: "Marketing",
    revenue: 5200000,
    employees: 96,
    clientStatus: "Active",
    healthScore: 88,
    contracts: 3,
    linkedContactIds: ["ct-4"],
    linkedDealIds: ["dl-4"],
    activity: [{ id: "a4", date: "2026-05-25", text: "Campaign analytics sync delivered" }]
  }
];

export const contactsSeed: Contact[] = [
  {
    id: "ct-1",
    name: "Olivia Stone",
    email: "olivia@acmeglobal.com",
    phone: "+1 415 220 1890",
    role: "Head of Operations",
    companyId: "co-1",
    clientId: "cl-1",
    lastCommunication: "2026-05-25",
    tags: ["Enterprise", "Decision Maker"],
    notes: "Interested in AI forecasting rollout in July.",
    communicationHistory: [
      { id: "h1", date: "2026-05-25", text: "Discussed onboarding timeline for APAC teams" },
      { id: "h2", date: "2026-05-21", text: "Shared proposal revision with legal team" }
    ]
  },
  {
    id: "ct-2",
    name: "Liam Brooks",
    email: "liam@acmeglobal.com",
    phone: "+1 415 220 1992",
    role: "Finance Director",
    companyId: "co-1",
    clientId: "cl-1",
    lastCommunication: "2026-05-23",
    tags: ["Finance"],
    notes: "Needs billing consolidation per region.",
    communicationHistory: [{ id: "h3", date: "2026-05-23", text: "Reviewed pricing tiers" }]
  },
  {
    id: "ct-3",
    name: "Noah Green",
    email: "noah@northwindlabs.com",
    phone: "+1 206 119 2019",
    role: "COO",
    companyId: "co-2",
    clientId: "cl-2",
    lastCommunication: "2026-05-20",
    tags: ["Retention Risk"],
    notes: "Concerned about SLA response time.",
    communicationHistory: [{ id: "h4", date: "2026-05-20", text: "Escalation call regarding support backlog" }]
  },
  {
    id: "ct-4",
    name: "Emma Shaw",
    email: "emma@helioagency.com",
    phone: "+44 20 9811 2290",
    role: "Growth Lead",
    companyId: "co-3",
    clientId: "cl-3",
    lastCommunication: "2026-05-26",
    tags: ["Upsell"],
    notes: "Ready for premium automation package.",
    communicationHistory: [{ id: "h5", date: "2026-05-26", text: "Approved campaign attribution pilot" }]
  }
];

export const dealsSeed: Deal[] = [
  {
    id: "dl-1",
    title: "Acme Global Expansion",
    clientId: "cl-1",
    companyId: "co-1",
    stage: "Negotiation",
    value: 220000,
    probability: 82,
    ownerId: "tm-1",
    expectedClose: "2026-06-12"
  },
  {
    id: "dl-2",
    title: "Acme Forecasting Add-on",
    clientId: "cl-1",
    companyId: "co-1",
    stage: "Proposal",
    value: 110000,
    probability: 64,
    ownerId: "tm-2",
    expectedClose: "2026-06-22"
  },
  {
    id: "dl-3",
    title: "Northwind Renewal",
    clientId: "cl-2",
    companyId: "co-2",
    stage: "Qualified",
    value: 90000,
    probability: 58,
    ownerId: "tm-3",
    expectedClose: "2026-07-02"
  },
  {
    id: "dl-4",
    title: "Helio Pro Automation",
    clientId: "cl-3",
    companyId: "co-3",
    stage: "Won",
    value: 130000,
    probability: 100,
    ownerId: "tm-2",
    expectedClose: "2026-05-18"
  }
];

export const clientsSeed: Client[] = [
  {
    id: "cl-1",
    name: "Acme Global Account",
    email: "enterprise@acmeglobal.com",
    companyId: "co-1",
    status: "Active",
    industry: "Fintech",
    dealValue: 330000,
    lastContact: "2026-05-25",
    aiScore: 94,
    tags: ["Enterprise", "Expansion"],
    notes: "Strong multi-region growth potential.",
    contactIds: ["ct-1", "ct-2"],
    dealIds: ["dl-1", "dl-2"],
    activity: [
      { id: "ca1", date: "2026-05-25", text: "Leadership sync completed" },
      { id: "ca2", date: "2026-05-22", text: "AI forecast feature walkthrough" }
    ]
  },
  {
    id: "cl-2",
    name: "Northwind Strategic",
    email: "success@northwindlabs.com",
    companyId: "co-2",
    status: "At Risk",
    industry: "Healthcare SaaS",
    dealValue: 90000,
    lastContact: "2026-05-20",
    aiScore: 72,
    tags: ["Renewal", "Support"],
    notes: "Needs confidence on reliability metrics.",
    contactIds: ["ct-3"],
    dealIds: ["dl-3"],
    activity: [{ id: "ca3", date: "2026-05-20", text: "Escalation mitigation call" }]
  },
  {
    id: "cl-3",
    name: "Helio Growth",
    email: "partnerships@helioagency.com",
    companyId: "co-3",
    status: "Active",
    industry: "Marketing",
    dealValue: 130000,
    lastContact: "2026-05-26",
    aiScore: 90,
    tags: ["Upsell", "Automation"],
    notes: "Excellent adoption and campaign performance.",
    contactIds: ["ct-4"],
    dealIds: ["dl-4"],
    activity: [{ id: "ca4", date: "2026-05-26", text: "Pilot report approved" }]
  }
];

export const eventsSeed: CalendarEvent[] = [
  {
    id: "ev-1",
    title: "Acme Negotiation Call",
    date: "2026-05-28",
    time: "10:30",
    type: "meeting",
    linkedClientId: "cl-1",
    linkedDealId: "dl-1"
  },
  {
    id: "ev-2",
    title: "Northwind Follow-up Plan",
    date: "2026-05-29",
    time: "13:00",
    type: "follow-up",
    linkedClientId: "cl-2",
    linkedDealId: "dl-3"
  },
  {
    id: "ev-3",
    title: "Monthly Revenue Review",
    date: "2026-05-30",
    time: "16:00",
    type: "task",
    notes: "Prepare board-ready KPI summary."
  }
];

export const notificationsSeed: AppNotification[] = [
  { id: "n-1", text: "Acme Global moved to Negotiation stage", date: "2026-05-25", read: false },
  { id: "n-2", text: "Helio Pro Automation marked as Won", date: "2026-05-18", read: true }
];

export const settingsSeed: AppSettings = {
  profileName: "Sofia Martinez",
  workspaceName: "ClientCore Enterprise",
  billingPlan: "Enterprise",
  theme: "dark-ocean",
  notificationsEnabled: true,
  securityAlerts: true,
  connectedApps: ["Slack", "Google Calendar", "Stripe"]
};

export const assistantSeed: AssistantMessage[] = [
  { id: "m-1", sender: "assistant", text: "I can summarize pipeline health, suggest follow-ups, and highlight high-value opportunities." }
];
