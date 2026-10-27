import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { orderApi, notificationApi, kitchenApi } from "../api/services.js";
import { EmptyState, money } from "../components/UI.jsx";
import StatusBadge from "../components/StatusBadge.jsx";
import PawIcon from "../components/PawIcon.jsx";

export default function OrderDetail() {
  const { orderId } = useParams();
  const [data, setData] = useState(null); // { order, notifications, ticket }
  const [status, setStatus] = useState("loading");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    let cancelled = false;
    setStatus("loading");

    Promise.all([
      orderApi.get(orderId),
      notificationApi.listByOrder(orderId),
      kitchenApi.list().catch(() => []),
    ])
      .then(([order, notifications, tickets]) => {
        if (cancelled) return;
        const ticket = tickets.find((t) => t.orderId === orderId) || null;
        setData({ order, notifications, ticket });
        setStatus("ready");
      })
      .catch((err) => {
        if (cancelled) return;
        setErrorMsg(err.message);
        setStatus("error");
      });

    return () => {
      cancelled = true;
    };
  }, [orderId]);

  if (status === "loading") return <EmptyState>Carregando detalhes do pedido…</EmptyState>;
  if (status === "error") return <EmptyState>{errorMsg}</EmptyState>;

  const { order, notifications, ticket } = data;

  const steps = [
    { label: "Pedido criado", done: true, when: order.createdAt },
    {
      label: "Pagamento",
      done: order.status !== "pending",
      when: order.status !== "pending" ? order.updatedAt : null,
    },
    {
      label: "Em preparo",
      done: Boolean(ticket) && ["preparing", "ready", "delivered"].includes(ticket.status),
      when: ticket?.startedAt ?? null,
    },
    {
      label: "Pronto",
      done: Boolean(ticket) && ["ready", "delivered"].includes(ticket.status),
      when: ticket?.finishedAt ?? null,
    },
    { label: "Entregue", done: ticket?.status === "delivered", when: null },
  ];

  return (
    <section>
      <Link to="/pedidos" className="mb-4 inline-block text-sm font-semibold text-coffee">
        ← Voltar para meus pedidos
      </Link>

      <div className="rounded-2xl border border-line bg-paper p-6">
        <div className="mb-1 flex items-center justify-between gap-3">
          <h3 className="font-display text-xl">
            Pedido <span className="font-mono">#{order.id.slice(0, 8)}</span>
          </h3>
          <StatusBadge status={order.status} />
        </div>
        <p className="text-sm text-ink-soft">
          Total: <b className="font-mono text-ink">{money(order.total)}</b>
        </p>

        <ul className="mt-4 flex flex-col gap-3.5">
          {steps.map((s) => (
            <li key={s.label} className={`flex items-start gap-3 text-sm ${s.done ? "" : "opacity-40"}`}>
              <PawIcon filled={s.done} className="mt-0.5 h-[22px] w-[22px] flex-none" />
              <div>
                <b className="block">{s.label}</b>
                <span className="text-xs text-ink-soft">
                  {s.when ? new Date(s.when).toLocaleString("pt-BR") : s.done ? "concluído" : "aguardando"}
                </span>
              </div>
            </li>
          ))}
        </ul>

        {notifications.length > 0 && (
          <>
            <h4 className="mt-6 text-base font-semibold">Notificações</h4>
            <ul className="mt-2.5 flex flex-col gap-3">
              {notifications.map((n) => (
                <li key={n.id} className="flex items-start gap-3 text-sm">
                  <span className="mt-1.5 h-2.5 w-2.5 flex-none rounded-full bg-sage" />
                  <div>
                    <b className="block">{n.type}</b>
                    <span className="text-xs text-ink-soft">
                      {n.channel} · {n.status}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </section>
  );
}
