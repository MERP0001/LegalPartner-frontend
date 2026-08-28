"use client";
import { useEffect, useRef } from "react";
import { useChatbot } from "@/hooks/useChatbot";
import { Button } from "@/components/common/Button";
import Protected from "@/components/layout/Protected";

const SUGGESTIONS = [
  "¿Qué cláusulas revisar en un contrato de alquiler?",
  "¿Penalidades por rescisión anticipada?",
  "¿Cómo negociar una cláusula de confidencialidad?",
  "¿Qué pasa si el pago se retrasa?",
];

export default function ChatbotPage() {
  const { messages, input, setInput, loading, error, send } = useChatbot();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages.length]);

  return (
    <div className="min-h-screen">
      <Protected />
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="card-premium">
          <div className="card-premium-inner">
            <h2 className="text-lg font-semibold text-gray-900">Chatbot Legal</h2>
            <p className="text-sm text-gray-600">Haz preguntas y recibe respuestas con contexto legal</p>
          </div>
        </div>
        <div className="panel rounded-t-none">
          <div className="p-4 border-b">
            <div className="flex flex-wrap gap-2">
              {SUGGESTIONS.map(s => (
                <button key={s} onClick={() => send(s)} className="badge-soft bg-primary-50 text-primary-700">{s}</button>
              ))}
            </div>
          </div>
          <div ref={scrollRef} className="p-4 h-[60vh] overflow-y-auto space-y-3">
            {messages.length === 0 && (
              <div className="text-gray-600">Haz una pregunta legal para comenzar.</div>
            )}
            {messages.map((m, idx) => (
              <div key={idx} className={`max-w-[80%] ${m.role === 'user' ? 'ml-auto' : ''}`}>
                <div className={`p-3 rounded-xl shadow-sm ${m.role === 'user' ? 'bg-gradient-to-br from-secondary-600 to-secondary-700 text-white' : 'bg-white/90 text-gray-900 ring-1 ring-gray-100/60'}`}>{m.content}</div>
                {m.role === 'assistant' && m.meta && (
                  <div className="mt-2 space-y-2">
                    <div className="text-xs text-gray-600">Confianza: {(m.meta.confidence_score ?? 0).toFixed(2)} · Tiempo: {(m.meta.response_time_seconds ?? 0).toFixed(1)}s</div>
                    {m.meta.sources && m.meta.sources.length > 0 && (
                      <div className="bg-white/90 ring-1 ring-gray-100/60 rounded p-2">
                        <div className="text-xs text-gray-600 mb-1">Fuentes:</div>
                        <ul className="list-disc list-inside text-xs text-gray-800">
                          {m.meta.sources.slice(0, 4).map((src, i) => (
                            <li key={i}>{src.article_reference || src.type} {typeof src.relevance_score === 'number' ? `(${(src.relevance_score*100).toFixed(0)}%)` : ''}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {m.meta.related_questions && m.meta.related_questions.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {m.meta.related_questions.slice(0, 3).map((rq, i) => (
                          <button key={i} onClick={() => send(rq)} className="badge-soft bg-secondary-50 text-secondary-700">{rq}</button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
          {error && <div className="px-4 text-danger-600 text-sm">{error}</div>}
          <div className="p-4 border-t">
            <div className="flex gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Escribe tu pregunta legal..."
                className="flex-1 rounded-md bg-white/90 ring-1 ring-gray-200 focus:border-primary-600 focus:ring-primary-600"
              />
              <Button className="bg-primary-600 hover:bg-primary-700 shadow-sm" disabled={loading} onClick={() => send(input)}>Enviar</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}