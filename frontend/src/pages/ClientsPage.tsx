import { FormEvent, useMemo, useState } from "react";
import { Plus, Trash2, UserPen } from "lucide-react";
import { Badge, Card, ConfirmDialog, EmptyState, Modal, PageHeader, SectionTabs } from "../components/common";
import { useCrm } from "../store/CrmContext";
import { Client } from "../types";
import { currency, shortDate } from "../utils/format";

const statusTones: Record<string, "green" | "yellow" | "red" | "cyan"> = {
  Active: "green",
  Prospect: "cyan",
  "At Risk": "yellow",
  Inactive: "red"
};

export function ClientsPage() {
  const { state, actions } = useCrm();
  const [viewMode, setViewMode] = useState("Table");
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("All");
  const [industry, setIndustry] = useState("All");
  const [minDealValue, setMinDealValue] = useState("");
  const [contactSince, setContactSince] = useState("");
  const [sortBy, setSortBy] = useState("Deal Value");
  const [selectedClientId, setSelectedClientId] = useState<string | null>(state.clients[0]?.id ?? null);
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const selectedClient = state.clients.find((client) => client.id === selectedClientId) ?? null;

  const clients = useMemo(
    () =>
      state.clients
        .filter((client) => {
        const searchable = `${client.name} ${client.email} ${state.companies.find((company) => company.id === client.companyId)?.name ?? ""} ${client.status}`.toLowerCase();
        const qMatch = searchable.includes(query.toLowerCase());
        const statusMatch = status === "All" || client.status === status;
        const industryMatch = industry === "All" || client.industry === industry;
        const valueMatch = !minDealValue || client.dealValue >= Number(minDealValue);
        const contactMatch = !contactSince || client.lastContact >= contactSince;
        return qMatch && statusMatch && industryMatch && valueMatch && contactMatch;
      })
        .sort((a, b) => {
          if (sortBy === "Name") return a.name.localeCompare(b.name);
          if (sortBy === "Last Contact") return b.lastContact.localeCompare(a.lastContact);
          return b.dealValue - a.dealValue;
        }),
    [state.clients, state.companies, query, status, industry, minDealValue, contactSince, sortBy]
  );

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    actions.addClient({
      name: String(form.get("name")),
      email: String(form.get("email")),
      companyId: String(form.get("companyId")),
      status: form.get("status") as Client["status"],
      industry: String(form.get("industry")),
      dealValue: Number(form.get("dealValue") || 0),
      lastContact: String(form.get("lastContact")),
      aiScore: Number(form.get("aiScore") || 70),
      tags: String(form.get("tags") || "")
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
      notes: String(form.get("notes") || "")
    });
    setCreateOpen(false);
    event.currentTarget.reset();
  };

  const onEdit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedClient) return;
    const form = new FormData(event.currentTarget);
    actions.updateClient({
      ...selectedClient,
      name: String(form.get("name")),
      email: String(form.get("email")),
      status: form.get("status") as Client["status"],
      industry: String(form.get("industry")),
      dealValue: Number(form.get("dealValue") || 0),
      lastContact: String(form.get("lastContact")),
      aiScore: Number(form.get("aiScore") || selectedClient.aiScore),
      tags: String(form.get("tags") || "")
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
      notes: String(form.get("notes") || "")
    });
    setEditOpen(false);
  };

  const companiesOptions = state.companies.map((company) => ({ id: company.id, name: company.name }));

  return (
    <div className="grid gap-5">
      <PageHeader
        title="Clients"
        subtitle="Client lifecycle management"
        right={
          <button className="rounded-xl bg-gradient-to-r from-cyan to-electric text-black px-4 py-2 font-semibold" onClick={() => setCreateOpen(true)}>
            <Plus size={16} className="inline mr-2" />
            Add Client
          </button>
        }
      />

      <Card className="flex flex-wrap gap-2">
        <input className="rounded-xl bg-white/5 border border-white/10 px-3 py-2 w-64" placeholder="Search name, email, company, status..." value={query} onChange={(event) => setQuery(event.target.value)} />
        <select className="rounded-xl bg-white/5 border border-white/10 px-3 py-2" value={status} onChange={(event) => setStatus(event.target.value)}>
          <option>All</option>
          <option>Active</option>
          <option>At Risk</option>
          <option>Prospect</option>
          <option>Inactive</option>
        </select>
        <select className="rounded-xl bg-white/5 border border-white/10 px-3 py-2" value={industry} onChange={(event) => setIndustry(event.target.value)}>
          <option>All</option>
          {Array.from(new Set(state.clients.map((client) => client.industry))).map((item) => (
            <option key={item}>{item}</option>
          ))}
        </select>
        <input className="rounded-xl bg-white/5 border border-white/10 px-3 py-2 w-40" type="number" placeholder="Min deal value" value={minDealValue} onChange={(event) => setMinDealValue(event.target.value)} />
        <input className="rounded-xl bg-white/5 border border-white/10 px-3 py-2" type="date" value={contactSince} onChange={(event) => setContactSince(event.target.value)} />
        <select className="rounded-xl bg-white/5 border border-white/10 px-3 py-2" value={sortBy} onChange={(event) => setSortBy(event.target.value)}>
          <option>Deal Value</option>
          <option>Name</option>
          <option>Last Contact</option>
        </select>
        <SectionTabs tabs={["Table", "Cards"]} selected={viewMode} setSelected={setViewMode} />
      </Card>

      {clients.length === 0 ? (
        <EmptyState title="No clients found" text="Try a different search or add a new client." />
      ) : (
        <div className="grid gap-5 lg:grid-cols-3">
          <div className="lg:col-span-2">
            {viewMode === "Table" ? (
              <Card className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-slate-400">
                      <th className="pb-2">Client</th>
                      <th className="pb-2">Company</th>
                      <th className="pb-2">Status</th>
                      <th className="pb-2">AI Score</th>
                      <th className="pb-2">Deal Value</th>
                      <th className="pb-2">Last Contact</th>
                      <th className="pb-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {clients.map((client) => {
                      const company = state.companies.find((item) => item.id === client.companyId);
                      return (
                        <tr key={client.id} className="border-t border-white/10 hover:bg-white/5 cursor-pointer" onClick={() => setSelectedClientId(client.id)}>
                          <td className="py-2">{client.name}</td>
                          <td>{company?.name}</td>
                          <td>
                            <Badge tone={statusTones[client.status]}>{client.status}</Badge>
                          </td>
                          <td>{client.aiScore}</td>
                          <td>{currency(client.dealValue)}</td>
                          <td>{shortDate(client.lastContact)}</td>
                          <td className="space-x-2">
                            <button className="hover:text-cyan" onClick={(event) => { event.stopPropagation(); setSelectedClientId(client.id); setEditOpen(true); }}><UserPen size={16} /></button>
                            <button className="hover:text-rose-300" onClick={(event) => { event.stopPropagation(); setDeleteId(client.id); }}><Trash2 size={16} /></button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 gap-4">
                {clients.map((client) => (
                  <Card key={client.id} className="hover:border-cyan/30 transition cursor-pointer" onClick={() => setSelectedClientId(client.id)}>
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-semibold">{client.name}</p>
                        <p className="text-sm text-slate-400">{client.email}</p>
                      </div>
                      <Badge tone={statusTones[client.status]}>{client.status}</Badge>
                    </div>
                    <p className="text-sm mt-2">AI Score: {client.aiScore}</p>
                    <p className="text-sm text-slate-400 mt-1">{currency(client.dealValue)}</p>
                  </Card>
                ))}
              </div>
            )}
          </div>
          <Card>
            {!selectedClient ? (
              <p className="text-slate-400">Select a client to view profile.</p>
            ) : (
              <div className="space-y-4">
                <div>
                  <p className="font-semibold text-lg">{selectedClient.name}</p>
                  <p className="text-sm text-slate-400">{selectedClient.email}</p>
                </div>
                <div className="flex gap-2 flex-wrap">
                  {selectedClient.tags.map((tag) => (
                    <Badge key={tag} tone="cyan">{tag}</Badge>
                  ))}
                </div>
                <div>
                  <p className="text-slate-400 text-sm">Notes</p>
                  <p>{selectedClient.notes}</p>
                </div>
                <div>
                  <p className="text-slate-400 text-sm mb-1">Linked Deals</p>
                  {state.deals.filter((deal) => selectedClient.dealIds.includes(deal.id)).map((deal) => (
                    <div key={deal.id} className="rounded-xl bg-white/5 p-2 text-sm mb-2">
                      <p>{deal.title}</p>
                      <p className="text-slate-400">{currency(deal.value)} • {deal.stage}</p>
                    </div>
                  ))}
                </div>
                <div>
                  <p className="text-slate-400 text-sm mb-1">Linked Contacts</p>
                  {state.contacts.filter((contact) => selectedClient.contactIds.includes(contact.id)).map((contact) => (
                    <div key={contact.id} className="rounded-xl bg-white/5 p-2 text-sm mb-2">
                      <p>{contact.name}</p>
                      <p className="text-slate-400">{contact.email}</p>
                    </div>
                  ))}
                </div>
                <div>
                  <p className="text-slate-400 text-sm mb-1">Activity Timeline</p>
                  {selectedClient.activity.map((item) => (
                    <div key={item.id} className="text-sm border-l border-cyan/40 pl-3 py-1">
                      <p>{item.text}</p>
                      <p className="text-slate-400">{shortDate(item.date)}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </Card>
        </div>
      )}

      <Modal open={createOpen} onClose={() => setCreateOpen(false)} title="Add Client">
        <form className="grid gap-3 md:grid-cols-2" onSubmit={onSubmit}>
          <input required name="name" className="rounded-xl bg-white/5 border border-white/10 px-3 py-2" placeholder="Client name" />
          <input required name="email" type="email" className="rounded-xl bg-white/5 border border-white/10 px-3 py-2" placeholder="Email" />
          <select required name="companyId" className="rounded-xl bg-white/5 border border-white/10 px-3 py-2">
            {companiesOptions.map((company) => (
              <option value={company.id} key={company.id}>{company.name}</option>
            ))}
          </select>
          <select required name="status" className="rounded-xl bg-white/5 border border-white/10 px-3 py-2">
            <option>Active</option>
            <option>Prospect</option>
            <option>At Risk</option>
            <option>Inactive</option>
          </select>
          <input required name="industry" className="rounded-xl bg-white/5 border border-white/10 px-3 py-2" placeholder="Industry" />
          <input required name="dealValue" type="number" className="rounded-xl bg-white/5 border border-white/10 px-3 py-2" placeholder="Deal value" />
          <input required name="lastContact" type="date" className="rounded-xl bg-white/5 border border-white/10 px-3 py-2" />
          <input required name="aiScore" type="number" min={0} max={100} className="rounded-xl bg-white/5 border border-white/10 px-3 py-2" placeholder="AI score" />
          <input name="tags" className="rounded-xl bg-white/5 border border-white/10 px-3 py-2 md:col-span-2" placeholder="Tags comma separated" />
          <textarea name="notes" className="rounded-xl bg-white/5 border border-white/10 px-3 py-2 md:col-span-2" placeholder="Notes" />
          <button className="rounded-xl bg-gradient-to-r from-cyan to-electric text-black px-4 py-2 font-semibold md:col-span-2">Save Client</button>
        </form>
      </Modal>

      <Modal open={editOpen && !!selectedClient} onClose={() => setEditOpen(false)} title="Edit Client">
        {selectedClient && (
          <form className="grid gap-3 md:grid-cols-2" onSubmit={onEdit}>
            <input defaultValue={selectedClient.name} required name="name" className="rounded-xl bg-white/5 border border-white/10 px-3 py-2" />
            <input defaultValue={selectedClient.email} required name="email" className="rounded-xl bg-white/5 border border-white/10 px-3 py-2" />
            <select defaultValue={selectedClient.status} required name="status" className="rounded-xl bg-white/5 border border-white/10 px-3 py-2">
              <option>Active</option>
              <option>Prospect</option>
              <option>At Risk</option>
              <option>Inactive</option>
            </select>
            <input defaultValue={selectedClient.industry} required name="industry" className="rounded-xl bg-white/5 border border-white/10 px-3 py-2" />
            <input defaultValue={selectedClient.dealValue} required name="dealValue" type="number" className="rounded-xl bg-white/5 border border-white/10 px-3 py-2" />
            <input defaultValue={selectedClient.lastContact} required name="lastContact" type="date" className="rounded-xl bg-white/5 border border-white/10 px-3 py-2" />
            <input defaultValue={selectedClient.aiScore} required name="aiScore" type="number" min={0} max={100} className="rounded-xl bg-white/5 border border-white/10 px-3 py-2" />
            <input defaultValue={selectedClient.tags.join(", ")} name="tags" className="rounded-xl bg-white/5 border border-white/10 px-3 py-2 md:col-span-2" />
            <textarea defaultValue={selectedClient.notes} name="notes" className="rounded-xl bg-white/5 border border-white/10 px-3 py-2 md:col-span-2" />
            <button className="rounded-xl bg-gradient-to-r from-cyan to-electric text-black px-4 py-2 font-semibold md:col-span-2">Update Client</button>
          </form>
        )}
      </Modal>

      <ConfirmDialog
        open={!!deleteId}
        title="Delete client"
        description="This removes the client and linked contacts, deals, and events."
        onCancel={() => setDeleteId(null)}
        onConfirm={() => {
          if (deleteId) actions.deleteClient(deleteId);
          setDeleteId(null);
          if (selectedClientId === deleteId) setSelectedClientId(null);
        }}
      />
    </div>
  );
}
