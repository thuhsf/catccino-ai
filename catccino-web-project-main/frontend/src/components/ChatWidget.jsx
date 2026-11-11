import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { aiApi } from "../api/services";
import { GATOS } from "../data/gatos.js";

const sugestoes = [
  "Qual o horário de funcionamento?",
  "Quais gatos estão para adoção?",
  "Quanto custa o Latte Gatinho?"
];

const MENSAGEM_INICIAL = {
  role: "assistant",
  content: "Olá! Seja bem-vindo ao Catccino. \n\nSou a assistente virtual da cafeteria. Posso te ajudar com dúvidas sobre o cardápio, horários ou adoção de gatinhos. \n\nComo posso te ajudar hoje?"
};

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [mensagem, setMensagem] = useState("");
  const [historico, setHistorico] = useState([MENSAGEM_INICIAL]);
  const [carregando, setCarregando] = useState(false);
  const [mostrarSugestoes, setMostrarSugestoes] = useState(false);
  const [lojaFechada, setLojaFechada] = useState(false); // <-- Estado dentro do componente
  
  const navigate = useNavigate();

  const enviarMensagem = async (texto) => {
    if (!texto.trim()) return;

    const novaMensagem = { role: "user", content: texto };
    setHistorico((prev) => [...prev, novaMensagem]);
    setMensagem("");
    setCarregando(true);
    setMostrarSugestoes(false); 

    try {
      const timeout = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Tempo esgotado")), 45000)
      );

      const respostaIA = await Promise.race([aiApi.chat(texto, GATOS.length), timeout]);
      
      // Verifica se a resposta é a mensagem de loja fechada
      const textoResposta = String(respostaIA).toLowerCase();
      if (textoResposta.includes("horário de funcionamento já encerrou") || textoResposta.includes("loja está fechada")) {
        setLojaFechada(true);
      } else {
        setLojaFechada(false);
      }

      setHistorico((prev) => [...prev, { role: "assistant", content: respostaIA || "Desculpe, não consegui gerar uma resposta." }]);
    } catch (error) {
      console.error(error);
      setHistorico((prev) => [...prev, { 
        role: "assistant", 
        content: "Ops, não consegui me conectar ao meu cérebro de IA agora. O servidor Python (uvicorn) está rodando?" 
      }]);
    } finally {
      setCarregando(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    enviarMensagem(mensagem);
  };

  return (
    <div style={{ position: "fixed", bottom: "20px", right: "10%", zIndex: 1000 }}>
      
      {/* BOTÃO FLUTUANTE */}
      {!isOpen && (
        <button 
          onClick={() => setIsOpen(true)}
          style={{ background: "none", border: "none", cursor: "pointer", padding: 0, transition: "transform 0.2s" }}
          onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.1)"}
          onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
        >
          <img 
            src="/chat-icon.png" 
            alt="Abrir Chat" 
            style={{ width: "100px", height: "100px", objectFit: "contain", filter: "drop-shadow(0px 4px 6px rgba(0,0,0,0.2))" }} 
          />
        </button>
      )}

      {/* JANELA DO CHAT */}
      {isOpen && (
        <div className="flex flex-col w-[380px] h-[550px] bg-white rounded-2xl shadow-2xl border border-line overflow-hidden">
          
          {/* Cabeçalho */}
          <div className="bg-coffee p-4 flex justify-between items-center shadow-md">
            <h3 className="font-bold text-lg" style={{ color: "#e6ccb2" }}>
              Assistente Catccino
            </h3>
            <button onClick={() => setIsOpen(false)} className="text-white hover:text-cream-2 text-xl font-bold cursor-pointer">
              ✕
            </button>
          </div>

          {/* Histórico de Mensagens */}
          <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-4 bg-cream/30">
            {historico.map((msg, index) => {
              const perguntaUsuario = (historico[index - 1]?.content || "").toLowerCase();
              const textoResposta = (msg.content || "").toLowerCase();
              
              const perguntaSobreMenu = perguntaUsuario.includes("cardápio") || 
                                        perguntaUsuario.includes("menu") || 
                                        perguntaUsuario.includes("café") || 
                                        perguntaUsuario.includes("bebida") || 
                                        perguntaUsuario.includes("comida") || 
                                        perguntaUsuario.includes("preço") ||
                                        perguntaUsuario.includes("custa") ||
                                        perguntaUsuario.includes("lactose") ||
                                        (msg.role === "assistant" && textoResposta.includes("conferida"));

              const perguntaSobreGatos = perguntaUsuario.includes("adoção") || 
                                         perguntaUsuario.includes("adotar") ||
                                         perguntaUsuario.includes("ong") ||
                                         (perguntaUsuario.includes("gato") && perguntaUsuario.includes("catccino")) ||
                                         (perguntaUsuario.includes("gatinho") && perguntaUsuario.includes("catccino"));

              return (
                <div 
                  key={index} 
                  className={`max-w-[85%] p-3 text-sm shadow-sm ${
                    msg.role === "user" 
                      ? "self-end bg-coffee text-white rounded-2xl rounded-tr-sm" 
                      : "self-start bg-white text-ink border border-line rounded-2xl rounded-tl-sm"
                  }`}
                >
                  {msg.content || "..."}
                  
                  {/* BOTÃO "VER GATINHOS" */}
                  {msg.role === "assistant" && 
                   index > 0 && 
                   !lojaFechada && // <-- Esconde se a loja estiver fechada
                   perguntaSobreGatos && (
                    <button
                      onClick={() => {
                        setIsOpen(false);
                        navigate("/adocao");
                      }}
                      className="mt-3 w-full flex items-center justify-center bg-coffee text-white rounded-lg py-2 text-xs font-bold hover:bg-coffee-dark transition-colors cursor-pointer"
                    >
                      Ver gatinhos disponíveis
                    </button>
                  )}

                  {/* BOTÃO "CONHECER O MENU" */}
                  {msg.role === "assistant" && 
                   index > 0 && 
                   !lojaFechada && // <-- Esconde se a loja estiver fechada
                   perguntaSobreMenu && (
                    <button
                      onClick={() => {
                        setIsOpen(false);
                        navigate("/cardapio");
                      }}
                      className="mt-3 w-full flex items-center justify-center bg-coffee text-white rounded-lg py-2 text-xs font-bold hover:bg-coffee-dark transition-colors cursor-pointer"
                    >
                      Conhecer o menu
                    </button>
                  )}
                </div>
              );
            })}
            
            {carregando && (
              <div className="self-start bg-white border border-line text-ink-soft p-3 rounded-2xl rounded-tl-sm text-xs italic">
                A assistente está digitando...
              </div>
            )}
          </div>

          {/* ÁREA DE PERGUNTAS FREQUENTES (Retrátil) */}
          <div className="px-4 py-3 bg-white border-t border-line">
            {!mostrarSugestoes ? (
              <button
                onClick={() => setMostrarSugestoes(true)}
                className="w-full flex items-center justify-center gap-2 bg-cream-2 border border-coffee text-coffee rounded-lg py-2.5 text-sm font-semibold hover:bg-coffee hover:text-white transition-colors cursor-pointer"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12" />
                </svg>
                Ver perguntas frequentes
              </button>
            ) : (
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-bold text-ink-soft uppercase">Perguntas frequentes</span>
                  <button onClick={() => setMostrarSugestoes(false)} className="text-xs text-coffee font-bold hover:underline cursor-pointer">
                    Fechar
                  </button>
                </div>
                {sugestoes.map((sugestao, index) => (
                  <button
                    key={index}
                    onClick={() => enviarMensagem(sugestao)}
                    disabled={carregando}
                    className="w-full text-left bg-white border border-line rounded-lg px-3 py-2 text-sm text-ink-soft hover:bg-cream-2 transition-colors cursor-pointer disabled:opacity-50"
                  >
                    {sugestao}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Input de Mensagem */}
          <form onSubmit={handleSubmit} className="flex items-center gap-2 p-3 bg-white border-t border-line">
            <input
              type="text"
              value={mensagem}
              onChange={(e) => setMensagem(e.target.value)}
              placeholder="Digite sua pergunta..."
              className="flex-1 bg-cream/50 border border-line rounded-full px-4 py-2.5 text-sm focus:outline-none focus:border-coffee"
            />
            <button 
              type="submit" 
              disabled={carregando} 
              className="bg-coffee text-white p-2.5 rounded-full hover:bg-coffee-dark transition-colors disabled:opacity-50 cursor-pointer flex items-center justify-center w-10 h-10"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path d="M3.478 2.404a.75.75 0 00-.926.941l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.404z" />
              </svg>
            </button>
          </form>
        </div>
      )}
    </div>
  );
}