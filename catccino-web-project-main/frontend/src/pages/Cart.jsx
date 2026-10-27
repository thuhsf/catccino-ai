import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { useToast } from "../context/ToastContext.jsx";
import { orderApi, paymentApi } from "../api/services.js";
import { EmptyState, money } from "../components/UI.jsx";
import StatusBadge from "../components/StatusBadge.jsx";

const METHODS = [
  { value: "pix", label: "Pix" },
  { value: "credit_card", label: "Cartão de crédito" },
  { value: "debit_card", label: "Cartão de débito" },
];

export default function Cart() {
  const { items, changeQty, clear, total, count } = useCart();
  const { isAuthenticated, customer } = useAuth();
  const showToast = useToast();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null); // pedido criado, aguardando pagamento
  const [method, setMethod] = useState("pix");
  const [paying, setPaying] = useState(false);
  const [payResult, setPayResult] = useState(null); // { status, error }

  async function handleCheckout() {
    if (!isAuthenticated) {
      showToast("Entre na sua conta para fechar o pedido.", true);
      navigate("/login");
      return;
    }
    try {
      const created = await orderApi.create({
        customerId: customer.id,
        items: items.map((i) => ({ productId: i.id, quantity: i.qty })),
      });
      setOrder(created);
      setPayResult(null);
      showToast("Pedido criado! Agora é só pagar.");
    } catch (err) {
      showToast(err.message, true);
    }
  }

  async function handlePay() {
    if (!order) return;
    setPaying(true);
    setPayResult(null);
    try {
      const created = await paymentApi.create({
        orderId: order.id,
        method,
        amount: order.total,
      });
      const processed = await paymentApi.process(created.id, {
        approved: true,
        transactionId: "SIM-" + Date.now(),
      });
      setPayResult({ status: processed.status });
      showToast("Pagamento aprovado 🎉");
      clear();
      setOrder(null);
    } catch (err) {
      setPayResult({ error: err.message });
      showToast(err.message, true);
    } finally {
      setPaying(false);
    }
  }

  if (!items.length && !order) {
    return (
      <section>
        <Header />
        <EmptyState>
          Seu carrinho está vazio. Volte ao cardápio e adicione algo gostoso 🐾
        </EmptyState>
      </section>
    );
  }

  return (
    <section>
      <Header />

      {items.length > 0 && (
        <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[1.4fr_1fr]">
          <div className="flex flex-col gap-2.5">
            {items.map((i) => (
              <div
                key={i.id}
                className="flex items-center gap-3 rounded-xl border border-line bg-paper px-3.5 py-3"
              >
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-semibold">{i.name}</div>
                  <div className="text-xs text-ink-soft">{money(i.price)} / un</div>
                </div>
                <div className="flex items-center gap-2">
                  <StepperButton onClick={() => changeQty(i.id, -1)}>−</StepperButton>
                  <span className="font-mono">{i.qty}</span>
                  <StepperButton onClick={() => changeQty(i.id, 1)}>+</StepperButton>
                </div>
                <div className="font-mono font-semibold text-coffee-dark">{money(i.price * i.qty)}</div>
              </div>
            ))}
          </div>

          <div className="sticky top-24 flex flex-col gap-3 rounded-2xl bg-coffee-dark p-5 text-cream">
            <div className="flex justify-between text-sm opacity-85">
              <span>Itens</span>
              <span>{count}</span>
            </div>
            <div className="flex justify-between border-t border-white/20 pt-2.5 font-display text-xl font-semibold">
              <span>Total</span>
              <span className="font-mono">{money(total)}</span>
            </div>
            <button
              onClick={handleCheckout}
              className="mt-1 w-full rounded-full bg-caramel px-4 py-2.5 text-sm font-bold text-paper transition-transform hover:-translate-y-0.5 hover:shadow-warm"
            >
              Fechar pedido
            </button>
            <button
              onClick={() => {
                clear();
                setOrder(null);
              }}
              style={{ borderWidth: "1.5px" }}
              className="w-full rounded-full border border-cream px-4 py-2 text-sm font-semibold text-cream hover:bg-white/10"
            >
              Esvaziar carrinho
            </button>
          </div>
        </div>
      )}

      {order && (
        <div className="mt-6 rounded-2xl border border-line bg-paper p-6">
          <h3 className="text-lg">
            Pagamento — pedido <span className="font-mono">{order.id}</span>
          </h3>
          <p className="mt-1 text-sm text-ink-soft">
            Total a pagar: <b className="font-mono text-ink">{money(order.total)}</b>
          </p>

          <div className="my-3.5 flex flex-wrap gap-2.5">
            {METHODS.map((m) => (
              <label
                key={m.value}
                style={{ borderWidth: "1.5px" }}
                className={`cursor-pointer rounded-lg border px-4 py-2.5 text-sm font-semibold ${
                  method === m.value ? "border-coffee bg-cream-2 text-coffee" : "border-line text-ink-soft"
                }`}
              >
                <input
                  type="radio"
                  name="method"
                  value={m.value}
                  checked={method === m.value}
                  onChange={() => setMethod(m.value)}
                  className="mr-1.5"
                />
                {m.label}
              </label>
            ))}
          </div>

          <button
            onClick={handlePay}
            disabled={paying}
            className="w-full rounded-full bg-coffee px-4 py-2.5 text-sm font-bold text-paper disabled:opacity-50 sm:w-auto sm:px-8"
          >
            {paying ? "Processando…" : "Simular pagamento"}
          </button>

          {payResult && (
            <div className="mt-3.5 text-sm">
              {payResult.error ? (
                <span className="text-rust">{payResult.error}</span>
              ) : (
                <div className="flex items-center gap-2">
                  <StatusBadge status={payResult.status} />
                  Pagamento confirmado! Acompanhe o preparo em{" "}
                  <button onClick={() => navigate("/pedidos")} className="font-semibold text-coffee underline">
                    Meus pedidos
                  </button>
                  .
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </section>
  );
}

function Header() {
  return (
    <div className="mb-5">
      <h2 className="text-2xl">Seu carrinho</h2>
      <p className="mt-1 text-sm text-ink-soft">Confira os itens antes de fechar o pedido.</p>
    </div>
  );
}

function StepperButton({ onClick, children }) {
  return (
    <button
      onClick={onClick}
      style={{ borderWidth: "1.5px" }}
      className="flex h-[26px] w-[26px] items-center justify-center rounded-full border border-line bg-paper font-bold text-coffee hover:border-coffee"
    >
      {children}
    </button>
  );
}
