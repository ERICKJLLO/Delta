import { useState, useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Bot, Send, FileText, Sparkles, Loader2 } from "lucide-react";
import { getAIRecommendations, getEventHistory, RISK_LEVELS } from "../services/riskEngine";
import { usePlan } from "../context/PlanContext";
import { api } from "../services/api";

/**
 * Renderiza texto markdown básico (negritas, cursiva, tablas, listas, headers, código inline)
 */
function MarkdownText({ text }) {
  const lines = text.split('\n');
  const elements = [];
  let inTable = false;
  let tableRows = [];
  let inList = false;
  let listItems = [];
  let listType = 'ul';

  const flushTable = () => {
    if (tableRows.length > 0) {
      elements.push(
        <div key={`table-${elements.length}`} className="overflow-x-auto my-3">
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="border-b border-gray-700">
                {tableRows[0].map((cell, ci) => (
                  <th key={ci} className="text-left p-2 text-gray-300 font-semibold">{formatInline(cell.trim())}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tableRows.slice(2).map((row, ri) => (
                <tr key={ri} className="border-b border-gray-800/50 hover:bg-white/[0.02]">
                  {row.map((cell, ci) => (
                    <td key={ci} className="p-2 text-gray-400">{formatInline(cell.trim())}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
      tableRows = [];
    }
  };

  const flushList = () => {
    if (listItems.length > 0) {
      const Tag = listType === 'ol' ? 'ol' : 'ul';
      elements.push(
        <Tag key={`list-${elements.length}`} className={`my-2 space-y-1 text-sm ${listType === 'ol' ? 'list-decimal' : 'list-disc'} pl-5`}>
          {listItems.map((item, i) => (
            <li key={i} className="text-gray-300">{formatInline(item)}</li>
          ))}
        </Tag>
      );
      listItems = [];
      inList = false;
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Tabla
    if (line.includes('|') && line.trim().startsWith('|')) {
      if (!inTable) {
        flushList();
        inTable = true;
      }
      const cells = line.split('|').filter((_, idx, arr) => idx > 0 && idx < arr.length - 1);
      // Saltar la línea separadora (|---|---|)
      if (cells.every(c => /^[\s\-:]+$/.test(c))) {
        tableRows.push(cells); // keep it for slice(2) logic
        continue;
      }
      tableRows.push(cells);
      continue;
    } else if (inTable) {
      flushTable();
      inTable = false;
    }

    // Encabezados
    if (line.startsWith('## ')) {
      flushList();
      elements.push(<h3 key={i} className="text-white font-bold text-sm mt-3 mb-1.5 flex items-center gap-1.5">{formatInline(line.slice(3))}</h3>);
      continue;
    }
    if (line.startsWith('### ')) {
      flushList();
      elements.push(<h4 key={i} className="text-gray-200 font-semibold text-xs mt-2.5 mb-1">{formatInline(line.slice(4))}</h4>);
      continue;
    }

    // Listas con - o *
    if (/^\s*[-*]\s/.test(line)) {
      if (!inList) {
        inList = true;
        listType = 'ul';
      }
      listItems.push(line.replace(/^\s*[-*]\s+/, ''));
      continue;
    }
    // Listas numeradas
    if (/^\s*\d+\.\s/.test(line)) {
      if (!inList) {
        inList = true;
        listType = 'ol';
      }
      listItems.push(line.replace(/^\s*\d+\.\s+/, ''));
      continue;
    }

    // Si terminó la lista
    if (inList) {
      flushList();
    }

    // Línea vacía
    if (line.trim() === '') {
      elements.push(<div key={i} className="h-1.5" />);
      continue;
    }

    // Cursiva standalone (líneas que empiezan con _)
    if (line.trim().startsWith('_') && line.trim().endsWith('_')) {
      elements.push(<p key={i} className="text-xs text-gray-500 italic mt-2">{formatInline(line.trim())}</p>);
      continue;
    }

    // Párrafo normal
    elements.push(<p key={i} className="text-sm text-gray-300 leading-relaxed">{formatInline(line)}</p>);
  }

  // Flush remaining
  if (inTable) flushTable();
  if (inList) flushList();

  return <div>{elements}</div>;
}

/**
 * Formato inline: negritas, cursiva, código, emojis
 */
function formatInline(text) {
  if (!text) return text;
  
  const parts = [];
  let remaining = text;
  let keyIdx = 0;

  while (remaining.length > 0) {
    // Código inline `...`
    const codeMatch = remaining.match(/^(.*?)`([^`]+)`/);
    if (codeMatch) {
      if (codeMatch[1]) parts.push(codeMatch[1]);
      parts.push(<code key={keyIdx++} className="px-1.5 py-0.5 bg-gray-800 rounded text-blue-300 text-[11px] font-mono">{codeMatch[2]}</code>);
      remaining = remaining.slice(codeMatch[0].length);
      continue;
    }

    // Negrita **...**
    const boldMatch = remaining.match(/^(.*?)\*\*([^*]+)\*\*/);
    if (boldMatch) {
      if (boldMatch[1]) parts.push(boldMatch[1]);
      parts.push(<strong key={keyIdx++} className="text-white font-semibold">{boldMatch[2]}</strong>);
      remaining = remaining.slice(boldMatch[0].length);
      continue;
    }

    // Cursiva *...* o _..._
    const italicMatch = remaining.match(/^(.*?)(?:\*([^*]+)\*|_([^_]+)_)/);
    if (italicMatch) {
      if (italicMatch[1]) parts.push(italicMatch[1]);
      parts.push(<em key={keyIdx++} className="text-gray-400 italic">{italicMatch[2] || italicMatch[3]}</em>);
      remaining = remaining.slice(italicMatch[0].length);
      continue;
    }

    // No hay más formato
    parts.push(remaining);
    break;
  }

  return parts.length === 1 && typeof parts[0] === 'string' ? parts[0] : <>{parts}</>;
}

function DeltaAIPage() {
  const location = useLocation();
  const contextRisk = location.state?.risk;
  const { planId } = usePlan();
  const [query, setQuery] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const [messages, setMessages] = useState(() => {
    const initial = [
      {
        role: "assistant",
        content:
          "¡Hola! 👋 Soy **Delta AI**, tu asistente inteligente de seguridad financiera. Puedo ayudarte con análisis de riesgos, recomendaciones de seguridad y generación de reportes.\n\n¿En qué puedo asistirte hoy?",
      },
    ];
    if (contextRisk) {
      initial.push({
        role: "assistant",
        content: `⚠️ He detectado un evento de riesgo ${RISK_LEVELS[contextRisk.level]?.label.toLowerCase()}: **"${contextRisk.title}"**. Aquí tienes mis recomendaciones automáticas.`,
      });
    }
    return initial;
  });

  const [suggestions, setSuggestions] = useState([
    "¿Cuáles son las transacciones sospechosas?",
    "Generar reporte de seguridad",
    "¿Cuál es el nivel de riesgo actual?"
  ]);

  const history = getEventHistory();
  const recommendations = contextRisk
    ? getAIRecommendations(contextRisk.level)
    : getAIRecommendations("medium");

  // Auto-scroll al último mensaje
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // Obtener transacciones del localStorage para enviar contexto
  function getTransactions() {
    try {
      const saved = localStorage.getItem("delta_suspicious_transactions");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  }

  async function handleSend(e) {
    e?.preventDefault();
    const userMsg = query.trim();
    if (!userMsg || isTyping) return;

    setMessages((prev) => [...prev, { role: "user", content: userMsg }]);
    setQuery("");
    setIsTyping(true);

    try {
      const transactions = getTransactions();
      const data = await api.chatWithAI(userMsg, planId, transactions, {
        risk: contextRisk,
      });

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.response },
      ]);

      if (data.suggestions && data.suggestions.length > 0) {
        setSuggestions(data.suggestions);
      }
    } catch (error) {
      console.error("Delta AI Error:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "⚠️ Lo siento, hubo un error al procesar tu solicitud. Por favor intenta de nuevo.",
        },
      ]);
    } finally {
      setIsTyping(false);
      inputRef.current?.focus();
    }
  }

  function handleSuggestionClick(suggestion) {
    setQuery(suggestion);
    // Enviar automáticamente
    setMessages((prev) => [...prev, { role: "user", content: suggestion }]);
    setQuery("");
    setIsTyping(true);

    const transactions = getTransactions();
    api.chatWithAI(suggestion, planId, transactions, { risk: contextRisk })
      .then((data) => {
        setMessages((prev) => [...prev, { role: "assistant", content: data.response }]);
        if (data.suggestions?.length > 0) setSuggestions(data.suggestions);
      })
      .catch(() => {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: "⚠️ Error al procesar la solicitud." },
        ]);
      })
      .finally(() => setIsTyping(false));
  }

  return (
    <div className="space-y-6 h-full flex flex-col">
      <div>
        <h1 className="text-white mb-2 text-2xl font-medium flex items-center gap-2">
          <Bot className="w-7 h-7 text-blue-400" />
          Delta AI — Asistente Inteligente
        </h1>
        <p className="text-gray-400">
          Consulta recomendaciones, análisis automático y generación de reportes
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 flex-1 min-h-0">
        {/* Chat principal */}
        <div className="xl:col-span-2 flex flex-col rounded-xl bg-[#13141b] border border-gray-800 overflow-hidden min-h-[500px]">
          <div className="flex-1 overflow-auto p-4 space-y-4">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} animate-fadeIn`}
              >
                <div
                  className={`max-w-[85%] p-3.5 rounded-xl text-sm ${
                    msg.role === "user"
                      ? "bg-blue-600 text-white rounded-br-sm"
                      : "bg-gray-800/80 text-gray-200 rounded-bl-sm border border-gray-700/30"
                  }`}
                >
                  {msg.role === "assistant" && (
                    <div className="flex items-center gap-1.5 mb-2">
                      <div className="w-5 h-5 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                        <Sparkles className="w-3 h-3 text-white" />
                      </div>
                      <span className="text-[10px] text-gray-500 font-medium uppercase tracking-wider">Delta AI</span>
                    </div>
                  )}
                  {msg.role === "assistant" ? (
                    <MarkdownText text={msg.content} />
                  ) : (
                    msg.content
                  )}
                </div>
              </div>
            ))}

            {/* Indicador de escritura */}
            {isTyping && (
              <div className="flex justify-start animate-fadeIn">
                <div className="bg-gray-800/80 border border-gray-700/30 rounded-xl rounded-bl-sm p-3.5 flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                    <Loader2 className="w-3 h-3 text-white animate-spin" />
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-xs text-gray-400">Delta AI está escribiendo</span>
                    <span className="flex gap-0.5">
                      {[0, 1, 2].map(i => (
                        <span
                          key={i}
                          className="w-1.5 h-1.5 bg-blue-400 rounded-full"
                          style={{
                            animation: `typingDot 1.4s ease-in-out ${i * 0.2}s infinite`
                          }}
                        />
                      ))}
                    </span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Sugerencias rápidas */}
          {suggestions.length > 0 && !isTyping && (
            <div className="px-4 py-2 border-t border-gray-800/50 flex flex-wrap gap-2">
              {suggestions.map((sug, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleSuggestionClick(sug)}
                  className="px-3 py-1.5 text-[11px] bg-gray-800/60 hover:bg-gray-700/60 text-gray-400 hover:text-white border border-gray-700/40 rounded-full transition-all active:scale-95"
                >
                  {sug}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <form onSubmit={handleSend} className="p-4 border-t border-gray-800 flex gap-2">
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Consulta análisis, recomendaciones o reportes..."
              disabled={isTyping}
              className="flex-1 px-4 py-2.5 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={isTyping || !query.trim()}
              className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:bg-gray-700 disabled:cursor-not-allowed text-white rounded-lg transition-all active:scale-95"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>

        {/* Panel lateral */}
        <div className="space-y-4">
          <div className="p-5 rounded-xl bg-[#13141b] border border-gray-800">
            <h3 className="text-white text-sm font-medium mb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-400" />
              Recomendaciones automáticas
            </h3>
            <ul className="space-y-2">
              {recommendations.map((rec) => (
                <li key={rec} className="text-sm text-gray-400 flex gap-2">
                  <span className="text-blue-400">•</span>
                  {rec}
                </li>
              ))}
            </ul>
          </div>

          <div className="p-5 rounded-xl bg-[#13141b] border border-gray-800">
            <h3 className="text-white text-sm font-medium mb-3 flex items-center gap-2">
              <FileText className="w-4 h-4 text-green-400" />
              Historial de eventos ({history.length})
            </h3>
            {history.length === 0 ? (
              <p className="text-sm text-gray-500">Sin eventos registrados aún</p>
            ) : (
              <ul className="space-y-2 max-h-48 overflow-auto">
                {history.slice(0, 5).map((event) => (
                  <li key={event.id} className="text-xs text-gray-400 border-b border-gray-800 pb-2">
                    <span className={RISK_LEVELS[event.level]?.color}>
                      [{RISK_LEVELS[event.level]?.label}]
                    </span>{" "}
                    {event.title}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DeltaAIPage;
