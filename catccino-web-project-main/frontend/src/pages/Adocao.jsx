import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GATOS as GATOS_INICIAIS } from "../data/gatos.js";
import { useAuth } from "../context/AuthContext.jsx";

export default function Adocao() {
  const [gatos, setGatos] = useState([]);
  const [gatosSolicitados, setGatosSolicitados] = useState([]);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [mensagemErro, setMensagemErro] = useState("");

  useEffect(() => {
    // Carrega os gatos
    const salvos = localStorage.getItem("catccino_gatos");
    if (salvos) {
      setGatos(JSON.parse(salvos));
    } else {
      setGatos(GATOS_INICIAIS);
      localStorage.setItem("catccino_gatos", JSON.stringify(GATOS_INICIAIS));
    }

    // Carrega a lista de IDs de gatos que já tiveram adoção solicitada
    const solicitados = JSON.parse(localStorage.getItem("catccino_adocoes_solicitadas") || "[]");
    setGatosSolicitados(solicitados);
  }, []);

  function handleQueroAdotar(gatoId) {
    if (!isAuthenticated) {
      setMensagemErro("Para continuar com a sua adoção, entre na sua conta.");
      setTimeout(() => setMensagemErro(""), 4000);
      return;
    }

    // Verifica se o gato já foi solicitado
    if (gatosSolicitados.includes(gatoId)) {
      setMensagemErro("Você já solicitou a adoção deste gatinho. Aguarde o retorno da ONG.");
      setTimeout(() => setMensagemErro(""), 4000);
      return;
    }

    navigate(`/adocao/${gatoId}`);
  }

  return (
    <div className="mx-auto max-w-5xl px-5 py-10">
      <div className="mb-10 text-center">
        <h1 className="font-display text-3xl font-bold text-ink mb-2">Adote um 'miau'migo</h1>
        <p className="text-ink-soft max-w-2xl mx-auto">
          Nossos gatinhos vêm de ONG's parceiras e estão esperando por um lar cheio de amor. 
          Conheça o perfil de cada um e descubra quem combina com você!
        </p>
      </div>

      {/* ALERTA DE LOGIN */}
      {mensagemErro && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 rounded-lg bg-red-600 px-6 py-3 text-white shadow-lg font-semibold animate-bounce">
          {mensagemErro}
        </div>
      )}

      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3">
        {gatos.map((gato) => (
          <div key={gato.id} className="overflow-hidden rounded-2xl bg-white shadow-md border border-line flex flex-col">
            
            <div className="h-48 w-full bg-cream-2 overflow-hidden">
              {gato.img ? (
                <img 
                  src={gato.img} 
                  alt={`Foto do ${gato.nome}`} 
                  className="h-full w-full object-cover"
                  style={{ objectPosition: gato.posicao || "center" }}
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-4xl">🐈</div>
              )}
            </div>
            
            <div className="p-6 flex flex-col flex-1">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-display text-2xl font-bold text-ink">{gato.nome}</h3>
                <span className={`rounded-full px-3 py-1 text-xs font-bold ${gato.status === "Disponível" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                  {gato.status}
                </span>
              </div>
              
              <div className="flex gap-2 text-xs text-ink-soft mb-3 font-semibold">
                <span className="bg-cream px-2 py-1 rounded">{gato.idade}</span>
                <span className="bg-cream px-2 py-1 rounded">{gato.sexo}</span>
                <span className="bg-cream px-2 py-1 rounded">{gato.cor}</span>
              </div>

              <p className="text-sm text-ink-soft mb-6 flex-1">{gato.desc}</p>
              
              {/* Lógica do botão */}
              {gato.status === "Adotado(a)" ? (
                // Se estiver adotado, mostra botão bloqueado
                <button 
                  disabled 
                  className="block w-full rounded-lg bg-gray-300 py-2.5 text-center text-sm font-bold text-gray-500 cursor-not-allowed"
                >
                  Escolha outro gato
                </button>
              ) : gatosSolicitados.includes(gato.id) ? (
                // Se já solicitou, mostra aguardando
                <button 
                  disabled 
                  className="block w-full rounded-lg bg-gray-300 py-2.5 text-center text-sm font-bold text-gray-500 cursor-not-allowed"
                >
                  Aguardando retorno da ONG
                </button>
              ) : (
                // Se estiver disponível e não solicitado, mostra o botão normal
                <button
                  onClick={() => handleQueroAdotar(gato.id)}
                  className="block w-full rounded-lg bg-coffee py-2.5 text-center text-sm font-bold text-white transition-transform hover:-translate-y-0.5 hover:shadow-warm cursor-pointer"
                >
                  Quero adotar
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}