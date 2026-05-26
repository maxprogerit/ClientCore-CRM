import { createContext, ReactNode, useContext, useMemo, useReducer } from "react";
import {
  AppNotification,
  AppSettings,
  AssistantMessage,
  CalendarEvent,
  Client,
  Company,
  Contact,
  Deal,
  DealStage,
  TeamMember
} from "../types";
import { assistantSeed, clientsSeed, companiesSeed, contactsSeed, dealsSeed, eventsSeed, notificationsSeed, settingsSeed, teamSeed } from "../data/mockData";
import { makeId, today } from "../utils/format";

interface CrmState {
  clients: Client[];
  contacts: Contact[];
  companies: Company[];
  deals: Deal[];
  events: CalendarEvent[];
  team: TeamMember[];
  notifications: AppNotification[];
  settings: AppSettings;
  assistantMessages: AssistantMessage[];
  toasts: { id: string; text: string }[];
  loading: boolean;
}

type Action =
  | { type: "set-loading"; payload: boolean }
  | { type: "add-client"; payload: Client }
  | { type: "update-client"; payload: Client }
  | { type: "delete-client"; payload: string }
  | { type: "add-deal"; payload: Deal }
  | { type: "update-deal"; payload: Deal }
  | { type: "move-deal"; payload: { id: string; stage: DealStage } }
  | { type: "add-contact"; payload: Contact }
  | { type: "update-contact"; payload: Contact }
  | { type: "add-company"; payload: Company }
  | { type: "update-company"; payload: Company }
  | { type: "add-event"; payload: CalendarEvent }
  | { type: "update-event"; payload: CalendarEvent }
  | { type: "add-team-member"; payload: TeamMember }
  | { type: "update-team-member"; payload: TeamMember }
  | { type: "update-settings"; payload: Partial<AppSettings> }
  | { type: "assistant-message"; payload: AssistantMessage }
  | { type: "notify"; payload: string }
  | { type: "dismiss-toast"; payload: string };

const initialState: CrmState = {
  clients: clientsSeed,
  contacts: contactsSeed,
  companies: companiesSeed,
  deals: dealsSeed,
  events: eventsSeed,
  team: teamSeed,
  notifications: notificationsSeed,
  settings: settingsSeed,
  assistantMessages: assistantSeed,
  toasts: [],
  loading: false
};

const CrmContext = createContext<{
  state: CrmState;
  actions: {
    addClient: (input: Omit<Client, "id" | "activity" | "contactIds" | "dealIds">) => void;
    updateClient: (client: Client) => void;
    deleteClient: (id: string) => void;
    addDeal: (input: Omit<Deal, "id">) => void;
    updateDeal: (deal: Deal) => void;
    moveDeal: (id: string, stage: DealStage) => void;
    addContact: (input: Omit<Contact, "id" | "communicationHistory">) => void;
    updateContact: (contact: Contact) => void;
    addCompany: (input: Omit<Company, "id" | "activity" | "linkedContactIds" | "linkedDealIds">) => void;
    updateCompany: (company: Company) => void;
    addEvent: (input: Omit<CalendarEvent, "id">) => void;
    updateEvent: (event: CalendarEvent) => void;
    addTeamMember: (input: Omit<TeamMember, "id">) => void;
    updateTeamMember: (member: TeamMember) => void;
    updateSettings: (settings: Partial<AppSettings>) => void;
    sendAssistantMessage: (text: string) => void;
    dismissToast: (id: string) => void;
  };
  selectors: {
    totalRevenue: number;
    activeDeals: number;
    winRate: number;
    pipelineValue: number;
    topClients: Client[];
    upcomingEvents: CalendarEvent[];
  };
} | null>(null);

