import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { useToast } from "../context/ToastContext.jsx";
import { AUTH_STORAGE_KEY } from "../api/client.js";

export default function Register() {
  const { register } = useAuth();
  const showToast = useToast();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Função normal para Nome, E-mail e Senha
  function update(e) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  }

  // Função com máscara apenas para o Telefone
  function formatarTelefone(e) {
    let valor = e.target.value.replace(/\D/g, ""); // Remove tudo que não for número
    valor = valor.slice(0, 11); // Limita a 11 números

    // Aplica a máscara (00) 00000-0000
    if (valor.length > 10) {
      valor = valor.replace(/^(\d{2})(\d{5})(\d{4}).*/, "($1) $2-$3");
    } else if (valor.length > 6) {
      valor = valor.replace(/^(\d{2})(\d{4})(\d{0,4}).*/, "($1) $2-$3");
    } else if (valor.length > 2) {
      valor = valor.replace(/^(\d{2})(\d{0,5})/, "($1) $2");
    } else if (valor.length > 0) {
      valor = valor.replace(/^(\d*)/, "($1");
    }
    
    setForm((f) => ({ ...f, phone: valor }));
  }
    async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    
    setTimeout(() => {
      // 1. Pega a conta que já está salva (se existir)
      const contaSalva = localStorage.getItem("catccino_user");
      
      if (contaSalva) {
        const user = JSON.parse(contaSalva);
        
        // 2. Compara o e-mail digitado com o e-mail já cadastrado
        // O toLowerCase() serve para ignorar se a pessoa digitou com letra maiúscula ou minúscula
        if (user.email.toLowerCase() === form.email.toLowerCase()) {
          setError("Este e-mail já está cadastrado. Por favor, faça login ou tente outro e-mail.");
          setLoading(false);
          return; // Para a execução aqui e não salva nada
        }
      }

      // 3. Se o e-mail não existe (ou é a primeira vez), salva a conta
      localStorage.setItem("catccino_user", JSON.stringify(form));

      // 4. Cria a sessão simulada
      const sessaoSimulada = {
        token: "token-simulado-da-apresentacao",
        customer: form
      };
      localStorage.setItem("catccino:auth", JSON.stringify(sessaoSimulada));
      
      showToast("Conta criada com sucesso! Faça login para continuar.");
      navigate("/login");
      setLoading(false);
    }, 1000);
  }

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4 py-8">
      <div className="flex w-full max-w-5xl flex-col overflow-hidden rounded-2xl bg-white shadow-xl md:flex-row-reverse">
        
        {/* LADO ESQUERDO (ou Direito, invertido): Imagem */}
        <div className="relative hidden w-1/2 md:block">
          <img
            src="/adocao-login.jpg"
            alt="Gato fofo"
            className="h-full w-full object-cover"
            style={{objectPosition: "center 30%"}}
          />
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="absolute bottom-10 left-10 right-10 text-white">
            <h2 
            className="font-display text-3xl font-bold mb-2" style={{ color: "#e6ccb2" }} >
              Adote um amigo.
            </h2>
            <p className="text-sm opacity-90">
              Crie sua conta para acompanhar pedidos e apoiar nossas ONG's parceiras.
            </p>
          </div>
        </div>

        {/* LADO DIREITO: Formulário */}
        <div className="flex w-full flex-col justify-center p-8 md:w-1/2 md:p-12 lg:p-14">
          <div className="mb-6">
            <h1 className="font-display text-2xl font-bold text-ink mb-1">Crie a sua conta</h1>
            <p className="text-sm text-ink-soft">Leva menos de um minuto.</p>
          </div>

          {error && (
            <div className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-ink">Nome <span className="text-red-500">*</span></label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={update} // <-- Corrigido para update
                required
                className="w-full rounded-lg border border-line bg-cream/50 px-4 py-3 text-sm focus:border-coffee focus:outline-none focus:ring-1 focus:ring-coffee"
                placeholder="Seu nome completo"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-semibold text-ink">E-mail <span className="text-red-500">*</span></label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={update}
                required
                className="w-full rounded-lg border border-line bg-cream/50 px-4 py-3 text-sm focus:border-coffee focus:outline-none focus:ring-1 focus:ring-coffee"
                placeholder="seu@email.com"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-semibold text-ink">Telefone <span className="text-red-500">*</span></label>
              <input
                type="text"
                name="phone"
                value={form.phone}
                onChange={formatarTelefone} // <-- Corrigido para formatarTelefone
                required
                className="w-full rounded-lg border border-line bg-cream/50 px-4 py-3 text-sm focus:border-coffee focus:outline-none focus:ring-1 focus:ring-coffee"
                placeholder="(00) 00000-0000"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-semibold text-ink">Senha <span className="text-red-500">*</span></label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={update}
                minLength={6} // Exige no mínimo 6
                maxLength={8} // Limita a exatamente 8
                required
                className="w-full rounded-lg border border-line bg-cream/50 px-4 py-3 text-sm focus:border-coffee focus:outline-none focus:ring-1 focus:ring-coffee"
                placeholder="6-8 caracteres"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 w-full rounded-lg bg-coffee py-3 text-sm font-bold text-white transition-transform hover:-translate-y-0.5 hover:shadow-warm disabled:opacity-70"
            >
              {loading ? "Criando..." : "Criar conta"}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-ink-soft">
            Já tem conta?{" "}
            <Link to="/login" className="font-bold text-coffee hover:underline">
              Entrar
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}