import { FormEvent, useState } from "react";
import { Card, PageHeader } from "../components/common";
import { useCrm } from "../store/CrmContext";

export function SettingsPage() {
  const { state, actions } = useCrm();
  const [profileName, setProfileName] = useState(state.settings.profileName);
  const [workspaceName, setWorkspaceName] = useState(state.settings.workspaceName);
  const [billingPlan, setBillingPlan] = useState(state.settings.billingPlan);
  const [theme, setTheme] = useState(state.settings.theme);
  const [notificationsEnabled, setNotificationsEnabled] = useState(state.settings.notificationsEnabled);
  const [securityAlerts, setSecurityAlerts] = useState(state.settings.securityAlerts);
  const [connectedApps, setConnectedApps] = useState(state.settings.connectedApps.join(", "));

  const saveSettings = (event: FormEvent) => {
    event.preventDefault();
    actions.updateSettings({
      profileName,
      workspaceName,
      billingPlan,
      theme,
      notificationsEnabled,
      securityAlerts,
      connectedApps: connectedApps
        .split(",")
        .map((app) => app.trim())
        .filter(Boolean)
    });
  };

  return (
    <div className="grid gap-5">
      <PageHeader title="Settings" subtitle="Workspace, billing, security, integrations" />

      <form className="grid gap-5 lg:grid-cols-2" onSubmit={saveSettings}>
        <Card>
          <h3 className="font-semibold mb-3">Profile Settings</h3>
          <div className="space-y-3">
            <label className="block text-sm text-slate-300">Profile Name</label>
            <input value={profileName} onChange={(event) => setProfileName(event.target.value)} className="w-full rounded-xl bg-white/5 border border-white/10 px-3 py-2" />
            <label className="block text-sm text-slate-300">Workspace Name</label>
            <input value={workspaceName} onChange={(event) => setWorkspaceName(event.target.value)} className="w-full rounded-xl bg-white/5 border border-white/10 px-3 py-2" />
          </div>
        </Card>

        <Card>
          <h3 className="font-semibold mb-3">Billing & Upgrade</h3>
          <select value={billingPlan} onChange={(event) => setBillingPlan(event.target.value as "Starter" | "Pro" | "Enterprise")} className="rounded-xl bg-white/5 border border-white/10 px-3 py-2 w-full">
            <option>Starter</option>
            <option>Pro</option>
            <option>Enterprise</option>
          </select>
          <div className="mt-3 rounded-xl border border-cyan/40 bg-cyan/10 p-3">
            <p className="font-medium">Upgrade to Pro</p>
            <p className="text-sm text-slate-300">Unlock advanced features and insights.</p>
          </div>
        </Card>

        <Card>
          <h3 className="font-semibold mb-3">Notifications & Security</h3>
          <div className="space-y-3">
            <label className="flex items-center justify-between">
              <span>Enable Notifications</span>
              <input type="checkbox" checked={notificationsEnabled} onChange={(event) => setNotificationsEnabled(event.target.checked)} />
            </label>
            <label className="flex items-center justify-between">
              <span>Security Alerts</span>
              <input type="checkbox" checked={securityAlerts} onChange={(event) => setSecurityAlerts(event.target.checked)} />
            </label>
            <label className="block text-sm text-slate-300">Theme</label>
            <select value={theme} onChange={(event) => setTheme(event.target.value as "dark" | "dark-ocean")} className="rounded-xl bg-white/5 border border-white/10 px-3 py-2 w-full">
              <option value="dark-ocean">Dark Ocean</option>
              <option value="dark">Dark</option>
            </select>
          </div>
        </Card>

        <Card>
          <h3 className="font-semibold mb-3">API Integrations & Export</h3>
          <label className="block text-sm text-slate-300">Connected Apps</label>
          <input value={connectedApps} onChange={(event) => setConnectedApps(event.target.value)} className="w-full rounded-xl bg-white/5 border border-white/10 px-3 py-2" />
          <div className="mt-3 flex gap-2">
            <button type="button" className="rounded-xl border border-white/20 px-3 py-2 hover:border-cyan">Export Data</button>
            <button type="button" className="rounded-xl border border-white/20 px-3 py-2 hover:border-cyan">Generate API Key</button>
          </div>
          <div className="mt-3">
            <p className="text-sm text-slate-300 mb-1">Change Password</p>
            <div className="grid gap-2 md:grid-cols-2">
              <input type="password" className="rounded-xl bg-white/5 border border-white/10 px-3 py-2" placeholder="New password" />
              <input type="password" className="rounded-xl bg-white/5 border border-white/10 px-3 py-2" placeholder="Confirm password" />
            </div>
          </div>
        </Card>

        <button className="rounded-xl bg-gradient-to-r from-cyan to-electric text-black px-4 py-3 font-semibold lg:col-span-2">
          Save Changes
        </button>
      </form>
    </div>
  );
}
