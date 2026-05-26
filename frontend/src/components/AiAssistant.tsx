import { useState } from "react";
import { Bot, MessageCircle, Send } from "lucide-react";
import { useCrm } from "../store/CrmContext";

const quickPrompts = [
  "Summarize today’s client activity",
  "Which deals need attention?",
  "Show revenue forecast",
  "Find high value clients",
  "Suggest follow up tasks"
];

export function AiAssistant() {
  const { state, actions } = useCrm();
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");

  const sendMessage = (text: string) => {
    if (!text.trim()) return;
    actions.sendAssistantMessage(text.trim());
    setMessage("");
  };

  return (
    <>
      <button
        className="fixed bottom-5 right-5 z-40 rounded-full bg-gradient-to-r from-cyan to-electric text-black p-4 shadow-glow"
        onClick={() => setOpen((value) => !value)}
      >
        <MessageCircle size={18} />
      </button>
      {open && (
        <div className="fixed bottom-24 right-5 z-40 w-[360px] glass p-4">
          <div className="flex items-center gap-2 mb-3">
            <Bot className="text-cyan" size={18} />
            <p className="font-semibold">AI Assistant</p>
          </div>

          <div className="h-72 overflow-auto space-y-2 pr-1">
            {state.assistantMessages.map((item) => (
              <div key={item.id} className={`rounded-xl p-2 text-sm ${item.sender === "assistant" ? "bg-white/10" : "bg-electric/30 text-cyan"}`}>
                {item.text}
              </div>
            ))}
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            {quickPrompts.map((prompt) => (
              <button key={prompt} className="rounded-full border border-white/20 px-2 py-1 text-xs hover:border-cyan" onClick={() => sendMessage(prompt)}>
                {prompt}
              </button>
            ))}
          </div>

          <div className="mt-3 flex gap-2">
            <input
              className="flex-1 rounded-xl bg-white/5 border border-white/10 px-3 py-2 text-sm"
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              placeholder="Ask about pipeline, clients, forecast..."
            />
            <button className="rounded-xl bg-electric/40 border border-cyan/50 px-3" onClick={() => sendMessage(message)}>
              <Send size={16} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
