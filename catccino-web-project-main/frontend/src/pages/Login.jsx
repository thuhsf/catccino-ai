import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { useToast } from "../context/ToastContext.jsx";

export default function Login() {
  const { login } = useAuth();
  const showToast = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const [form, setForm] = useState({ email: "", password: "" });
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
      await login(form.email, form.password);
      showToast("Login realizado. Bem-vindo(a) de volta!");
      navigate(location.state?.from || "/");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="mx-auto max-w-sm">
      <div className="rounded-2xl border border-line bg-paper p-8 shadow-warm">
        <h2 className="font-display text-2xl">Bem-vindo de volta</h2>
        <p className="mb-5 mt-1 text-sm text-ink-soft">Entre para acompanhar seus pedidos.</p>

        {error && (
          <div className="mb-3 rounded-lg bg-rust-bg px-3 py-2.5 text-sm text-rust">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <Field label="E-mail" name="email" type="email" value={form.email} onChange={update} required />
          <Field
            label="Senha"
            name="password"
            type="password"
            value={form.password}
            onChange={update}
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="mt-1 w-full rounded-full bg-coffee px-4 py-2.5 text-sm font-bold text-paper disabled:opacity-50"
          >
            {loading ? "Entrando…" : "Entrar"}
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-ink-soft">
          Ainda não tem conta?{" "}
          <Link to="/cadastro" className="font-semibold text-coffee">
            Criar conta
          </Link>
        </p>
      </div>
    </section>
  );
}

export function Field({ label, ...inputProps }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold text-ink-soft">{label}</span>
      <input
        {...inputProps}
        className="w-full rounded-lg border-1.5 border-line bg-cream px-3 py-2.5 text-sm text-ink focus:border-coffee focus:outline-none"
        style={{ borderWidth: "1.5px" }}
      />
    </label>
  );
}
