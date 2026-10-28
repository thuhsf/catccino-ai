import { useState } from "react";
import { aiApi } from "../api/services"; // Importa o serviço que criamos

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false); // Controla se o chat está aberto ou fechado
  const [mensagem, setMensagem] = useState("");
  const [historico, setHistorico] = useState([
    { role: "assistant", content: "Olá! Sou a assistente do Catccino. Como posso ajudar com o cardápio ou adoções? 🐈☕" }
  ]);
  const [carregando, setCarregando] = useState(false);

  const enviarMensagem = async (e) => {
    e.preventDefault();
    if (!mensagem.trim()) return;

    const novaMensagem = { role: "user", content: mensagem };
    setHistorico((prev) => [...prev, novaMensagem]);
    setMensagem("");
    setCarregando(true);

    try {
      // Chama a nossa API Python!
      const respostaIA = await aiApi.chat(mensagem);
      
      setHistorico((prev) => [...prev, { role: "assistant", content: respostaIA }]);
    } catch (error) {
      console.error(error);
      setHistorico((prev) => [...prev, { role: "assistant", content: "Ops, tive um problema para me conectar. O servidor de IA está ligado?" }]);
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div style={{ position: "fixed", bottom: "20px", right: "20px", zIndex: 1000 }}>
      {/* Botão flutuante para abrir/fechar */}
      {!isOpen && (
        <button 
          onClick={() => setIsOpen(true)}
          style={{ padding: "15px", borderRadius: "50%", backgroundColor: "#8B5A2B", color: "white", border: "none", cursor: "pointer", fontSize: "24px", boxShadow: "0 4px 6px rgba(0,0,0,0.1)" }}
        >
          🐈
        </button>
      )}

      {/* Janela do Chat */}
      {isOpen && (
        <div style={{ width: "350px", height: "500px", backgroundColor: "white", borderRadius: "10px", boxShadow: "0 10px 25px rgba(0,0,0,0.2)", display: "flex", flexDirection: "column", overflow: "hidden" }}>
          {/* Cabeçalho */}
          <div style={{ backgroundColor: "#8B5A2B", color: "white", padding: "15px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h3 style={{ margin: 0, fontSize: "16px" }}>Assistente Catccino</h3>
            <button onClick={() => setIsOpen(false)} style={{ background: "none", border: "none", color: "white", cursor: "pointer", fontSize: "18px" }}>✖</button>
          </div>

          {/* Histórico de Mensagens */}
          <div style={{ flex: 1, padding: "15px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "10px", backgroundColor: "#f9f9f9" }}>
            {historico.map((msg, index) => (
              <div key={index} style={{ alignSelf: msg.role === "user" ? "flex-end" : "flex-start", backgroundColor: msg.role === "user" ? "#8B5A2B" : "#e5e5ea", color: msg.role === "user" ? "white" : "black", padding: "10px 15px", borderRadius: "15px", maxWidth: "80%", fontSize: "14px" }}>
                {msg.content}
              </div>
            ))}
            {carregando && <div style={{ alignSelf: "flex-start", color: "#888", fontSize: "12px", fontStyle: "italic" }}>A assistente está digitando...</div>}
          </div>

          {/* Input de Mensagem */}
          <form onSubmit={enviarMensagem} style={{ display: "flex", padding: "10px", borderTop: "1px solid #ddd", backgroundColor: "white" }}>
            <input
              type="text"
              value={mensagem}
              onChange={(e) => setMensagem(e.target.value)}
              placeholder="Pergunte sobre o cardápio..."
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