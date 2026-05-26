import { FormEvent, useMemo, useState } from "react";
import { CalendarPlus, Mail, Phone, Plus, UsersRound } from "lucide-react";
import { Badge, Card, EmptyState, Modal, PageHeader, SectionTabs } from "../components/common";
import { useCrm } from "../store/CrmContext";
import { Contact } from "../types";
import { shortDate } from "../utils/format";

export function ContactsPage() {
  const { state, actions } = useCrm();
  const [query, setQuery] = useState("");
  const [view, setView] = useState("Table");
  const [roleFilter, setRoleFilter] = useState("All");
  const [sortBy, setSortBy] = useState("Recent");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Contact | null>(null);

  const contacts = useMemo(
    () =>
      state.contacts
        .filter((contact) => {
        const company = state.companies.find((item) => item.id === contact.companyId)?.name ?? "";
        const search = `${contact.name} ${contact.email} ${company} ${contact.role}`.toLowerCase();
        const roleMatch = roleFilter === "All" || contact.role === roleFilter;
        return search.includes(query.toLowerCase()) && roleMatch;
      })
        .sort((a, b) => (sortBy === "Recent" ? b.lastCommunication.localeCompare(a.lastCommunication) : a.name.localeCompare(b.name))),
    [state.contacts, state.companies, query, roleFilter, sortBy]
  );

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const payload = {
      name: String(form.get("name")),
      email: String(form.get("email")),
      phone: String(form.get("phone")),
      role: String(form.get("role")),
      companyId: String(form.get("companyId")),
      clientId: String(form.get("clientId")),
      lastCommunication: String(form.get("lastCommunication")),
      tags: String(form.get("tags") || "")
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
      notes: String(form.get("notes") || "")
    };
    if (editing) {
      actions.updateContact({ ...editing, ...payload });
    } else {
      actions.addContact(payload);
    }
    setModalOpen(false);
    setEditing(null);
    event.currentTarget.reset();
  };

  return (
    <div className="grid gap-5">
      <PageHeader
        title="Contacts"
        subtitle="Communication and relationship intelligence"
        right={
          <button
            className="rounded-xl bg-gradient-to-r from-cyan to-electric text-black px-4 py-2 font-semibold"
            onClick={() => {
              setEditing(null);
              setModalOpen(true);
            }}
          >
            <Plus size={16} className="inline mr-2" />
            Add Contact
          </button>
        }
      />

      <Card className="flex flex-wrap gap-2 items-center">
        <input className="rounded-xl bg-white/5 border border-white/10 px-3 py-2 w-72" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search contacts, role, company..." />
        <select value={roleFilter} onChange={(event) => setRoleFilter(event.target.value)} className="rounded-xl bg-white/5 border border-white/10 px-3 py-2">
          <option>All</option>
          {Array.from(new Set(state.contacts.map((contact) => contact.role))).map((role) => (
            <option key={role}>{role}</option>
          ))}
        </select>
        <select value={sortBy} onChange={(event) => setSortBy(event.target.value)} className="rounded-xl bg-white/5 border border-white/10 px-3 py-2">
          <option>Recent</option>
          <option>Name</option>
        </select>
        <SectionTabs tabs={["Table", "Cards"]} selected={view} setSelected={setView} />
      </Card>

      {contacts.length === 0 ? (
        <EmptyState title="No contacts found" text="Add a contact to start communication tracking." />
      ) : view === "Table" ? (
        <Card className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-400">
                <th className="pb-2">Contact</th>
                <th className="pb-2">Linked Company</th>
                <th className="pb-2">Linked Client</th>
                <th className="pb-2">Role</th>
                <th className="pb-2">Last Communication</th>
                <th className="pb-2">Quick Actions</th>
              </tr>
            </thead>
            <tbody>
              {contacts.map((contact) => (
                <tr key={contact.id} className="border-t border-white/10 hover:bg-white/5">
                  <td className="py-2">
                    <p>{contact.name}</p>
                    <p className="text-xs text-slate-400">{contact.email}</p>
                  </td>
                  <td>{state.companies.find((item) => item.id === contact.companyId)?.name}</td>
                  <td>{state.clients.find((item) => item.id === contact.clientId)?.name}</td>
                  <td>{contact.role}</td>
                  <td>{shortDate(contact.lastCommunication)}</td>
                  <td>
                    <div className="flex gap-2">
                      <button title="Call" className="rounded-lg border border-white/20 p-1 hover:border-cyan"><Phone size={14} /></button>
                      <button title="Email" className="rounded-lg border border-white/20 p-1 hover:border-cyan"><Mail size={14} /></button>
                      <button title="Meeting" className="rounded-lg border border-white/20 p-1 hover:border-cyan"><CalendarPlus size={14} /></button>
                      <button
                        title="Edit"
                        className="rounded-lg border border-white/20 px-2 text-xs hover:border-cyan"
                        onClick={() => {
                          setEditing(contact);
                          setModalOpen(true);
                        }}
                      >
                        Edit
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {contacts.map((contact) => (
            <Card key={contact.id} className="hover:border-cyan/30 transition">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold">{contact.name}</p>
                  <p className="text-sm text-slate-400">{contact.role}</p>
                </div>
                <UsersRound className="text-cyan" size={18} />
              </div>
              <p className="text-sm mt-3">{contact.email}</p>
              <p className="text-sm text-slate-400">{contact.phone}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {contact.tags.map((tag) => (
                  <Badge key={tag} tone="cyan">{tag}</Badge>
                ))}
              </div>
              <p className="text-xs text-slate-400 mt-3">Last communication {shortDate(contact.lastCommunication)}</p>
            </Card>
          ))}
        </div>
      )}

      <Card>
        <h3 className="font-semibold mb-3">Communication History</h3>
        <div className="grid gap-3 md:grid-cols-2">
          {contacts.slice(0, 2).map((contact) => (
            <div key={contact.id} className="rounded-xl bg-white/5 p-3">
              <p className="font-medium">{contact.name}</p>
              <div className="mt-2 space-y-2">
                {contact.communicationHistory.map((history) => (
                  <div key={history.id} className="text-sm border-l border-cyan/40 pl-2">
                    <p>{history.text}</p>
                    <p className="text-slate-400">{shortDate(history.date)}</p>
                  </div>
                ))}
              </div>
              <p className="text-sm mt-3 text-slate-300">{contact.notes}</p>
            </div>
          ))}
        </div>
      </Card>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "Edit Contact" : "Add Contact"}>
        <form onSubmit={onSubmit} className="grid gap-3 md:grid-cols-2">
          <input required name="name" defaultValue={editing?.name} className="rounded-xl bg-white/5 border border-white/10 px-3 py-2" placeholder="Name" />
          <input required name="email" type="email" defaultValue={editing?.email} className="rounded-xl bg-white/5 border border-white/10 px-3 py-2" placeholder="Email" />
          <input required name="phone" defaultValue={editing?.phone} className="rounded-xl bg-white/5 border border-white/10 px-3 py-2" placeholder="Phone" />
          <input required name="role" defaultValue={editing?.role} className="rounded-xl bg-white/5 border border-white/10 px-3 py-2" placeholder="Role" />
          <select name="companyId" defaultValue={editing?.companyId ?? state.companies[0]?.id} className="rounded-xl bg-white/5 border border-white/10 px-3 py-2">
            {state.companies.map((company) => (
              <option key={company.id} value={company.id}>{company.name}</option>
            ))}
          </select>
          <select name="clientId" defaultValue={editing?.clientId ?? state.clients[0]?.id} className="rounded-xl bg-white/5 border border-white/10 px-3 py-2">
            {state.clients.map((client) => (
              <option key={client.id} value={client.id}>{client.name}</option>
            ))}
          </select>
          <input required name="lastCommunication" defaultValue={editing?.lastCommunication} type="date" className="rounded-xl bg-white/5 border border-white/10 px-3 py-2" />
          <input name="tags" defaultValue={editing?.tags.join(", ")} className="rounded-xl bg-white/5 border border-white/10 px-3 py-2" placeholder="Tags" />
          <textarea name="notes" defaultValue={editing?.notes} className="rounded-xl bg-white/5 border border-white/10 px-3 py-2 md:col-span-2" placeholder="Notes" />
          <button className="rounded-xl bg-gradient-to-r from-cyan to-electric text-black px-4 py-2 font-semibold md:col-span-2">{editing ? "Update Contact" : "Create Contact"}</button>
        </form>
      </Modal>
    </div>
  );
}
