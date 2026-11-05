import { NavLink, useNavigate } from "react-router-dom";
import { useRef } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { useCart } from "../context/CartContext.jsx";
import { useToast } from "../context/ToastContext.jsx";
import { SECRET_ADMIN_PATH } from "../constants.js";

const TABS = [
  { to: "/menu", label: "Home" },
  { to: "/cardapio", label: "Cardápio" },
  { to: "/adocao", label: "Adoção" },
  { to: "/pedidos", label: "Meus pedidos" },
];

export default function Navbar() {
  const { isAuthenticated, customer, logout } = useAuth();
  const { count } = useCart();
  const showToast = useToast();
  const navigate = useNavigate();

  const secretClicks = useRef(0);
  const secretTimer = useRef(null);

  function handleLogout() {
    logout();
    showToast("Você saiu da sua conta.");
    navigate("/");
  }

  function handleLogoClick() {
    secretClicks.current += 1;
    clearTimeout(secretTimer.current);
    secretTimer.current = setTimeout(() => {
      secretClicks.current = 0;
    }, 1500);

    if (secretClicks.current >= 5) {
      secretClicks.current = 0;
      navigate(SECRET_ADMIN_PATH);
      return;
    }

    navigate("/");
  }

  return (
    <div className="sticky top-0 z-40 border-b border-line bg-cream/90 backdrop-blur-md">
      {/* Mudei o py-3 para py-2 para diminuir a altura da barra */}
      <div className="mx-auto flex max-w-5xl flex-wrap items-center gap-4 px-5 py-2">
        <button type="button" onClick={handleLogoClick} className="mr-auto flex items-center gap-2">
          <img 
            src="/logo-cat-back.png" 
            alt="Logo Catccino" 
            style={{ width: "44px", height: "44px", objectFit: "contain" }} 
          />
          <span className="font-display text-lg font-bold">Catccino</span>
        </button>

        <nav className="flex flex-wrap gap-1 order-3 w-full overflow-x-auto sm:order-none sm:w-auto">
          {TABS.map((tab) => (
            <NavLink
              key={tab.to}
              to={tab.to}
              end={tab.end}
              className={({ isActive }) =>
                // Mudei o py-2 para py-1.5 para deixar os links mais discretos
                `whitespace-nowrap rounded-full px-3.5 py-1.5 text-sm font-semibold transition-colors ${isActive
                  ? "bg-coffee text-paper"
                  : "text-ink-soft hover:bg-cream-2 hover:text-ink"
                }`
              }
            >
              {tab.label}
              {tab.to === "/carrinho" && count > 0 && (
                <span className="ml-1.5 rounded-full bg-caramel px-1.5 py-0.5 text-[0.7rem] font-bold text-white">
                  {count}
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2.5">
          {isAuthenticated ? (
            <>
              <span className="text-sm text-ink-soft">
                Olá, <b className="text-ink">{customer?.name?.split(" ")[0]}</b>
              </span>
              <button
                onClick={handleLogout}
                className="rounded-full px-3.5 py-1.5 text-sm font-semibold text-coffee hover:bg-cream-2"
              >
                Sair
              </button>
            </>
          ) : (
            <NavLink
              to="/login"
              className="rounded-full border-1.5 border-coffee px-4 py-1.5 text-sm font-semibold text-coffee transition-transform hover:-translate-y-0.5 hover:shadow-warm"
              style={{ borderWidth: "1.5px" }}
            >
              Entrar
            </NavLink>
          )}
        </div>
      </div>
    </div>
  );
}