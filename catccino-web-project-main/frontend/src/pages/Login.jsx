import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { useToast } from "../context/ToastContext.jsx";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  
  // CORREÇÃO AQUI: O useState do olhinho foi movido para dentro do componente
  const [mostrarSenha, setMostrarSenha] = useState(false);
  
  const navigate = useNavigate();
  const { login } = useAuth();
  const showToast = useToast();

    async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    
    setTimeout(() => {
      // 1. Pega os dados da conta que foram salvos no cadastro
      const contaSalva = localStorage.getItem("catccino_user");
      
      if (!contaSalva) {
        // Se não existe NENHUMA conta salva no navegador
        showToast("Nenhuma conta encontrada. Por favor, cadastre-se primeiro.");
        setLoading(false);
        return;
      }

      const user = JSON.parse(contaSalva);
      
      // 2. Primeiro, verifica se o e-mail bate com o que está cadastrado
      if (user.email.toLowerCase() !== email.toLowerCase()) {
        showToast("Não há conta cadastrada com esse e-mail.");
        setLoading(false);
        return;
      }

      // 3. Se o e-mail bate, agora verifica se a senha está correta
      if (user.password !== password) {
        showToast("Senha incorreta. Tente novamente.");
        setLoading(false);
        return;
      }
      
      // 4. Se passou por tudo, faz o login
      const sessaoSimulada = {
        token: "token-simulado-123",
        customer: user
      };
      localStorage.setItem("catccino:auth", JSON.stringify(sessaoSimulada));

      showToast(`Bem-vindo de volta, ${user.name.split(' ')[0]}!`);
      navigate("/menu");
      
      // Força a Navbar a atualizar
      setTimeout(() => window.location.reload(), 500); 
      
      setLoading(false);
    }, 1000);
  }

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4 py-8">
      <div className="flex w-full max-w-5xl flex-col overflow-hidden rounded-2xl bg-white shadow-xl md:flex-row">
        
        {/* LADO ESQUERDO: Imagem */}
        <div className="relative hidden w-1/2 md:block">
          <img
            src="/gato-login.png" 
            alt="Gato no Catccino"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-black/30"></div>
          
          <div className="absolute bottom-10 left-10 right-10 text-white">
            <h2 
              className="font-display text-3xl font-bold mb-2 bg-transparent" 
              style={{ color: "#e6ccb2", backgroundColor: "transparent", display: "inline-block" }}
            > 
              Um café, um ronronar.
            </h2>
            <p className="text-sm opacity-90 text-white">
              Entre para acompanhar seus pedidos e descobrir os gatinhos que esperam por um lar.
            </p>
          </div>
        </div>

        {/* LADO DIREITO: Formulário */}
        <div className="flex w-full flex-col justify-center p-8 md:w-1/2 md:p-12 lg:p-16">
          <div className="mb-8 text-center md:text-left">
            <h1 className="font-display text-2xl font-bold text-ink mb-2">Bem-vindo de volta</h1>
            <p className="text-sm text-ink-soft">Insira suas credenciais para acessar sua conta.</p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-ink">E-mail <span className="text-red-500">*</span></label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full rounded-lg border border-line bg-cream/50 px-4 py-3 text-sm focus:border-coffee focus:outline-none focus:ring-1 focus:ring-coffee"
                placeholder="seu@email.com"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-semibold text-ink">Senha <span className="text-red-500">*</span></label>
              <div className="relative">
                <input
                  type={mostrarSenha ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  maxLength={8}
                  className="w-full rounded-lg border border-line bg-cream/50 px-4 py-3 text-sm focus:border-coffee focus:outline-none focus:ring-1 focus:ring-coffee pr-10"
                  placeholder="Sua senha"
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-sm mt-1">
              <label className="flex items-center gap-2 text-ink-soft cursor-pointer">
                <input type="checkbox" className="rounded border-line text-coffee focus:ring-coffee" />
                Lembrar de mim
              </label>
              <Link to="/recuperar-senha" className="font-semibold text-coffee hover:underline">Esqueci minha senha</Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-4 w-full rounded-lg bg-coffee py-3 text-sm font-bold text-white transition-transform hover:-translate-y-0.5 hover:shadow-warm disabled:opacity-70 cursor-pointer"
            >
             {loading ? "Entrando..." : "Entrar"}
            </button>
          </form>

          <div className="mt-8 text-center text-sm text-ink-soft">
            Ainda não tem conta?{" "}
            <Link to="/cadastro" className="font-bold text-coffee hover:underline">
              Criar conta nova
            </Link>
          </div>
        </div>
        
      </div>
    </div>
  );
}