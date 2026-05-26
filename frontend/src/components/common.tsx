import { HTMLAttributes, ReactNode, useEffect } from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";

export const shellCard = "glass p-4";

export function Card({ children, className = "", ...props }: { children: ReactNode; className?: string } & HTMLAttributes<HTMLDivElement>) {
  return <div className={`${shellCard} ${className}`} {...props}>{children}</div>;
}

export function PageHeader({ title, subtitle, right }: { title: string; subtitle: string; right?: ReactNode }) {
  return (
    <div className="glass p-6 flex flex-wrap items-center justify-between gap-3">
      <div>
        <p className="text-xs tracking-[0.25em] uppercase text-cyan">{subtitle}</p>
        <h2 className="text-3xl font-bold mt-1">{title}</h2>
      </div>
      {right}
    </div>
  );
}

export function Badge({ children, tone = "neutral" }: { children: ReactNode; tone?: "neutral" | "cyan" | "green" | "red" | "yellow" }) {
  const toneMap: Record<string, string> = {
    neutral: "bg-white/10 text-slate-200",
    cyan: "bg-cyan/20 text-cyan border border-cyan/40",
    green: "bg-emerald-500/20 text-emerald-300 border border-emerald-400/30",
    red: "bg-rose-500/20 text-rose-300 border border-rose-400/30",
    yellow: "bg-amber-500/20 text-amber-300 border border-amber-400/30"
  };
  return <span className={`text-xs rounded-full px-2 py-1 ${toneMap[tone]}`}>{children}</span>;
}

export function Modal({ open, onClose, title, children }: { open: boolean; onClose: () => void; title: string; children: ReactNode }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <motion.div initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="glass w-full max-w-2xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-xl">{title}</h3>
          <button onClick={onClose} className="rounded-lg p-1 hover:bg-white/10">
            <X size={18} />
          </button>
        </div>
        {children}
      </motion.div>
    </div>
  );
}

export function EmptyState({ title, text }: { title: string; text: string }) {
  return (
    <Card className="text-center py-10">
      <p className="text-lg font-semibold">{title}</p>
      <p className="text-slate-400 mt-2">{text}</p>
    </Card>
  );
}

export function LoadingSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <div key={index} className="glass p-6 animate-pulse">
          <div className="h-4 w-1/2 bg-white/10 rounded mb-3" />
          <div className="h-8 w-3/4 bg-white/10 rounded" />
        </div>
      ))}
    </div>
  );
}

export function ConfirmDialog({
  open,
  title,
  description,
  onCancel,
  onConfirm
}: {
  open: boolean;
  title: string;
  description: string;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <Modal open={open} onClose={onCancel} title={title}>
      <p className="text-slate-300">{description}</p>
      <div className="mt-4 flex justify-end gap-2">
        <button className="rounded-xl border border-white/20 px-4 py-2" onClick={onCancel}>
          Cancel
        </button>
        <button className="rounded-xl bg-rose-500/80 px-4 py-2" onClick={onConfirm}>
          Confirm
        </button>
      </div>
    </Modal>
  );
}

export function ToastStack({ toasts, dismiss }: { toasts: { id: string; text: string }[]; dismiss: (id: string) => void }) {
  useEffect(() => {
    const timers = toasts.map((toast) => setTimeout(() => dismiss(toast.id), 3200));
    return () => timers.forEach(clearTimeout);
  }, [toasts, dismiss]);

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map((toast) => (
        <motion.div key={toast.id} initial={{ x: 30, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="glass px-4 py-3 w-80">
          {toast.text}
        </motion.div>
      ))}
    </div>
  );
}

export function SectionTabs({
  tabs,
  selected,
  setSelected
}: {
  tabs: string[];
  selected: string;
  setSelected: (value: string) => void;
}) {
  return (
    <div className="glass p-2 inline-flex gap-2">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => setSelected(tab)}
          className={`rounded-xl px-3 py-2 text-sm transition ${selected === tab ? "bg-electric/30 border border-cyan/40 text-cyan" : "hover:bg-white/10"}`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}
