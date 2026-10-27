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
      <div className="relative mb-8 flex flex-col-reverse items-start justify-between gap-7 overflow-hidden rounded-[20px] bg-coffee-dark p-8 text-cream sm:flex-row sm:items-center">
        <div>
          <h1 className="font-display text-3xl font-bold leading-tight text-cream max-w-md">
            Café quentinho, atendimento com jeitinho de gato.
          </h1>
          <p className="mt-2 max-w-md text-sm text-cream-2">
            Monte seu pedido no cardápio digital do Catccino e acompanhe cada etapa — do preparo à
            entrega — em tempo real.
          </p>
        </div>
        <svg viewBox="0 0 100 100" fill="#F6EFE4" className="absolute -bottom-2 -right-2 w-40 opacity-10">
          <ellipse cx="50" cy="62" rx="22" ry="18" />
          <ellipse cx="24" cy="34" rx="9" ry="11" />
          <ellipse cx="46" cy="20" rx="9" ry="11" />
          <ellipse cx="70" cy="20" rx="9" ry="11" />
          <ellipse cx="75" cy="34" rx="9" ry="11" />
        </svg>
      </div>

      <div className="mb-4 flex items-baseline justify-between gap-4">
        <div>
          <h2 className="text-2xl">Cardápio</h2>
          <p className="mt-1 text-sm text-ink-soft">Tudo fresquinho, direto da cozinha.</p>
        </div>
      </div>

      {status === "loading" && <EmptyState>Carregando cardápio…</EmptyState>}
      {status === "error" && (
        <EmptyState>
          Não foi possível carregar o cardápio.
          <br />
          <small>{errorMsg}</small>
        </EmptyState>
      )}

      {status === "ready" && (
        <>
          <div className="mb-6 flex flex-wrap gap-2">
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
