import { useState } from "react";
import { Link } from "react-router-dom";
import { useToast } from "../context/ToastContext.jsx";

export default function RecuperarSenha() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [enviado, setEnviado] = useState(false);
  const showToast = useToast();

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    
    // Simula o envio do e-mail
    setTimeout(() => {
      setLoading(false);
      setEnviado(true);
      showToast("E-mail de recuperação enviado!");
    }, 1500);
  }

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4 py-8">
      <div className="flex w-full max-w-5xl flex-col overflow-hidden rounded-2xl bg-white shadow-xl md:flex-row">
        
        <div className="relative hidden w-1/2 md:block">
          <img
            src="/recuperacao-senha.jpg"
            alt="Gato no Catccino"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-black/30"></div>
          <div className="absolute bottom-10 left-10 right-10 text-white">
            <h2 
              className="font-display text-3xl font-bold mb-2 bg-transparent" 
              style={{ color: "#e6ccb2", backgroundColor: "transparent", display: "inline-block" }}
            > Um café, um ronronar.
            </h2>
            <p className="text-sm opacity-90 text-white">
              Não se preocupe, nós cuidamos de tudo para você voltar a tomar seu café.
            </p>
          </div>
        </div>

        {/* Lado do Formulário */}
        <div className="flex w-full flex-col justify-center p-8 md:w-1/2 md:p-12 lg:p-16">
          <div className="mb-6">
            <h1 className="font-display text-2xl font-bold text-ink mb-1">Recuperar Senha</h1>
            <p className="text-sm text-ink-soft">
              Digite seu e-mail cadastrado e enviaremos um link para você criar uma nova senha.
            </p>
          </div>

          {!enviado ? (
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

              <button
                type="submit"
                disabled={loading}
                className="mt-2 w-full rounded-lg bg-coffee py-3 text-sm font-bold text-white transition-transform hover:-translate-y-0.5 hover:shadow-warm disabled:opacity-70"
              >
                {loading ? "Enviando..." : "Enviar link de recuperação"}
              </button>
            </form>
          ) : (
            <div className="rounded-lg bg-green-50 p-6 text-center border border-green-200">
              <p className="text-green-700 font-semibold mb-2">Link enviado com sucesso!</p>
              <p className="text-sm text-green-600">
                Verifique a caixa de entrada do e-mail <b>{email}</b> para continuar.
              </p>
            </div>
          )}

          <div className="mt-8 text-center text-sm text-ink-soft">
            Lembrou a senha?{" "}
            <Link to="/login" className="font-bold text-coffee hover:underline">
              Voltar para o Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}