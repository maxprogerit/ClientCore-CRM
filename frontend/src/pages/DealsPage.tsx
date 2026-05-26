import { FormEvent, useMemo, useState } from "react";
import { Plus } from "lucide-react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Badge, Card, Modal, PageHeader } from "../components/common";
import { useCrm } from "../store/CrmContext";
import { Deal, DealStage } from "../types";
import { currency } from "../utils/format";

const stages: DealStage[] = ["New", "Qualified", "Proposal", "Negotiation", "Won", "Lost"];

export function DealsPage() {
  const { state, actions } = useCrm();
  const [dragging, setDragging] = useState<string | null>(null);
  const [dealModalOpen, setDealModalOpen] = useState(false);
  const [editingDeal, setEditingDeal] = useState<Deal | null>(null);

  const forecast = useMemo(
    () =>
      state.deals.map((deal, index) => ({
        month: `M${index + 1}`,
        forecast: Math.round(deal.value * (deal.probability / 100)),
        value: deal.value
      })),
    [state.deals]
  );

  const openDeals = state.deals.filter((deal) => !["Won", "Lost"].includes(deal.stage));
  const wonDeals = state.deals.filter((deal) => deal.stage === "Won");
  const conversion = state.deals.length ? (wonDeals.length / state.deals.length) * 100 : 0;

  const submitDeal = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const input = {
      title: String(form.get("title")),
      clientId: String(form.get("clientId")),
      companyId: String(form.get("companyId")),
      stage: form.get("stage") as DealStage,
      value: Number(form.get("value") || 0),
      probability: Number(form.get("probability") || 0),
      ownerId: String(form.get("ownerId")),
      expectedClose: String(form.get("expectedClose"))
    };
    if (editingDeal) {
      actions.updateDeal({ ...editingDeal, ...input });
    } else {
      actions.addDeal(input);
    }
    setDealModalOpen(false);
    setEditingDeal(null);
    event.currentTarget.reset();
  };

  return (
    <div className="grid gap-5">
      <PageHeader
        title="Deals Pipeline"
        subtitle="Sales workflow and forecasting"
        right={
          <button
            onClick={() => {
              setEditingDeal(null);
              setDealModalOpen(true);
            }}
            className="rounded-xl bg-gradient-to-r from-cyan to-electric text-black px-4 py-2 font-semibold"
          >
            <Plus size={16} className="inline mr-2" />
            Add Deal
          </button>
        }
      />

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <p className="text-slate-400 text-sm">Pipeline Value</p>
          <p className="text-2xl font-bold mt-2">{currency(openDeals.reduce((sum, deal) => sum + deal.value, 0))}</p>
        </Card>
        <Card>
          <p className="text-slate-400 text-sm">Won Revenue</p>
          <p className="text-2xl font-bold mt-2">{currency(wonDeals.reduce((sum, deal) => sum + deal.value, 0))}</p>
        </Card>
        <Card>
          <p className="text-slate-400 text-sm">Conversion Rate</p>
          <p className="text-2xl font-bold mt-2">{conversion.toFixed(1)}%</p>
        </Card>
        <Card>
          <p className="text-slate-400 text-sm">Forecasted Revenue</p>
          <p className="text-2xl font-bold mt-2">
            {currency(state.deals.filter((deal) => !["Won", "Lost"].includes(deal.stage)).reduce((sum, deal) => sum + deal.value * (deal.probability / 100), 0))}
          </p>
        </Card>
      </div>

      <Card className="h-72">
        <h3 className="font-semibold mb-2">Forecasted Revenue Trend</h3>
        <ResponsiveContainer width="100%" height="90%">
          <AreaChart data={forecast}>
            <defs>
              <linearGradient id="deal-forecast" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2264ff" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#2264ff" stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="#2a3558" />
            <XAxis dataKey="month" stroke="#8ba3cb" />
            <YAxis stroke="#8ba3cb" />
            <Tooltip />
            <Area dataKey="forecast" stroke="#18d4ff" fill="url(#deal-forecast)" />
          </AreaChart>
        </ResponsiveContainer>
      </Card>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-6">
        {stages.map((stage) => (
          <div
            key={stage}
            className="glass p-3 min-h-72"
            onDragOver={(event) => event.preventDefault()}
            onDrop={() => {
              if (dragging) actions.moveDeal(dragging, stage);
              setDragging(null);
            }}
          >
            <div className="mb-3 flex items-center justify-between">
              <p className="font-semibold">{stage}</p>
              <Badge tone="neutral">{state.deals.filter((deal) => deal.stage === stage).length}</Badge>
            </div>
            <div className="space-y-2">
              {state.deals
                .filter((deal) => deal.stage === stage)
                .map((deal) => {
                  const client = state.clients.find((item) => item.id === deal.clientId);
                  const owner = state.team.find((item) => item.id === deal.ownerId);
                  return (
                    <div
                      key={deal.id}
                      draggable
                      onDragStart={() => setDragging(deal.id)}
                      onClick={() => {
                        setEditingDeal(deal);
                        setDealModalOpen(true);
                      }}
                      className="rounded-xl border border-white/10 bg-white/5 p-3 cursor-move hover:border-cyan/40"
                    >
                      <p className="font-medium text-sm">{deal.title}</p>
                      <p className="text-xs text-slate-400">{client?.name}</p>
                      <div className="mt-2 text-xs text-slate-300">
                        <p>{currency(deal.value)} • {deal.probability}%</p>
                        <p>{owner?.name} • {deal.expectedClose}</p>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        ))}
      </div>

      <Modal open={dealModalOpen} onClose={() => setDealModalOpen(false)} title={editingDeal ? "Edit Deal" : "Add Deal"}>
        <form className="grid gap-3 md:grid-cols-2" onSubmit={submitDeal}>
          <input name="title" required defaultValue={editingDeal?.title} className="rounded-xl bg-white/5 border border-white/10 px-3 py-2" placeholder="Deal title" />
          <select name="stage" defaultValue={editingDeal?.stage ?? "New"} className="rounded-xl bg-white/5 border border-white/10 px-3 py-2">
            {stages.map((stage) => (
              <option key={stage}>{stage}</option>
            ))}
          </select>
          <select name="clientId" defaultValue={editingDeal?.clientId ?? state.clients[0]?.id} className="rounded-xl bg-white/5 border border-white/10 px-3 py-2">
            {state.clients.map((client) => (
              <option key={client.id} value={client.id}>{client.name}</option>
            ))}
          </select>
          <select name="companyId" defaultValue={editingDeal?.companyId ?? state.companies[0]?.id} className="rounded-xl bg-white/5 border border-white/10 px-3 py-2">
            {state.companies.map((company) => (
              <option key={company.id} value={company.id}>{company.name}</option>
            ))}
          </select>
          <input name="value" type="number" required defaultValue={editingDeal?.value} className="rounded-xl bg-white/5 border border-white/10 px-3 py-2" placeholder="Deal value" />
          <input name="probability" type="number" min={0} max={100} required defaultValue={editingDeal?.probability} className="rounded-xl bg-white/5 border border-white/10 px-3 py-2" placeholder="Close probability" />
          <select name="ownerId" defaultValue={editingDeal?.ownerId ?? state.team[0]?.id} className="rounded-xl bg-white/5 border border-white/10 px-3 py-2">
            {state.team.map((member) => (
              <option key={member.id} value={member.id}>{member.name}</option>
            ))}
          </select>
          <input name="expectedClose" type="date" required defaultValue={editingDeal?.expectedClose} className="rounded-xl bg-white/5 border border-white/10 px-3 py-2" />
          <button className="rounded-xl bg-gradient-to-r from-cyan to-electric text-black px-4 py-2 font-semibold md:col-span-2">{editingDeal ? "Update Deal" : "Create Deal"}</button>
        </form>
      </Modal>
    </div>
  );
}
