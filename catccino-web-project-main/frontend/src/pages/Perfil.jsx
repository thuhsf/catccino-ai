import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { useToast } from "../context/ToastContext.jsx";

export default function Perfil() {
  const { customer, login } = useAuth(); 
  const navigate = useNavigate();
  const showToast = useToast();

  // Inicializa o form com os dados do usuário logado
  const [form, setForm] = useState({
    name: customer?.name || "",
    email: customer?.email || "",
    phone: customer?.phone || "",
    password: customer?.password || ""
  });

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    
    // 1. Atualiza os dados da "conta" no navegador
    localStorage.setItem("catccino_user", JSON.stringify(form));
    
    // 2. Atualiza a sessão ativa para refletir o novo nome na Navbar
    const sessaoSalva = JSON.parse(localStorage.getItem("catccino:auth"));
    if (sessaoSalva) {
      sessaoSalva.customer = form;
      localStorage.setItem("catccino:auth", JSON.stringify(sessaoSalva));
    }

    showToast("Perfil atualizado com sucesso!");
    
    // Recarrega a página para a Navbar ler o novo nome
    setTimeout(() => window.location.reload(), 500);
  }

  if (!customer) {
    return (
      <div className="text-center py-20">
        <h1 className="font-display text-2xl font-bold mb-4">Você precisa estar logado para ver o perfil.</h1>
        <Link to="/login" className="bg-coffee text-white px-6 py-3 rounded-lg font-bold">Fazer login</Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-5 py-10">
      <div className="bg-white p-8 rounded-3xl shadow-lg border border-line">
        <h1 className="font-display text-3xl font-bold text-ink mb-2">Meu perfil</h1>
        <p className="text-ink-soft mb-6">Edite suas informações cadastradas.</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-semibold mb-1">Nome <span className="text-red-500">*</span></label>
            <input required name="name" value={form.name} onChange={handleChange} className="w-full border border-line rounded-lg p-3 bg-cream/50" />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">E-mail <span className="text-red-500">*</span></label>
            <input required type="email" name="email" value={form.email} onChange={handleChange} className="w-full border border-line rounded-lg p-3 bg-cream/50" />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Telefone <span className="text-red-500">*</span></label>
            <input required type="text" name="phone" value={form.phone} onChange={handleChange} className="w-full border border-line rounded-lg p-3 bg-cream/50" />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Senha <span className="text-red-500">*</span></label>
            <input required type="password" name="password" minLength={6} maxLength={6} value={form.password} onChange={handleChange} className="w-full border border-line rounded-lg p-3 bg-cream/50" />
          </div>

          <button type="submit" className="mt-4 w-full bg-coffee text-white py-3 rounded-lg font-bold hover:bg-coffee-dark transition-colors cursor-pointer">
            Salvar alterações
          </button>
        </form>
      </div>
    </div>
  );
}