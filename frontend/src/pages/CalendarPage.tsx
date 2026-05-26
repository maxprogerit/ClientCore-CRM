import { FormEvent, useMemo, useState } from "react";
import { Plus } from "lucide-react";
import { Badge, Card, Modal, PageHeader, SectionTabs } from "../components/common";
import { useCrm } from "../store/CrmContext";
import { CalendarEvent, EventType } from "../types";
import { shortDate, today } from "../utils/format";

const eventTypes: EventType[] = ["meeting", "task", "deadline", "follow-up", "reminder"];

export function CalendarPage() {
  const { state, actions } = useCrm();
  const [mode, setMode] = useState("Month");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<CalendarEvent | null>(null);
  const [draggingId, setDraggingId] = useState<string | null>(null);

  const byDate = useMemo(() => {
    const map = new Map<string, CalendarEvent[]>();
    state.events.forEach((event) => {
      const existing = map.get(event.date) ?? [];
      map.set(event.date, [...existing, event]);
    });
    return map;
  }, [state.events]);

  const days = Array.from({ length: 31 }, (_, index) => {
    const day = String(index + 1).padStart(2, "0");
    return `2026-05-${day}`;
  });

  const weekEvents = [...state.events]
    .sort((a, b) => `${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`))
    .slice(0, 10);

  const todayEvents = state.events.filter((event) => event.date === today());

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const payload = {
      title: String(form.get("title")),
      date: String(form.get("date")),
      time: String(form.get("time")),
      type: form.get("type") as EventType,
      linkedClientId: String(form.get("linkedClientId") || ""),
      linkedDealId: String(form.get("linkedDealId") || ""),
      notes: String(form.get("notes") || "")
    };
    if (editing) {
      actions.updateEvent({ ...editing, ...payload });
    } else {
      actions.addEvent(payload);
    }
    setOpen(false);
    setEditing(null);
    event.currentTarget.reset();
  };

  return (
    <div className="grid gap-5">
      <PageHeader
        title="Calendar"
        subtitle="Meetings, tasks, deadlines, reminders"
        right={
          <button
            className="rounded-xl bg-gradient-to-r from-cyan to-electric text-black px-4 py-2 font-semibold"
            onClick={() => {
              setEditing(null);
              setOpen(true);
            }}
          >
            <Plus size={16} className="inline mr-2" />
            Add Event
          </button>
        }
      />

      <Card className="flex items-center justify-between flex-wrap gap-2">
        <SectionTabs tabs={["Month", "Week", "Agenda"]} selected={mode} setSelected={setMode} />
      </Card>

      {mode === "Month" && (
        <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-7 gap-3">
          {days.map((date) => (
            <Card
              key={date}
              className={`min-h-32 ${date === today() ? "border-cyan/50" : ""}`}
              onDragOver={(event) => event.preventDefault()}
              onDrop={() => {
                if (!draggingId) return;
                const existing = state.events.find((item) => item.id === draggingId);
                if (existing) actions.updateEvent({ ...existing, date });
                setDraggingId(null);
              }}
            >
              <p className="text-xs text-slate-400">{shortDate(date)}</p>
              <div className="mt-2 space-y-1">
                {(byDate.get(date) ?? []).slice(0, 3).map((event) => (
                  <button
                    key={event.id}
                    draggable
                    onDragStart={() => setDraggingId(event.id)}
                    className="w-full text-left rounded-lg bg-white/10 hover:bg-white/15 p-1 text-xs"
                    onClick={() => {
                      setEditing(event);
                      setOpen(true);
                    }}
                  >
                    {event.time} • {event.title}
                  </button>
                ))}
              </div>
            </Card>
          ))}
        </div>
      )}

      {mode === "Week" && (
        <Card>
          <h3 className="font-semibold mb-3">Weekly View</h3>
          <div className="space-y-2">
            {weekEvents.map((event) => (
              <div key={event.id} className="rounded-xl bg-white/5 p-3 flex items-center justify-between">
                <div>
                  <p>{event.title}</p>
                  <p className="text-xs text-slate-400">{shortDate(event.date)} {event.time}</p>
                </div>
                <Badge tone="cyan">{event.type}</Badge>
              </div>
            ))}
          </div>
        </Card>
      )}

      {mode === "Agenda" && (
        <div className="grid md:grid-cols-2 gap-5">
          <Card>
            <h3 className="font-semibold mb-3">Today Schedule</h3>
            {todayEvents.length === 0 ? (
              <p className="text-slate-400 text-sm">No events today.</p>
            ) : (
              todayEvents.map((event) => (
                <div key={event.id} className="rounded-xl bg-white/5 p-3 mb-2">
                  <p>{event.title}</p>
                  <p className="text-sm text-slate-400">{event.time} • {event.type}</p>
                </div>
              ))
            )}
          </Card>
          <Card>
            <h3 className="font-semibold mb-3">Upcoming Meetings Panel</h3>
            {state.events
              .filter((event) => event.type === "meeting")
              .slice(0, 5)
              .map((event) => (
                <div key={event.id} className="rounded-xl bg-white/5 p-3 mb-2">
                  <p>{event.title}</p>
                  <p className="text-sm text-slate-400">{shortDate(event.date)} {event.time}</p>
                </div>
              ))}
          </Card>
        </div>
      )}

      <Modal open={open} onClose={() => setOpen(false)} title={editing ? "Edit Event" : "Add Event"}>
        <form className="grid gap-3 md:grid-cols-2" onSubmit={submit}>
          <input name="title" required defaultValue={editing?.title} className="rounded-xl bg-white/5 border border-white/10 px-3 py-2" placeholder="Event title" />
          <select name="type" defaultValue={editing?.type ?? "meeting"} className="rounded-xl bg-white/5 border border-white/10 px-3 py-2">
            {eventTypes.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
          <input name="date" required type="date" defaultValue={editing?.date ?? today()} className="rounded-xl bg-white/5 border border-white/10 px-3 py-2" />
          <input name="time" required type="time" defaultValue={editing?.time ?? "10:00"} className="rounded-xl bg-white/5 border border-white/10 px-3 py-2" />
          <select name="linkedClientId" defaultValue={editing?.linkedClientId ?? ""} className="rounded-xl bg-white/5 border border-white/10 px-3 py-2">
            <option value="">No linked client</option>
            {state.clients.map((client) => (
              <option key={client.id} value={client.id}>{client.name}</option>
            ))}
          </select>
          <select name="linkedDealId" defaultValue={editing?.linkedDealId ?? ""} className="rounded-xl bg-white/5 border border-white/10 px-3 py-2">
            <option value="">No linked deal</option>
            {state.deals.map((deal) => (
              <option key={deal.id} value={deal.id}>{deal.title}</option>
            ))}
          </select>
          <textarea name="notes" defaultValue={editing?.notes} className="rounded-xl bg-white/5 border border-white/10 px-3 py-2 md:col-span-2" placeholder="Notes" />
          <button className="rounded-xl bg-gradient-to-r from-cyan to-electric text-black px-4 py-2 font-semibold md:col-span-2">{editing ? "Update Event" : "Create Event"}</button>
        </form>
      </Modal>
    </div>
  );
}
