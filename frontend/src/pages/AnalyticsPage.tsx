import { useMemo, useState } from "react";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, ComposedChart, Funnel, FunnelChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card, PageHeader } from "../components/common";
import { useCrm } from "../store/CrmContext";
import { currency } from "../utils/format";

export function AnalyticsPage() {
  const { state } = useCrm();
  const [industry, setIndustry] = useState("All");
  const [status, setStatus] = useState("All");
  const [owner, setOwner] = useState("All");

  const filteredClients = useMemo(
    () =>
      state.clients.filter((client) => {
        const ownerMatch =
          owner === "All" ||
          state.deals
            .filter((deal) => deal.clientId === client.id)
            .some((deal) => state.team.find((member) => member.id === deal.ownerId)?.name === owner);
        return (industry === "All" || client.industry === industry) && (status === "All" || client.status === status) && ownerMatch;
      }),
    [state.clients, state.deals, state.team, industry, status, owner]
  );

  const filteredDeals = state.deals.filter((deal) => filteredClients.some((client) => client.id === deal.clientId));

  const revenueTrend = filteredDeals.map((deal, index) => ({
    month: `M${index + 1}`,
    revenue: deal.value,
    forecast: Math.round(deal.value * (deal.probability / 100))
  }));

  const growth = filteredClients.map((client, index) => ({ month: `M${index + 1}`, growth: 100 + client.aiScore + index * 4 }));

  const funnelData = [
    { value: filteredDeals.length, name: "New" },
    { value: filteredDeals.filter((deal) => ["Qualified", "Proposal", "Negotiation"].includes(deal.stage)).length, name: "Mid" },
    { value: filteredDeals.filter((deal) => deal.stage === "Won").length, name: "Won" }
  ];

  const industries = Object.entries(
    filteredClients.reduce<Record<string, number>>((acc, client) => {
      acc[client.industry] = (acc[client.industry] ?? 0) + client.dealValue;
      return acc;
    }, {})
  ).map(([name, value]) => ({ name, value }));

  const teamStats = state.team.map((member) => ({ name: member.name.split(" ")[0], winRate: member.winRate, productivity: member.productivity }));

  return (
    <div className="grid gap-5">
      <PageHeader title="Analytics" subtitle="AI-powered forecasting and business intelligence" />

      <Card className="flex flex-wrap gap-2">
        <select value={industry} onChange={(event) => setIndustry(event.target.value)} className="rounded-xl bg-white/5 border border-white/10 px-3 py-2">
          <option>All</option>
          {Array.from(new Set(state.clients.map((client) => client.industry))).map((item) => (
            <option key={item}>{item}</option>
          ))}
        </select>
        <select value={status} onChange={(event) => setStatus(event.target.value)} className="rounded-xl bg-white/5 border border-white/10 px-3 py-2">
          <option>All</option>
          <option>Active</option>
          <option>At Risk</option>
          <option>Prospect</option>
          <option>Inactive</option>
        </select>
        <select value={owner} onChange={(event) => setOwner(event.target.value)} className="rounded-xl bg-white/5 border border-white/10 px-3 py-2">
          <option>All</option>
          {state.team.map((member) => (
            <option key={member.id}>{member.name}</option>
          ))}
        </select>
      </Card>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <p className="text-slate-400 text-sm">Pipeline Velocity</p>
          <p className="text-2xl font-bold mt-2">{Math.round(filteredDeals.reduce((sum, deal) => sum + deal.probability, 0) / Math.max(1, filteredDeals.length))}%</p>
        </Card>
        <Card>
          <p className="text-slate-400 text-sm">Monthly Recurring Revenue</p>
          <p className="text-2xl font-bold mt-2">{currency(Math.round(filteredClients.reduce((sum, client) => sum + client.dealValue, 0) / 12))}</p>
        </Card>
        <Card>
          <p className="text-slate-400 text-sm">Churn Risk</p>
          <p className="text-2xl font-bold mt-2">{filteredClients.filter((client) => client.status === "At Risk").length}</p>
        </Card>
        <Card>
          <p className="text-slate-400 text-sm">Revenue Forecast</p>
          <p className="text-2xl font-bold mt-2">{currency(filteredDeals.reduce((sum, deal) => sum + deal.value * (deal.probability / 100), 0))}</p>
        </Card>
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <Card className="lg:col-span-2 h-72">
          <h3 className="font-semibold mb-2">Revenue Trends</h3>
          <ResponsiveContainer width="100%" height="90%">
            <AreaChart data={revenueTrend}>
              <CartesianGrid stroke="#2a3558" />
              <XAxis dataKey="month" stroke="#8ba3cb" />
              <YAxis stroke="#8ba3cb" />
              <Tooltip />
              <Area dataKey="revenue" stroke="#18d4ff" fill="#18d4ff22" />
              <Area dataKey="forecast" stroke="#2264ff" fill="#2264ff1f" />
            </AreaChart>
          </ResponsiveContainer>
        </Card>
        <Card className="h-72">
          <h3 className="font-semibold mb-2">Deal Conversion Funnel</h3>
          <ResponsiveContainer width="100%" height="90%">
            <FunnelChart>
              <Tooltip />
              <Funnel dataKey="value" data={funnelData} isAnimationActive />
            </FunnelChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <Card className="h-72">
          <h3 className="font-semibold mb-2">Customer Growth Trends</h3>
          <ResponsiveContainer width="100%" height="90%">
            <BarChart data={growth}>
              <CartesianGrid stroke="#2a3558" />
              <XAxis dataKey="month" stroke="#8ba3cb" />
              <YAxis stroke="#8ba3cb" />
              <Tooltip />
              <Bar dataKey="growth" fill="#2264ff" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
        <Card className="h-72">
          <h3 className="font-semibold mb-2">Top Performing Industries</h3>
          <ResponsiveContainer width="100%" height="90%">
            <BarChart data={industries}>
              <CartesianGrid stroke="#2a3558" />
              <XAxis dataKey="name" stroke="#8ba3cb" />
              <YAxis stroke="#8ba3cb" />
              <Tooltip />
              <Bar dataKey="value" fill="#18d4ff" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <Card className="h-72">
          <h3 className="font-semibold mb-2">Team Performance Analytics</h3>
          <ResponsiveContainer width="100%" height="90%">
            <ComposedChart data={teamStats}>
              <CartesianGrid stroke="#2a3558" />
              <XAxis dataKey="name" stroke="#8ba3cb" />
              <YAxis stroke="#8ba3cb" />
              <Tooltip />
              <Bar dataKey="productivity" fill="#2264ff" />
              <Area dataKey="winRate" stroke="#18d4ff" fill="#18d4ff22" />
            </ComposedChart>
          </ResponsiveContainer>
        </Card>
        <Card>
          <h3 className="font-semibold mb-3">AI Insights</h3>
          <ul className="space-y-2 text-sm">
            <li className="rounded-xl bg-white/5 p-2">Forecast indicates stronger closure potential in deals above {currency(100000)}.</li>
            <li className="rounded-xl bg-white/5 p-2">Highest-performing industry currently: {industries.sort((a, b) => b.value - a.value)[0]?.name ?? "N/A"}.</li>
            <li className="rounded-xl bg-white/5 p-2">Churn analysis flags {filteredClients.filter((client) => client.status === "At Risk").length} account(s) for immediate follow-up.</li>
          </ul>
        </Card>
      </div>
    </div>
  );
}
