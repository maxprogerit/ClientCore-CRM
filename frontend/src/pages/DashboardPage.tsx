import { Area, AreaChart, Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card, PageHeader } from "../components/common";
import { useCrm } from "../store/CrmContext";
import { currency, shortDate } from "../utils/format";

export function DashboardPage() {
  const { state, selectors } = useCrm();

  const monthlyRevenue = [
    { month: "Jan", revenue: 240000, forecast: 210000 },
    { month: "Feb", revenue: 290000, forecast: 260000 },
    { month: "Mar", revenue: 370000, forecast: 330000 },
    { month: "Apr", revenue: 430000, forecast: 410000 },
    { month: "May", revenue: 510000, forecast: 470000 },
    { month: "Jun", revenue: selectors.pipelineValue, forecast: selectors.pipelineValue * 0.9 }
  ];

  const byStage = ["New", "Qualified", "Proposal", "Negotiation", "Won", "Lost"].map((stage) => ({
    stage,
    count: state.deals.filter((deal) => deal.stage === stage).length
  }));

  const tasks = state.events.filter((event) => event.type === "task" || event.type === "deadline").slice(0, 4);
  const meetings = selectors.upcomingEvents.slice(0, 4);

  return (
    <div className="grid gap-5">
      <PageHeader
        title="CUSTOM CRM • CLIENT ANALYTICS • SALES DASHBOARD"
        subtitle="Real-time enterprise command center"
      />

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <p className="text-slate-400 text-sm">Total Revenue</p>
          <p className="text-2xl font-bold mt-2">{currency(selectors.totalRevenue)}</p>
        </Card>
        <Card>
          <p className="text-slate-400 text-sm">New Clients</p>
          <p className="text-2xl font-bold mt-2">{state.clients.filter((c) => c.status === "Prospect").length}</p>
        </Card>
        <Card>
          <p className="text-slate-400 text-sm">Active Deals</p>
          <p className="text-2xl font-bold mt-2">{selectors.activeDeals}</p>
        </Card>
        <Card>
          <p className="text-slate-400 text-sm">Win Rate</p>
          <p className="text-2xl font-bold mt-2">{selectors.winRate.toFixed(1)}%</p>
        </Card>
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <Card className="lg:col-span-2 h-80">
          <h3 className="font-semibold mb-3">Revenue Overview</h3>
          <ResponsiveContainer width="100%" height="90%">
            <AreaChart data={monthlyRevenue}>
              <defs>
                <linearGradient id="rev-fill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#18d4ff" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#18d4ff" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="#2a3558" strokeDasharray="3 3" />
              <XAxis dataKey="month" stroke="#8ba3cb" />
              <YAxis stroke="#8ba3cb" />
              <Tooltip />
              <Area dataKey="revenue" stroke="#18d4ff" fill="url(#rev-fill)" />
              <Line dataKey="forecast" stroke="#2264ff" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        <Card className="h-80">
          <h3 className="font-semibold mb-3">Sales Pipeline</h3>
          <ResponsiveContainer width="100%" height="90%">
            <BarChart data={byStage}>
              <CartesianGrid stroke="#2a3558" strokeDasharray="3 3" />
              <XAxis dataKey="stage" stroke="#8ba3cb" />
              <YAxis stroke="#8ba3cb" />
              <Tooltip />
              <Bar dataKey="count" fill="#2264ff" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <div className="grid gap-5 lg:grid-cols-4">
        <Card>
          <h3 className="font-semibold mb-3">Top Clients</h3>
          <div className="space-y-2 text-sm">
            {selectors.topClients.map((client) => (
              <div key={client.id} className="rounded-xl bg-white/5 p-2">
                <p>{client.name}</p>
                <p className="text-slate-400">{currency(client.dealValue)}</p>
              </div>
            ))}
          </div>
        </Card>
        <Card>
          <h3 className="font-semibold mb-3">Recent Activity</h3>
          <div className="space-y-2 text-sm">
            {state.clients.flatMap((client) => client.activity.map((activity) => ({ ...activity, client: client.name }))).slice(0, 4).map((item) => (
              <div key={item.id} className="rounded-xl bg-white/5 p-2">
                <p>{item.text}</p>
                <p className="text-slate-400">{item.client} • {shortDate(item.date)}</p>
              </div>
            ))}
          </div>
        </Card>
        <Card>
          <h3 className="font-semibold mb-3">Task Management</h3>
          <div className="space-y-2 text-sm">
            {tasks.map((task) => (
              <div key={task.id} className="rounded-xl bg-white/5 p-2">
                <p>{task.title}</p>
                <p className="text-slate-400">{shortDate(task.date)} • {task.type}</p>
              </div>
            ))}
          </div>
        </Card>
        <Card>
          <h3 className="font-semibold mb-3">Upcoming Meetings</h3>
          <div className="space-y-2 text-sm">
            {meetings.map((meeting) => (
              <div key={meeting.id} className="rounded-xl bg-white/5 p-2">
                <p>{meeting.title}</p>
                <p className="text-slate-400">{shortDate(meeting.date)} {meeting.time}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <Card>
          <h3 className="font-semibold mb-3">AI Insights Recommendations</h3>
          <ul className="space-y-2 text-sm">
            <li className="rounded-xl bg-white/5 p-2">Enterprise accounts represent {Math.round((selectors.pipelineValue / Math.max(1, selectors.totalRevenue + selectors.pipelineValue)) * 100)}% of active pipeline.</li>
            <li className="rounded-xl bg-white/5 p-2">At-risk clients: {state.clients.filter((client) => client.status === "At Risk").map((client) => client.name).join(", ") || "None"}.</li>
            <li className="rounded-xl bg-white/5 p-2">Best team win rate: {state.team.sort((a, b) => b.winRate - a.winRate)[0]?.name ?? "N/A"}.</li>
          </ul>
        </Card>
        <Card>
          <h3 className="font-semibold mb-3">Notifications</h3>
          <div className="space-y-2 text-sm">
            {state.notifications.slice(0, 5).map((note) => (
              <div key={note.id} className="rounded-xl bg-white/5 p-2">
                <p>{note.text}</p>
                <p className="text-slate-400">{shortDate(note.date)}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