function reducer(state: CrmState, action: Action): CrmState {
  switch (action.type) {
    case "set-loading":
      return { ...state, loading: action.payload };
    case "add-client":
      return {
        ...state,
        clients: [action.payload, ...state.clients]
      };
    case "update-client":
      return {
        ...state,
        clients: state.clients.map((c) => (c.id === action.payload.id ? action.payload : c))
      };
    case "delete-client":
      return {
        ...state,
        clients: state.clients.filter((c) => c.id !== action.payload),
        contacts: state.contacts.filter((c) => c.clientId !== action.payload),
        deals: state.deals.filter((d) => d.clientId !== action.payload),
        events: state.events.filter((e) => e.linkedClientId !== action.payload)
      };
    case "add-deal":
      return {
        ...state,
        deals: [action.payload, ...state.deals],
        clients: state.clients.map((c) =>
          c.id === action.payload.clientId ? { ...c, dealIds: [...c.dealIds, action.payload.id], dealValue: c.dealValue + action.payload.value } : c
        ),
        companies: state.companies.map((c) =>
          c.id === action.payload.companyId ? { ...c, linkedDealIds: [...c.linkedDealIds, action.payload.id] } : c
        )
      };
    case "update-deal":
      return {
        ...state,
        deals: state.deals.map((d) => (d.id === action.payload.id ? action.payload : d))
      };
    case "move-deal":
      return {
        ...state,
        deals: state.deals.map((d) => (d.id === action.payload.id ? { ...d, stage: action.payload.stage } : d))
      };
    case "add-contact":
      return {
        ...state,
        contacts: [action.payload, ...state.contacts],
        clients: state.clients.map((c) => (c.id === action.payload.clientId ? { ...c, contactIds: [...c.contactIds, action.payload.id] } : c)),
        companies: state.companies.map((c) =>
          c.id === action.payload.companyId ? { ...c, linkedContactIds: [...c.linkedContactIds, action.payload.id] } : c
        )
      };
    case "update-contact":
      return {
        ...state,
        contacts: state.contacts.map((c) => (c.id === action.payload.id ? action.payload : c))
      };
    case "add-company":
      return {
        ...state,
        companies: [action.payload, ...state.companies]
      };
    case "update-company":
      return {
        ...state,
        companies: state.companies.map((c) => (c.id === action.payload.id ? action.payload : c))
      };
    case "add-event":
      return {
        ...state,
        events: [action.payload, ...state.events],
        clients: state.clients.map((c) =>
          c.id === action.payload.linkedClientId
            ? {
                ...c,
                activity: [{ id: makeId("activity"), date: action.payload.date, text: `Scheduled ${action.payload.type}: ${action.payload.title}` }, ...c.activity]
              }
            : c
        )
      };
    case "update-event":
      return {
        ...state,
        events: state.events.map((event) => (event.id === action.payload.id ? action.payload : event))
      };
    case "add-team-member":
      return {
        ...state,
        team: [action.payload, ...state.team]
      };
    case "update-team-member":
      return {
        ...state,
        team: state.team.map((m) => (m.id === action.payload.id ? action.payload : m))
      };
    case "update-settings":
      return {
        ...state,
        settings: { ...state.settings, ...action.payload }
      };
    case "assistant-message":
      return {
        ...state,
        assistantMessages: [...state.assistantMessages, action.payload]
      };
    case "notify":
      return {
        ...state,
        notifications: [{ id: makeId("note"), text: action.payload, date: today(), read: false }, ...state.notifications],
        toasts: [...state.toasts, { id: makeId("toast"), text: action.payload }]
      };
    case "dismiss-toast":
      return { ...state, toasts: state.toasts.filter((t) => t.id !== action.payload) };
    default:
      return state;
  }
}

function smartAssistantResponse(text: string, state: CrmState): string {
  const lower = text.toLowerCase();
  const openDeals = state.deals.filter((d) => !["Won", "Lost"].includes(d.stage));
  const highValueClients = state.clients.filter((c) => c.dealValue > 120000);
  if (lower.includes("activity")) {
    const recent = state.clients.flatMap((c) => c.activity.slice(0, 1)).slice(0, 3).map((a) => `• ${a.text}`);
    return `Today's client activity highlights:\n${recent.join("\n") || "• No major activity logged yet."}`;
  }
  if (lower.includes("attention")) {
    const attentionDeals = openDeals.filter((d) => d.probability < 60).map((d) => `• ${d.title} (${d.stage}, ${d.probability}% probability)`);
    return attentionDeals.length ? `Deals needing attention:\n${attentionDeals.join("\n")}` : "No critical deal risk detected right now.";
  }
  if (lower.includes("forecast")) {
    const forecast = openDeals.reduce((sum, deal) => sum + deal.value * (deal.probability / 100), 0);
    return `Projected weighted revenue is $${Math.round(forecast).toLocaleString()} based on current pipeline probabilities.`;
  }
  if (lower.includes("high value")) {
    return `High value clients: ${highValueClients.map((c) => c.name).join(", ") || "none at this threshold."}`;
  }
  if (lower.includes("follow")) {
    const follow = state.events.filter((event) => event.type === "follow-up" || event.type === "meeting").slice(0, 3);
    return follow.length
      ? `Suggested follow-ups:\n${follow.map((event) => `• ${event.title} on ${event.date} ${event.time}`).join("\n")}`
      : "No pending follow-ups found; create one from Calendar.";
  }
  return "Pipeline is healthy overall. I recommend prioritizing low-probability negotiations and scheduling follow-ups for at-risk accounts.";
}

