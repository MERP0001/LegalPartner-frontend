"use client";
import { useEffect, useRef, useState } from "react";
import { chatbotAsk } from "@/lib/api";
import type { ConsultationResponseData } from "@/types";
import { MessageCircle, X, Loader2, Send } from "lucide-react";

type ChatMsg = { role: "user" | "assistant"; content: string; meta?: Partial<ConsultationResponseData> };

const SUGGESTIONS = [
  "Cláusulas clave en contratos de alquiler",
  "Penalidades por rescisión anticipada",
  "Cómo negociar confidencialidad",
];

export default function ChatbotWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const send = async (q: string) => {
    if (!q || q.trim().length < 3) return;
    setError(null);
    setInput("");
    const userMsg: ChatMsg = { role: "user", content: q };
    setMessages(prev => [...prev, userMsg, { role: "assistant", content: "Escribiendo…" }]);
    setLoading(true);
    try {
      const res = await chatbotAsk(q);
      if (res.success) {
        const d = res.data;
        const assistant: ChatMsg = { role: "assistant", content: d.response, meta: d };
        setMessages(prev => [...prev.slice(0, -1), assistant]);
      } else {
        setError(res.message || "No se pudo procesar la consulta");
        setMessages(prev => [...prev.slice(0, -1), { role: "assistant", content: "No pude procesar la consulta." }]);
      }
    } catch {
      setError("Error al contactar el chatbot");
      setMessages(prev => [...prev.slice(0, -1), { role: "assistant", content: "Ocurrió un error." }]);
    } finally {
      setLoading(false);
      setInput("");
    }
  };

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, open]);

  return (
    <>
      <button
        onClick={() => setOpen(o => !o)}
        aria-label="Abrir chatbot"
        className="fixed bottom-6 right-6 z-50 h-12 w-12 rounded-full bg-gradient-to-br from-primary-600 to-primary-700 text-white shadow-xl ring-2 ring-primary-300/50 flex items-center justify-center hover:brightness-105"
      >
        <MessageCircle className="h-6 w-6" />
      </button>

      {open && (
        <div className="fixed bottom-24 right-6 z-50 w-[22rem] sm:w-96 card-premium">
          <div className="card-premium-inner rounded-t-2xl bg-white/90 px-3 py-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5" />
              <span className="text-sm font-semibold">Chatbot Legal</span>
            </div>
            <button onClick={() => setOpen(false)} className="text-gray-700/80 hover:text-gray-900">
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="card-premium-inner rounded-b-none p-3 border-b-0">
            <div className="flex flex-wrap gap-2">
              {SUGGESTIONS.map(s => (
                <button
                  key={s}
                  onClick={() => send(s)}
                  className="badge-soft bg-primary-50 text-primary-700"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div ref={scrollRef} className="card-premium-inner p-3 max-h-80 overflow-y-auto space-y-3">
            {messages.length === 0 && (
              <div className="text-gray-600 text-sm">Haz una pregunta legal para comenzar.</div>
            )}
            {messages.map((m, idx) => (
              <div key={idx} className={`max-w-[85%] ${m.role === "user" ? "ml-auto" : ""}`}>
                <div className={`p-2 rounded-xl shadow-sm text-sm ${m.role === "user" ? "bg-gradient-to-br from-secondary-600 to-secondary-700 text-white" : "bg-white/90 text-gray-900 ring-1 ring-gray-100/60"}`}>{m.content}</div>
                {m.role === "assistant" && m.meta && (
                  <div className="mt-2 space-y-2">
                    {m.meta.sources && m.meta.sources.length > 0 && (
                      <div className="text-xs text-gray-600">{m.meta.sources.length} fuentes relacionadas</div>
                    )}
                    {m.meta.confidence_score !== undefined && (
                      <div className="text-xs text-gray-700">Confianza: {Math.round((m.meta.confidence_score || 0) * 100)}%</div>
                    )}
                  </div>
                )}
              </div>
            ))}
            {loading && (
              <div className="flex items-center gap-2 text-gray-600 text-sm">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Procesando…</span>
              </div>
            )}
            {error && <div className="text-xs text-danger-600">{error}</div>}
          </div>
          <div className="card-premium-inner rounded-t-none p-3">
            <form
              onSubmit={e => {
                e.preventDefault();
                if (input.trim()) send(input.trim());
              }}
              className="flex items-center gap-2"
            >
              <input
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Escribe tu consulta…"
                className="flex-1 rounded-md border px-3 py-2 text-sm bg-white/90 ring-1 ring-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-600"
              />
              <button
                type="submit"
                disabled={loading}
                className="h-9 px-3 rounded-md bg-gradient-to-br from-primary-600 to-primary-700 text-white hover:brightness-105 disabled:opacity-50 flex items-center gap-1 shadow-sm"
              >
                <Send className="h-4 w-4" />
                Enviar
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}