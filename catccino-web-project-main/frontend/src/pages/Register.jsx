import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { useToast } from "../context/ToastContext.jsx";

export default function Register() {
  const { register } = useAuth();
  const showToast = useToast();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function update(e) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await register(form);
      showToast("Conta criada com sucesso!");
      navigate("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4 py-8">
      <div className="flex w-full max-w-5xl flex-col overflow-hidden rounded-2xl bg-white shadow-xl md:flex-row-reverse">
        
        {/* LADO ESQUERDO (ou Direito, invertido): Imagem */}
        <div className="relative hidden w-1/2 md:block">
          <img
            src="https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?q=80&w=1000&auto=format&fit=crop" // Foto de um gato fofo
            alt="Gato fofo"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="absolute bottom-10 left-10 right-10 text-white">
            <h2 className="font-display text-3xl font-bold mb-2">Adote um amigo.</h2>
            <p className="text-sm opacity-90">
              Crie sua conta para acompanhar pedidos e apoiar nossas ONGs parceiras.
            </p>
          </div>
        </div>

        {/* LADO DIREITO: Formulário */}
        <div className="flex w-full flex-col justify-center p-8 md:w-1/2 md:p-12 lg:p-14">
          <div className="mb-6">
            <h1 className="font-display text-2xl font-bold text-ink mb-1">Criar sua conta</h1>
            <p className="text-sm text-ink-soft">Leva menos de um minuto.</p>
          </div>

          {error && (
            <div className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-ink">Nome</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={update}
                required
                className="w-full rounded-lg border border-line bg-cream/50 px-4 py-3 text-sm focus:border-coffee focus:outline-none focus:ring-1 focus:ring-coffee"
                placeholder="Seu nome completo"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-semibold text-ink">E-mail</label>
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
              <label className="mb-1.5 block text-sm font-semibold text-ink">Telefone</label>
              <input
                type="text"
                name="phone"
                value={form.phone}
                onChange={update}
                required
                className="w-full rounded-lg border border-line bg-cream/50 px-4 py-3 text-sm focus:border-coffee focus:outline-none focus:ring-1 focus:ring-coffee"
                placeholder="(00) 00000-0000"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-semibold text-ink">Senha</label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={update}
                minLength={6}
                required
                className="w-full rounded-lg border border-line bg-cream/50 px-4 py-3 text-sm focus:border-coffee focus:outline-none focus:ring-1 focus:ring-coffee"
                placeholder="Mínimo 6 caracteres"
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