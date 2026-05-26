import { FormEvent, useMemo, useState } from "react";
import { Plus } from "lucide-react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Badge, Card, Modal, PageHeader } from "../components/common";
import { useCrm } from "../store/CrmContext";
import { TeamMember } from "../types";
import { currency } from "../utils/format";

export function TeamPage() {
  const { state, actions } = useCrm();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<TeamMember | null>(null);

  const leaderboard = useMemo(
    () => [...state.team].sort((a, b) => b.revenueGenerated - a.revenueGenerated),
    [state.team]
  );

  const chartData = state.team.map((member) => ({
    name: member.name.split(" ")[0],
    productivity: member.productivity,
    winRate: member.winRate
  }));

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const payload = {
      name: String(form.get("name")),
      role: String(form.get("role")),
      permissions: String(form.get("permissions"))
        .split(",")
        .map((permission) => permission.trim())
        .filter(Boolean),
      productivity: Number(form.get("productivity") || 0),
      dealsClosed: Number(form.get("dealsClosed") || 0),
      revenueGenerated: Number(form.get("revenueGenerated") || 0),
      tasksCompleted: Number(form.get("tasksCompleted") || 0),
      winRate: Number(form.get("winRate") || 0)
    };
    if (editing) {
      actions.updateTeamMember({ ...editing, ...payload });
    } else {
      actions.addTeamMember(payload);
    }
    setOpen(false);
    setEditing(null);
    event.currentTarget.reset();
  };

  return (
    <div className="grid gap-5">
      <PageHeader
        title="Team"
        subtitle="Performance, permissions, and collaboration"
        right={
          <button
            className="rounded-xl bg-gradient-to-r from-cyan to-electric text-black px-4 py-2 font-semibold"
            onClick={() => {
              setEditing(null);
              setOpen(true);
            }}
          >
            <Plus size={16} className="inline mr-2" />
            Add Team Member
          </button>
        }
      />

      <div className="grid gap-4 md:grid-cols-3">
        {state.team.map((member) => (
          <Card key={member.id} className="hover:border-cyan/40 transition">
            <div className="flex justify-between">
              <div>
                <p className="font-semibold">{member.name}</p>
                <p className="text-sm text-slate-400">{member.role}</p>
              </div>
              <button
                className="text-xs rounded-lg border border-white/20 px-2 py-1 hover:border-cyan"
                onClick={() => {
                  setEditing(member);
                  setOpen(true);
                }}
              >
                Edit
              </button>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
              <p>Deals Closed: {member.dealsClosed}</p>
              <p>Tasks: {member.tasksCompleted}</p>
              <p>Win Rate: {member.winRate}%</p>
              <p>Productivity: {member.productivity}%</p>
            </div>
            <p className="mt-3 text-sm text-cyan">{currency(member.revenueGenerated)} generated</p>
            <div className="mt-2 flex flex-wrap gap-1">
              {member.permissions.map((permission) => (
                <Badge key={permission} tone="cyan">{permission}</Badge>
              ))}
            </div>
          </Card>
        ))}
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <Card>
          <h3 className="font-semibold mb-2">Performance Leaderboard</h3>
          {leaderboard.map((member, index) => (
            <div key={member.id} className="rounded-xl bg-white/5 p-3 mb-2 flex justify-between">
              <p>{index + 1}. {member.name}</p>
              <p className="text-cyan">{currency(member.revenueGenerated)}</p>
            </div>
          ))}
        </Card>
        <Card className="h-72">
          <h3 className="font-semibold mb-2">Team Analytics Chart</h3>
          <ResponsiveContainer width="100%" height="90%">
            <BarChart data={chartData}>
              <CartesianGrid stroke="#2a3558" />
              <XAxis dataKey="name" stroke="#8ba3cb" />
              <YAxis stroke="#8ba3cb" />
              <Tooltip />
              <Bar dataKey="productivity" fill="#2264ff" />
              <Bar dataKey="winRate" fill="#18d4ff" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <Card>
        <h3 className="font-semibold mb-2">Activity Timeline</h3>
        <div className="grid gap-2 md:grid-cols-2">
          {state.team.map((member) => (
            <div key={member.id} className="rounded-xl bg-white/5 p-3 text-sm">
              <p>{member.name} closed {member.dealsClosed} deals and completed {member.tasksCompleted} tasks this cycle.</p>
            </div>
          ))}
        </div>
      </Card>

      <Modal open={open} onClose={() => setOpen(false)} title={editing ? "Edit Team Member" : "Add Team Member"}>
        <form className="grid gap-3 md:grid-cols-2" onSubmit={submit}>
          <input required name="name" defaultValue={editing?.name} className="rounded-xl bg-white/5 border border-white/10 px-3 py-2" placeholder="Name" />
          <input required name="role" defaultValue={editing?.role} className="rounded-xl bg-white/5 border border-white/10 px-3 py-2" placeholder="Role" />
          <input required name="permissions" defaultValue={editing?.permissions.join(", ")} className="rounded-xl bg-white/5 border border-white/10 px-3 py-2 md:col-span-2" placeholder="Permissions comma separated" />
          <input required type="number" name="productivity" defaultValue={editing?.productivity} className="rounded-xl bg-white/5 border border-white/10 px-3 py-2" placeholder="Productivity" />
          <input required type="number" name="dealsClosed" defaultValue={editing?.dealsClosed} className="rounded-xl bg-white/5 border border-white/10 px-3 py-2" placeholder="Deals closed" />
          <input required type="number" name="revenueGenerated" defaultValue={editing?.revenueGenerated} className="rounded-xl bg-white/5 border border-white/10 px-3 py-2" placeholder="Revenue generated" />
          <input required type="number" name="tasksCompleted" defaultValue={editing?.tasksCompleted} className="rounded-xl bg-white/5 border border-white/10 px-3 py-2" placeholder="Tasks completed" />
          <input required type="number" name="winRate" defaultValue={editing?.winRate} className="rounded-xl bg-white/5 border border-white/10 px-3 py-2 md:col-span-2" placeholder="Win rate" />
          <button className="rounded-xl bg-gradient-to-r from-cyan to-electric text-black px-4 py-2 font-semibold md:col-span-2">{editing ? "Update Member" : "Create Member"}</button>
        </form>
      </Modal>
    </div>
  );
}
