import { useMemo, useState } from "react";
import { Download, FileSpreadsheet, FileText } from "lucide-react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card, PageHeader } from "../components/common";
import { useCrm } from "../store/CrmContext";
import { currency } from "../utils/format";

export function ReportsPage() {
  const { state } = useCrm();
  const [from, setFrom] = useState("2026-05-01");
  const [to, setTo] = useState("2026-05-31");

  const reportRows = useMemo(
    () => [
      { metric: "Sales Performance", value: state.deals.filter((deal) => deal.stage === "Won").length, trend: "+12%" },
      { metric: "Revenue", value: currency(state.deals.filter((deal) => deal.stage === "Won").reduce((sum, deal) => sum + deal.value, 0)), trend: "+18%" },
      { metric: "Client Growth", value: state.clients.length, trend: "+9%" },
      { metric: "Team Productivity", value: `${Math.round(state.team.reduce((sum, member) => sum + member.productivity, 0) / state.team.length)}%`, trend: "+6%" },
      { metric: "Deal Conversion", value: `${Math.round((state.deals.filter((deal) => deal.stage === "Won").length / Math.max(1, state.deals.length)) * 100)}%`, trend: "+3%" },
      { metric: "Customer Retention", value: `${100 - state.clients.filter((client) => client.status === "At Risk").length * 6}%`, trend: "+2%" }
    ],
    [state.deals, state.clients, state.team]
  );

  const chartData = reportRows.map((row, index) => ({
    name: row.metric.split(" ")[0],
    score: typeof row.value === "number" ? row.value : Number(String(row.value).replace(/[^\d]/g, "")) || 50 + index * 5
  }));

  return (
    <div className="grid gap-5">
      <PageHeader title="Reports" subtitle="Exportable business intelligence reports" />

      <Card className="flex items-end gap-3 flex-wrap">
        <div>
          <p className="text-xs text-slate-400 mb-1">From</p>
          <input type="date" value={from} onChange={(event) => setFrom(event.target.value)} className="rounded-xl bg-white/5 border border-white/10 px-3 py-2" />
        </div>
        <div>
          <p className="text-xs text-slate-400 mb-1">To</p>
          <input type="date" value={to} onChange={(event) => setTo(event.target.value)} className="rounded-xl bg-white/5 border border-white/10 px-3 py-2" />
        </div>
        <button className="rounded-xl border border-white/20 px-3 py-2 hover:border-cyan"><FileText size={14} className="inline mr-2" />PDF</button>
        <button className="rounded-xl border border-white/20 px-3 py-2 hover:border-cyan"><Download size={14} className="inline mr-2" />CSV</button>
        <button className="rounded-xl border border-white/20 px-3 py-2 hover:border-cyan"><FileSpreadsheet size={14} className="inline mr-2" />Excel</button>
      </Card>

      <div className="grid gap-4 md:grid-cols-3">
        {reportRows.map((row) => (
          <Card key={row.metric}>
            <p className="text-slate-400 text-sm">{row.metric}</p>
            <p className="text-2xl font-bold mt-2">{row.value}</p>
            <p className="text-cyan text-sm mt-1">{row.trend}</p>
          </Card>
        ))}
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <Card className="h-72">
          <h3 className="font-semibold mb-2">Generated Report Preview</h3>
          <ResponsiveContainer width="100%" height="90%">
            <BarChart data={chartData}>
              <CartesianGrid stroke="#2a3558" />
              <XAxis dataKey="name" stroke="#8ba3cb" />
              <YAxis stroke="#8ba3cb" />
              <Tooltip />
              <Bar dataKey="score" fill="#2264ff" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
        <Card>
          <h3 className="font-semibold mb-2">Report Data Table</h3>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-400">
                <th className="pb-2">Metric</th>
                <th className="pb-2">Value</th>
                <th className="pb-2">Trend</th>
              </tr>
            </thead>
            <tbody>
              {reportRows.map((row) => (
                <tr key={row.metric} className="border-t border-white/10">
                  <td className="py-2">{row.metric}</td>
                  <td>{row.value}</td>
                  <td className="text-cyan">{row.trend}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <button className="mt-4 rounded-xl bg-gradient-to-r from-cyan to-electric text-black px-4 py-2 font-semibold">Download Report</button>
        </Card>
      </div>
      <p className="text-xs text-slate-400">Report range: {from} to {to}</p>
    </div>
  );
}
