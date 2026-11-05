import { useState } from "react";
import { aiApi } from "../api/services";

// 1. Aqui estão as opções de botões!
const sugestoes = [
  "Qual o horário de funcionamento?",
  "Quais gatos estão para adoção?",
  "Quanto custa o Latte Gatinho?",
  "Vocês têm opções sem lactose?"
];

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [mensagem, setMensagem] = useState("");
  const [historico, setHistorico] = useState([
    { role: "assistant", content: "Olá! Sou a assistente do Catccino. Como posso ajudar com o cardápio ou adoções? 🐈☕" }
  ]);
  const [carregando, setCarregando] = useState(false);

  // Função principal que envia a mensagem (seja digitada ou clicada)
  const enviarMensagem = async (texto) => {
    if (!texto.trim()) return;

    const novaMensagem = { role: "user", content: texto };
    setHistorico((prev) => [...prev, novaMensagem]);
    setMensagem("");
    setCarregando(true);

    try {
      const respostaIA = await aiApi.chat(texto);
      setHistorico((prev) => [...prev, { role: "assistant", content: respostaIA }]);
    } catch (error) {
      console.error(error);
      setHistorico((prev) => [...prev, { role: "assistant", content: "Ops, tive um problema para me conectar. O servidor de IA está ligado?" }]);
    } finally {
      setCarregando(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    enviarMensagem(mensagem);
  };

  return (
    <div style={{ position: "fixed", bottom: "20px", right: "20px", zIndex: 1000 }}>
      {!isOpen && (
          <button 
          onClick={() => setIsOpen(true)}
          style={{ 
            background: "none", // Remove a cor de fundo
            border: "none",     // Remove a borda marrom
            boxShadow: "none",  // Remove a sombra
            cursor: "pointer", 
            padding: 0,
            transition: "transform 0.2s", // Efeito de transição suave
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.1)"} // Aumenta levemente ao passar o mouse
          onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
        >
          <img 
            src="/chat-icon.png" 
            alt="Abrir Chat" 
            style={{ width: "90px", height: "90px", objectFit: "contain" }} 
          />
        </button>
      )}

      {isOpen && (
        <div style={{ width: "350px", height: "500px", backgroundColor: "white", borderRadius: "10px", boxShadow: "0 10px 25px rgba(0,0,0,0.2)", display: "flex", flexDirection: "column", overflow: "hidden" }}>
          <div style={{ backgroundColor: "#8B5A2B", color: "white", padding: "15px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h3 style={{ margin: 0, fontSize: "16px" }}>Assistente Catccino</h3>
            <button onClick={() => setIsOpen(false)} style={{ background: "none", border: "none", color: "white", cursor: "pointer", fontSize: "18px" }}>✖</button>
          </div>

          <div style={{ flex: 1, padding: "15px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "10px", backgroundColor: "#f9f9f9" }}>
            {historico.map((msg, index) => (
              <div key={index} style={{ alignSelf: msg.role === "user" ? "flex-end" : "flex-start", backgroundColor: msg.role === "user" ? "#8B5A2B" : "#e5e5ea", color: msg.role === "user" ? "white" : "black", padding: "10px 15px", borderRadius: "15px", maxWidth: "80%", fontSize: "14px" }}>
                {msg.content}
              </div>
            ))}
            {carregando && <div style={{ alignSelf: "flex-start", color: "#888", fontSize: "12px", fontStyle: "italic" }}>A assistente está digitando...</div>}
          </div>

          {/* 2. AQUI ESTÃO OS BOTÕES DE SUGESTÃO */}
          <div style={{ padding: "10px", backgroundColor: "#fff", display: "flex", flexWrap: "wrap", gap: "8px", borderTop: "1px solid #eee" }}>
            {sugestoes.map((sugestao, index) => (
              <button
                key={index}
                onClick={() => enviarMensagem(sugestao)}
                disabled={carregando}
                style={{
                  backgroundColor: "#f0f0f0",
                  border: "1px solid #ddd",
                  borderRadius: "15px",
                  padding: "6px 12px",
                  fontSize: "12px",
                  cursor: carregando ? "not-allowed" : "pointer",
                  color: "#333"
                }}
              >
                {sugestao}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} style={{ display: "flex", padding: "10px", borderTop: "1px solid #ddd", backgroundColor: "white" }}>
            <input
              type="text"
              value={mensagem}
              onChange={(e) => setMensagem(e.target.value)}
              placeholder="Digite sua pergunta..."
              style={{ flex: 1, padding: "10px", border: "1px solid #ccc", borderRadius: "20px", outline: "none", fontSize: "14px" }}
            />
            <button type="submit" disabled={carregando} style={{ marginLeft: "10px", backgroundColor: "#8B5A2B", color: "white", border: "none", borderRadius: "20px", padding: "10px 15px", cursor: carregando ? "not-allowed" : "pointer" }}>
              Enviar
            </button>
          </form>
        </div>
      )}
    </div>
  );
}