export function CrmProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const actions = useMemo(
    () => ({
      addClient: (input: Omit<Client, "id" | "activity" | "contactIds" | "dealIds">) => {
        const client: Client = {
          ...input,
          id: makeId("cl"),
          activity: [{ id: makeId("act"), date: today(), text: "Client profile created" }],
          contactIds: [],
          dealIds: []
        };
        dispatch({ type: "add-client", payload: client });
        dispatch({ type: "notify", payload: `Client added: ${client.name}` });
      },
      updateClient: (client: Client) => {
        dispatch({ type: "update-client", payload: client });
        dispatch({ type: "notify", payload: `Client updated: ${client.name}` });
      },
      deleteClient: (id: string) => {
        const target = state.clients.find((c) => c.id === id);
        dispatch({ type: "delete-client", payload: id });
        dispatch({ type: "notify", payload: `Client removed: ${target?.name ?? "Unknown"}` });
      },
      addDeal: (input: Omit<Deal, "id">) => {
        const deal: Deal = { ...input, id: makeId("dl") };
        dispatch({ type: "add-deal", payload: deal });
        dispatch({ type: "notify", payload: `Deal created: ${deal.title}` });
      },
      updateDeal: (deal: Deal) => {
        dispatch({ type: "update-deal", payload: deal });
        dispatch({ type: "notify", payload: `Deal updated: ${deal.title}` });
      },
      moveDeal: (id: string, stage: DealStage) => {
        const deal = state.deals.find((d) => d.id === id);
        dispatch({ type: "move-deal", payload: { id, stage } });
        dispatch({ type: "notify", payload: `${deal?.title ?? "Deal"} moved to ${stage}` });
      },
      addContact: (input: Omit<Contact, "id" | "communicationHistory">) => {
        const contact: Contact = {
          ...input,
          id: makeId("ct"),
          communicationHistory: [{ id: makeId("com"), date: today(), text: "Contact created" }]
        };
        dispatch({ type: "add-contact", payload: contact });
        dispatch({ type: "notify", payload: `Contact added: ${contact.name}` });
      },
      updateContact: (contact: Contact) => {
        dispatch({ type: "update-contact", payload: contact });
        dispatch({ type: "notify", payload: `Contact updated: ${contact.name}` });
      },
      addCompany: (input: Omit<Company, "id" | "activity" | "linkedContactIds" | "linkedDealIds">) => {
        const company: Company = {
          ...input,
          id: makeId("co"),
          activity: [{ id: makeId("co-act"), date: today(), text: "Company record created" }],
          linkedContactIds: [],
          linkedDealIds: []
        };
        dispatch({ type: "add-company", payload: company });
        dispatch({ type: "notify", payload: `Company added: ${company.name}` });
      },
      updateCompany: (company: Company) => {
        dispatch({ type: "update-company", payload: company });
        dispatch({ type: "notify", payload: `Company updated: ${company.name}` });
      },
      addEvent: (input: Omit<CalendarEvent, "id">) => {
        const event = { ...input, id: makeId("ev") };
        dispatch({ type: "add-event", payload: event });
        dispatch({ type: "notify", payload: `Calendar event created: ${event.title}` });
      },
      updateEvent: (event: CalendarEvent) => {
        dispatch({ type: "update-event", payload: event });
        dispatch({ type: "notify", payload: `Calendar event updated: ${event.title}` });
      },
      addTeamMember: (input: Omit<TeamMember, "id">) => {
        const member = { ...input, id: makeId("tm") };
        dispatch({ type: "add-team-member", payload: member });
        dispatch({ type: "notify", payload: `Team member added: ${member.name}` });
      },
      updateTeamMember: (member: TeamMember) => {
        dispatch({ type: "update-team-member", payload: member });
        dispatch({ type: "notify", payload: `Team member updated: ${member.name}` });
      },
      updateSettings: (settings: Partial<AppSettings>) => {
        dispatch({ type: "update-settings", payload: settings });
        dispatch({ type: "notify", payload: "Settings saved successfully" });
      },
      sendAssistantMessage: (text: string) => {
        const userMessage: AssistantMessage = { id: makeId("msg"), sender: "user", text };
        dispatch({ type: "assistant-message", payload: userMessage });
        const response: AssistantMessage = { id: makeId("msg"), sender: "assistant", text: smartAssistantResponse(text, state) };
        dispatch({ type: "assistant-message", payload: response });
      },
      dismissToast: (id: string) => dispatch({ type: "dismiss-toast", payload: id })
    }),
    [state]
  );

  const selectors = useMemo(() => {
    const wonDeals = state.deals.filter((deal) => deal.stage === "Won");
    const totalRevenue = wonDeals.reduce((sum, deal) => sum + deal.value, 0);
    const openDeals = state.deals.filter((deal) => !["Won", "Lost"].includes(deal.stage));
    const activeDeals = openDeals.length;
    const closedDeals = state.deals.filter((deal) => ["Won", "Lost"].includes(deal.stage));
    const winRate = closedDeals.length ? (wonDeals.length / closedDeals.length) * 100 : 0;
    const pipelineValue = openDeals.reduce((sum, deal) => sum + deal.value, 0);
    const topClients = [...state.clients].sort((a, b) => b.dealValue - a.dealValue).slice(0, 5);
    const upcomingEvents = [...state.events].sort((a, b) => `${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`)).slice(0, 5);
    return { totalRevenue, activeDeals, winRate, pipelineValue, topClients, upcomingEvents };
  }, [state.clients, state.deals, state.events]);

  return <CrmContext.Provider value={{ state, actions, selectors }}>{children}</CrmContext.Provider>;
}

export function useCrm() {
  const context = useContext(CrmContext);
  if (!context) {
    throw new Error("useCrm must be used within CrmProvider");
  }
  return context;
}
