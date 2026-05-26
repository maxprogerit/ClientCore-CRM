import { useEffect, useMemo, useState } from "react";
import { Bell, BriefcaseBusiness, Building2, Calendar, ChartColumnBig, ClipboardList, ContactRound, Crown, LayoutDashboard, Search, Settings, Users } from "lucide-react";
import { NavLink, Route, Routes, useLocation } from "react-router-dom";
import { AiAssistant } from "./components/AiAssistant";
import { LoadingSkeleton, ToastStack } from "./components/common";
import { AnalyticsPage } from "./pages/AnalyticsPage";
import { CalendarPage } from "./pages/CalendarPage";
import { ClientsPage } from "./pages/ClientsPage";
import { CompaniesPage } from "./pages/CompaniesPage";
import { ContactsPage } from "./pages/ContactsPage";
import { DashboardPage } from "./pages/DashboardPage";
import { DealsPage } from "./pages/DealsPage";
import { ReportsPage } from "./pages/ReportsPage";
import { SettingsPage } from "./pages/SettingsPage";
import { TeamPage } from "./pages/TeamPage";
import { useCrm } from "./store/CrmContext";

const navItems = [
  ["Dashboard", "/dashboard", LayoutDashboard],
  ["Clients", "/clients", Users],
  ["Deals", "/deals", BriefcaseBusiness],
  ["Contacts", "/contacts", ContactRound],
  ["Companies", "/companies", Building2],
  ["Calendar", "/calendar", Calendar],
  ["Reports", "/reports", ClipboardList],
  ["Analytics", "/analytics", ChartColumnBig],
  ["Team", "/team", Users],
  ["Settings", "/settings", Settings]
] as const;

function App() {
  const { state, actions } = useCrm();
  const location = useLocation();
  const [search, setSearch] = useState("");
  const [showLoader, setShowLoader] = useState(true);

  useEffect(() => {
    setShowLoader(true);
    const timer = setTimeout(() => setShowLoader(false), 350);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  const filteredNotifications = useMemo(
    () => (state.settings.notificationsEnabled ? state.notifications : []),
    [state.notifications, state.settings.notificationsEnabled]
  );

  return (
    <div className={`min-h-screen p-5 ${state.settings.theme === "dark-ocean" ? "bg-radial" : ""}`}>
      <ToastStack toasts={state.toasts} dismiss={actions.dismissToast} />
      <div className="mx-auto flex max-w-[1600px] gap-5">
        <aside className="glass sticky top-5 h-[calc(100vh-2.5rem)] w-72 p-4 flex flex-col">
          <div className="mb-6 px-2">
            <p className="text-xs uppercase tracking-[0.3em] text-cyan/80">{state.settings.workspaceName}</p>
            <h1 className="text-2xl font-bold">Enterprise OS</h1>
          </div>
          <nav className="space-y-1">
            {navItems.map(([label, path, Icon]) => (
              <NavLink
                key={path}
                to={path}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-xl px-3 py-2 transition ${
                    isActive ? "bg-electric/30 text-cyan border border-cyan/50" : "hover:bg-white/5 text-slate-200"
                  }`
                }
              >
                <Icon size={18} />
                {label}
              </NavLink>
            ))}
          </nav>
          <div className={`mt-auto glass p-4 ${state.settings.billingPlan !== "Starter" ? "border-cyan/30" : ""}`}>
            <p className="font-semibold">{state.settings.billingPlan === "Starter" ? "Upgrade to Pro" : `${state.settings.billingPlan} Plan`}</p>
            <p className="text-sm text-slate-300 mt-1">
              {state.settings.billingPlan === "Starter" ? "Unlock advanced features and insights" : "Advanced features and insights are active"}
            </p>
            <button className="mt-3 w-full rounded-xl bg-gradient-to-r from-cyan to-electric px-3 py-2 font-semibold text-black shadow-glow">
              <Crown className="inline mr-2" size={16} />
              {state.settings.billingPlan === "Starter" ? "Activate Premium" : "Manage Billing"}
            </button>
          </div>
        </aside>

        <main className="flex-1 space-y-5">
          <header className="glass flex items-center justify-between p-4 gap-4">
            <div className="flex items-center gap-3 rounded-xl bg-white/5 px-3 py-2 w-[420px]">
              <Search size={16} />
              <input
                className="bg-transparent outline-none w-full text-sm"
                placeholder="Advanced search clients, deals, reports..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </div>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Bell className={state.settings.notificationsEnabled ? "text-cyan" : "text-slate-500"} />
                {filteredNotifications.filter((note) => !note.read).length > 0 && (
                  <span className="absolute -right-1 -top-1 bg-cyan text-black text-[10px] rounded-full h-4 w-4 inline-flex items-center justify-center">
                    {filteredNotifications.filter((note) => !note.read).length}
                  </span>
                )}
              </div>
              <div className="text-right">
                <p className="text-sm">{state.settings.profileName}</p>
                <p className="text-xs text-slate-400">Admin • {state.settings.billingPlan}</p>
              </div>
            </div>
          </header>

          {showLoader ? (
            <LoadingSkeleton />
          ) : (
            <Routes>
              <Route path="/" element={<DashboardPage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/clients" element={<ClientsPage />} />
              <Route path="/deals" element={<DealsPage />} />
              <Route path="/contacts" element={<ContactsPage />} />
              <Route path="/companies" element={<CompaniesPage />} />
              <Route path="/calendar" element={<CalendarPage />} />
              <Route path="/reports" element={<ReportsPage />} />
              <Route path="/analytics" element={<AnalyticsPage />} />
              <Route path="/team" element={<TeamPage />} />
              <Route path="/settings" element={<SettingsPage />} />
            </Routes>
          )}
        </main>
      </div>
      <AiAssistant />
    </div>
  );
}

export default App;
