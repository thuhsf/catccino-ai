import { NavLink, useNavigate, Link } from "react-router-dom";
import { useRef, useState } from "react"; // Adicionado useState
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
  const { totalItens } = useCart(); 
  const showToast = useToast();
  const navigate = useNavigate();

  // Estado para controlar a janelinha de "Tem certeza?"
  const [mostrarModalSair, setMostrarModalSair] = useState(false);

  const secretClicks = useRef(0);
  const secretTimer = useRef(null);

  // Função que o botão "Sim" do modal chama
  function confirmarSaida() {
    setMostrarModalSair(false); // Fecha o modal
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
    <>
      <div className="sticky top-0 z-40 border-b border-line bg-cream/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center gap-4 px-5 py-2">
          <button type="button" onClick={handleLogoClick} className="mr-auto flex items-center gap-2">
            <img
              src="/logo-cat-back.png"
              alt="Logo Catccino"
              className="h-24 w-24 -my-7 object-contain"
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
                  `whitespace-nowrap rounded-full px-3.5 py-1.5 text-sm font-semibold transition-colors ${isActive
                    ? "bg-coffee text-paper"
                    : "text-ink-soft hover:bg-cream-2 hover:text-ink"
                  }`
                }
              >
                {tab.label}
                {tab.to === "/pedidos" && totalItens > 0 && (
                  <span className="ml-1.5 rounded-full bg-caramel px-1.5 py-0.5 text-[0.7rem] font-bold text-white">
                    {totalItens}
                  </span>
                )}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-2.5">
            {isAuthenticated ? (
              <>
                {/* NOME DO USUÁRIO AGORA É UM LINK PARA O PERFIL */}
                <Link to="/perfil" className="text-sm text-ink-soft hover:text-coffee transition-colors hover:underline">
                  Olá, <b className="text-ink">{customer?.name?.split(" ")[0]}</b>
                </Link>
                
                {/* BOTÃO SAIR AGORA ABRE O MODAL */}
                <button
                  onClick={() => setMostrarModalSair(true)}
                  className="rounded-full px-3.5 py-1.5 text-sm font-semibold text-coffee hover:bg-cream-2 cursor-pointer"
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

      {/* MODAL DE CONFIRMAÇÃO DE SAÍDA */}
      {mostrarModalSair && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
          <div className="bg-white rounded-2xl p-6 shadow-2xl max-w-sm w-full text-center animate-bounce-in">
            <h3 className="font-display text-xl font-bold text-ink mb-2">Tem certeza que deseja sair?</h3>
            <p className="text-sm text-ink-soft mb-6">Você precisará fazer login novamente para acessar sua conta.</p>
            
            <div className="flex gap-3 justify-center">
              <button 
                onClick={() => setMostrarModalSair(false)}
                className="px-5 py-2.5 rounded-lg border border-line font-semibold text-ink-soft hover:bg-cream-2 transition-colors cursor-pointer w-full"
              >
                Cancelar
              </button>
              <button 
                onClick={confirmarSaida}
                className="px-5 py-2.5 rounded-lg bg-red-600 font-semibold text-white hover:bg-red-700 transition-colors cursor-pointer w-full"
              >
                Sim, sair
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}