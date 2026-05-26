import { FormEvent, useMemo, useState } from "react";
import { Plus } from "lucide-react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Badge, Card, Modal, PageHeader } from "../components/common";
import { useCrm } from "../store/CrmContext";
import { Company } from "../types";
import { currency, shortDate } from "../utils/format";

export function CompaniesPage() {
  const { state, actions } = useCrm();
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState<string>(state.companies[0]?.id ?? "");
  const [openModal, setOpenModal] = useState(false);
  const [editing, setEditing] = useState<Company | null>(null);

  const companies = useMemo(
    () =>
      state.companies.filter((company) =>
        `${company.name} ${company.industry} ${company.clientStatus}`.toLowerCase().includes(query.toLowerCase())
      ),
    [state.companies, query]
  );

  const selected = state.companies.find((company) => company.id === selectedId) ?? null;

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const payload = {
      name: String(form.get("name")),
      industry: String(form.get("industry")),
      revenue: Number(form.get("revenue") || 0),
      employees: Number(form.get("employees") || 0),
      clientStatus: form.get("clientStatus") as Company["clientStatus"],
      healthScore: Number(form.get("healthScore") || 70),
      contracts: Number(form.get("contracts") || 1)
    };

    if (editing) {
      actions.updateCompany({ ...editing, ...payload });
    } else {
      actions.addCompany(payload);
    }
    setOpenModal(false);
    setEditing(null);
    event.currentTarget.reset();
  };

  const analytics = state.companies.map((company) => ({
    name: company.name.slice(0, 8),
    health: company.healthScore,
    contracts: company.contracts
  }));

  return (
    <div className="grid gap-5">
      <PageHeader
        title="Companies"
        subtitle="Company intelligence and contracts"
        right={
          <button
            className="rounded-xl bg-gradient-to-r from-cyan to-electric text-black px-4 py-2 font-semibold"
            onClick={() => {
              setEditing(null);
              setOpenModal(true);
            }}
          >
            <Plus size={16} className="inline mr-2" />
            Add Company
          </button>
        }
      />

      <Card className="flex justify-between flex-wrap gap-2">
        <input className="rounded-xl bg-white/5 border border-white/10 px-3 py-2 w-72" placeholder="Search company, industry, status..." value={query} onChange={(event) => setQuery(event.target.value)} />
      </Card>

      <div className="grid gap-5 lg:grid-cols-3">
        <Card className="lg:col-span-2 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-400">
                <th className="pb-2">Company</th>
                <th className="pb-2">Industry</th>
                <th className="pb-2">Revenue</th>
                <th className="pb-2">Employees</th>
                <th className="pb-2">Health</th>
                <th className="pb-2">Contracts</th>
                <th className="pb-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {companies.map((company) => (
                <tr key={company.id} className="border-t border-white/10 hover:bg-white/5 cursor-pointer" onClick={() => setSelectedId(company.id)}>
                  <td className="py-2">{company.name}</td>
                  <td>{company.industry}</td>
                  <td>{currency(company.revenue)}</td>
                  <td>{company.employees}</td>
                  <td>{company.healthScore}</td>
                  <td>{company.contracts}</td>
                  <td>
                    <button
                      className="rounded-lg border border-white/20 px-2 py-1 text-xs hover:border-cyan"
                      onClick={(event) => {
                        event.stopPropagation();
                        setEditing(company);
                        setOpenModal(true);
                      }}
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>

        <Card>
          {selected ? (
            <div className="space-y-3">
              <p className="font-semibold text-lg">{selected.name}</p>
              <Badge tone={selected.clientStatus === "Active" ? "green" : selected.clientStatus === "At Risk" ? "yellow" : "cyan"}>{selected.clientStatus}</Badge>
              <p className="text-sm text-slate-300">{selected.industry} • {selected.employees} employees</p>
              <p className="text-sm">Health Score: {selected.healthScore}</p>
              <p className="text-sm">Linked Contacts: {selected.linkedContactIds.length}</p>
              <p className="text-sm">Linked Deals: {selected.linkedDealIds.length}</p>
              <div>
                <p className="text-slate-400 text-sm">Activity Timeline</p>
                {selected.activity.map((item) => (
                  <div key={item.id} className="text-sm border-l border-cyan/40 pl-2 py-1">
                    <p>{item.text}</p>
                    <p className="text-slate-400">{shortDate(item.date)}</p>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p>Select a company profile.</p>
          )}
        </Card>
      </div>

      <Card className="h-72">
        <h3 className="font-semibold mb-2">Company Analytics Panel</h3>
        <ResponsiveContainer width="100%" height="90%">
          <BarChart data={analytics}>
            <CartesianGrid stroke="#2a3558" />
            <XAxis dataKey="name" stroke="#8ba3cb" />
            <YAxis stroke="#8ba3cb" />
            <Tooltip />
            <Bar dataKey="health" fill="#18d4ff" radius={[8, 8, 0, 0]} />
            <Bar dataKey="contracts" fill="#2264ff" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {companies.map((company) => (
          <Card key={company.id} className="hover:border-cyan/30 transition">
            <div className="flex justify-between">
              <p className="font-semibold">{company.name}</p>
              <Badge tone={company.clientStatus === "Active" ? "green" : company.clientStatus === "At Risk" ? "yellow" : "cyan"}>{company.clientStatus}</Badge>
            </div>
            <p className="text-sm text-slate-400 mt-1">{company.industry}</p>
            <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
              <p>Revenue: {currency(company.revenue)}</p>
              <p>Employees: {company.employees}</p>
              <p>Health: {company.healthScore}</p>
              <p>Contracts: {company.contracts}</p>
            </div>
          </Card>
        ))}
      </div>

      <Modal open={openModal} onClose={() => setOpenModal(false)} title={editing ? "Edit Company" : "Add Company"}>
        <form className="grid gap-3 md:grid-cols-2" onSubmit={onSubmit}>
          <input name="name" required defaultValue={editing?.name} className="rounded-xl bg-white/5 border border-white/10 px-3 py-2" placeholder="Company name" />
          <input name="industry" required defaultValue={editing?.industry} className="rounded-xl bg-white/5 border border-white/10 px-3 py-2" placeholder="Industry" />
          <input name="revenue" type="number" required defaultValue={editing?.revenue} className="rounded-xl bg-white/5 border border-white/10 px-3 py-2" placeholder="Revenue" />
          <input name="employees" type="number" required defaultValue={editing?.employees} className="rounded-xl bg-white/5 border border-white/10 px-3 py-2" placeholder="Employees" />
          <select name="clientStatus" defaultValue={editing?.clientStatus ?? "Active"} className="rounded-xl bg-white/5 border border-white/10 px-3 py-2">
            <option>Active</option>
            <option>At Risk</option>
            <option>Prospect</option>
            <option>Inactive</option>
          </select>
          <input name="healthScore" type="number" min={0} max={100} required defaultValue={editing?.healthScore} className="rounded-xl bg-white/5 border border-white/10 px-3 py-2" placeholder="Health score" />
          <input name="contracts" type="number" required defaultValue={editing?.contracts} className="rounded-xl bg-white/5 border border-white/10 px-3 py-2 md:col-span-2" placeholder="Contracts" />
          <button className="rounded-xl bg-gradient-to-r from-cyan to-electric text-black px-4 py-2 font-semibold md:col-span-2">{editing ? "Update Company" : "Create Company"}</button>
        </form>
      </Modal>
    </div>
  );
}
