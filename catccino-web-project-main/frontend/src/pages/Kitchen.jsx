import { useCallback, useEffect, useState } from "react";
import { kitchenApi } from "../api/services.js";
import { Chip, EmptyState } from "../components/UI.jsx";
import StatusBadge from "../components/StatusBadge.jsx";
import { useToast } from "../context/ToastContext.jsx";

const FILTERS = [
  { value: "", label: "Todos" },
  { value: "pending", label: "Pendentes" },
  { value: "preparing", label: "Em preparo" },
  { value: "ready", label: "Prontos" },
  { value: "delivered", label: "Entregues" },
];

const NEXT_ACTION = { pending: "start", preparing: "ready", ready: "delivered" };
const ACTION_LABEL = { start: "Iniciar preparo", ready: "Marcar pronto", delivered: "Marcar entregue" };

export default function Kitchen() {
  const [filter, setFilter] = useState("");
  const [tickets, setTickets] = useState([]);
  const [status, setStatus] = useState("loading");
  const [errorMsg, setErrorMsg] = useState("");
  const showToast = useToast();

  const load = useCallback(() => {
    setStatus("loading");
    kitchenApi
      .list(filter || undefined)
      .then((res) => {
        setTickets(res);
        setStatus("ready");
      })
      .catch((err) => {
        setErrorMsg(err.message);
        setStatus("error");
      });
  }, [filter]);

  useEffect(() => {
    load();
  }, [load]);

  async function handleAdvance(ticketId, action) {
    try {
      await kitchenApi.advance(ticketId, action);
      showToast("Status do ticket atualizado.");
      load();
    } catch (err) {
      showToast(err.message, true);
    }
  }

  return (
    <section>
      <div className="mb-5 flex flex-wrap items-baseline justify-between gap-3">
        <div>
          <h2 className="text-2xl">Painel da cozinha</h2>
          <p className="mt-1 text-sm text-ink-soft">
            Visão operacional dos tickets de preparo (demonstração do serviço Kitchen).
          </p>
        </div>
        <button onClick={load} className="rounded-full px-3 py-1.5 text-sm font-semibold text-coffee hover:bg-cream-2">
          ↻ Atualizar
        </button>
      </div>

      <div className="mb-5 flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <Chip key={f.value} active={filter === f.value} onClick={() => setFilter(f.value)}>
            {f.label}
          </Chip>
        ))}
      </div>

      {status === "loading" && <EmptyState>Carregando tickets…</EmptyState>}
      {status === "error" && <EmptyState>{errorMsg}</EmptyState>}
      {status === "ready" && tickets.length === 0 && <EmptyState>Nenhum ticket por aqui.</EmptyState>}

      {status === "ready" && tickets.length > 0 && (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-4">
          {tickets.map((t) => {
            const action = NEXT_ACTION[t.status];
            return (
              <div key={t.id} className="flex flex-col gap-2.5 rounded-2xl border border-line bg-paper p-4">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs text-ink-soft">#{t.orderId.slice(0, 8)}</span>
                  <StatusBadge status={t.status} />
                </div>
                <div className="text-sm text-ink-soft">Prioridade: {t.priority}</div>
                {action ? (
                  <button
                    onClick={() => handleAdvance(t.id, action)}
                    className="mt-1 self-start rounded-full bg-coffee px-3.5 py-1.5 text-sm font-semibold text-paper"
                  >
                    {ACTION_LABEL[action]}
                  </button>
                ) : (
                  <span className="text-sm text-ink-soft">Ciclo concluído</span>
                )}
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
