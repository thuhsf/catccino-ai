import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { orderApi } from "../api/services.js";
import { EmptyState, money } from "../components/UI.jsx";
import StatusBadge from "../components/StatusBadge.jsx";

export default function Orders() {
  const { isAuthenticated, customer } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [status, setStatus] = useState("idle"); // idle | loading | ready | error
  const [errorMsg, setErrorMsg] = useState("");

  const load = useCallback(() => {
    if (!isAuthenticated) return;
    setStatus("loading");
    orderApi
      .listByCustomer(customer.id)
      .then((res) => {
        setOrders(res.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
        setStatus("ready");
      })
      .catch((err) => {
        setErrorMsg(err.message);
        setStatus("error");
      });
  }, [isAuthenticated, customer]);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <section>
      <div className="mb-5 flex flex-wrap items-baseline justify-between gap-3">
        <div>
          <h2 className="text-2xl">Meus pedidos</h2>
          <p className="mt-1 text-sm text-ink-soft">
            Acompanhe o status de cada pedido, do pagamento à entrega.
          </p>
        </div>
        {isAuthenticated && (
          <button onClick={load} className="rounded-full px-3 py-1.5 text-sm font-semibold text-coffee hover:bg-cream-2">
            ↻ Atualizar
          </button>
        )}
      </div>

      {!isAuthenticated && (
        <EmptyState>
          Entre na sua conta para ver seus pedidos.{" "}
          <Link to="/login" className="font-semibold text-coffee underline">
            Fazer login
          </Link>
        </EmptyState>
      )}

      {isAuthenticated && status === "loading" && <EmptyState>Carregando pedidos…</EmptyState>}
      {isAuthenticated && status === "error" && <EmptyState>{errorMsg}</EmptyState>}
      {isAuthenticated && status === "ready" && orders.length === 0 && (
        <EmptyState>Você ainda não fez nenhum pedido.</EmptyState>
      )}

      {isAuthenticated && orders.length > 0 && (
        <div className="flex flex-col gap-3">
          {orders.map((o) => (
            <button
              key={o.id}
              onClick={() => navigate(`/pedidos/${o.id}`)}
              className="flex items-center gap-3.5 rounded-xl border border-line bg-paper px-4 py-3.5 text-left transition-shadow hover:border-coffee hover:shadow-warm"
            >
              <div className="flex-1">
                <div className="font-mono text-xs text-ink-soft">#{o.id.slice(0, 8)}</div>
                <div className="text-sm text-ink-soft">
                  {new Date(o.createdAt).toLocaleString("pt-BR")}
                </div>
              </div>
              <StatusBadge status={o.status} />
              <span className="font-mono font-semibold text-coffee-dark">{money(o.total)}</span>
            </button>
          ))}
        </div>
      )}
    </section>
  );
}
