import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { useToast } from "../context/ToastContext.jsx";
import { Field } from "./Login.jsx";

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
    <section className="mx-auto max-w-sm">
      <div className="rounded-2xl border border-line bg-paper p-8 shadow-warm">
        <h2 className="font-display text-2xl">Criar sua conta</h2>
        <p className="mb-5 mt-1 text-sm text-ink-soft">Leva menos de um minuto.</p>

        {error && (
          <div className="mb-3 rounded-lg bg-rust-bg px-3 py-2.5 text-sm text-rust">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <Field label="Nome" name="name" type="text" value={form.name} onChange={update} required />
          <Field label="E-mail" name="email" type="email" value={form.email} onChange={update} required />
          <Field
            label="Telefone"
            name="phone"
            type="text"
            placeholder="(00) 00000-0000"
            value={form.phone}
            onChange={update}
            required
          />
          <Field
            label="Senha"
            name="password"
            type="password"
            minLength={6}
            value={form.password}
            onChange={update}
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="mt-1 w-full rounded-full bg-coffee px-4 py-2.5 text-sm font-bold text-paper disabled:opacity-50"
          >
            {loading ? "Criando…" : "Criar conta"}
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-ink-soft">
          Já tem conta?{" "}
          <Link to="/login" className="font-semibold text-coffee">
            Entrar
          </Link>
        </p>
      </div>
    </section>
  );
}
