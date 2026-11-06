import { useEffect, useMemo, useState } from "react";
import { menuApi } from "../api/services.js";
import { useCart } from "../context/CartContext.jsx";
import { useToast } from "../context/ToastContext.jsx";
import { Chip, EmptyState, money } from "../components/UI.jsx";

export default function Menu() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);
  const [status, setStatus] = useState("loading"); // loading | ready | error
  const [errorMsg, setErrorMsg] = useState("");

  const { addItem } = useCart();
  const showToast = useToast();

  useEffect(() => {
    let cancelled = false;
    Promise.all([menuApi.listCategories(), menuApi.listProducts()])
      .then(([cats, prods]) => {
        if (cancelled) return;
        setCategories(cats);
        setProducts(prods);
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
  }, []);

  const filtered = useMemo(
    () => products.filter((p) => !activeCategory || p.categoryId === activeCategory),
    [products, activeCategory],
  );

  function handleAdd(product) {
    addItem(product);
    showToast(`${product.name} adicionado ao carrinho.`);
  }

  return (
    <section>
      {/* O Banner Marrom foi removido daqui da Home */}

      <div className="mb-6 text-center md:text-left">
        <h1 className="text-3xl font-display font-bold text-ink">Bem-vindo ao Catccino!</h1>
        <p className="mt-2 text-ink-soft">Escolha seus produtos favoritos no nosso cardápio.</p>
      </div>

      {status === "loading" && <EmptyState>Carregando cardápio…</EmptyState>}
      
      {status === "error" && (
        <EmptyState>
          Ops! Parece que o nosso sistema de pedidos está offline no momento.
          <br />
          <small className="text-xs text-ink-soft">(Mas não se preocupe, você pode conversar com a nossa IA no canto da tela!)</small>
        </EmptyState>
      )}

      {status === "ready" && (
        <>
          <div className="mb-6 flex flex-wrap justify-center md:justify-start gap-2">
            <Chip active={activeCategory === null} onClick={() => setActiveCategory(null)}>
              Todos
            </Chip>
            {categories.map((c) => (
              <Chip key={c.id} active={activeCategory === c.id} onClick={() => setActiveCategory(c.id)}>
                {c.name}
              </Chip>
            ))}
          </div>

          {filtered.length === 0 ? (
            <EmptyState>Nenhum produto nessa categoria ainda.</EmptyState>
          ) : (
            <div className="grid grid-cols-[repeat(auto-fill,minmax(230px,1fr))] gap-4">
              {filtered.map((p) => (
                <div
                  key={p.id}
                  className="flex flex-col gap-2.5 rounded-2xl border border-line bg-paper p-4 transition-transform hover:-translate-y-1 hover:shadow-warm"
                >
                  <div className="flex h-28 items-center justify-center rounded-xl bg-gradient-to-br from-cream-2 to-paw text-3xl">
                    ☕
                  </div>
                  <h3 className="text-base font-semibold text-coffee-dark">{p.name}</h3>
                  <p className="flex-1 text-sm leading-snug text-ink-soft">{p.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-semibold text-coffee-dark">{money(p.price)}</span>
                    {p.available === false ? (
                      <span className="text-xs font-semibold text-rust">Indisponível</span>
                    ) : (
                      <button
                        onClick={() => handleAdd(p)}
                        className="rounded-full bg-coffee px-3.5 py-1.5 text-sm font-semibold text-paper transition-transform hover:-translate-y-0.5 hover:shadow-warm"
                      >
                        Adicionar
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </section>
  );
}