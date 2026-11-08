import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";

export default function Pagamento() {
  const { valorTotal, limparCarrinho, itens } = useCart();
  const navigate = useNavigate();
  const [metodo, setMetodo] = useState("");
  const [pagamentoAprovado, setPagamentoAprovado] = useState(false);

  // Função para formatar os campos do cartão
  function handleMaskCartao(e) {
    const { name, value } = e.target;
    let formatado = value;

    if (name === "numeroCartao") {
      formatado = value.replace(/\D/g, "").slice(0, 16);
      formatado = formatado.replace(/(\d{4})(?=\d)/g, "$1 ");
      e.target.value = formatado; 
    } 
    else if (name === "validade") {
      formatado = value.replace(/\D/g, "").slice(0, 4);
      formatado = formatado.replace(/^(\d{2})(\d)/, "$1/$2");
      e.target.value = formatado;
    }
    else if (name === "cvv") {
      formatado = value.replace(/\D/g, "").slice(0, 3);
      e.target.value = formatado;
    }
  }

  function handleFinalizar(e) {
    e.preventDefault();
    // Simula o processamento
    setTimeout(() => {
      setPagamentoAprovado(true); // Mostra a tela de sucesso
      limparCarrinho(); // Limpa o carrinho
    }, 1500);
  }

  // 1. TELA DE SUCESSO (Deve ser a PRIMEIRA verificação)
  if (pagamentoAprovado) {
    return (
      <div className="mx-auto max-w-lg px-5 py-20 text-center">
        <div className="bg-green-50 border border-green-200 rounded-2xl p-8 shadow-sm">
          <h1 className="font-display text-2xl font-bold text-green-700 mb-4">
            Pagamento aprovado!
          </h1>
          <p className="text-green-600 mb-6">
            Obrigado por comprar no Catccino! Seu pedido já foi registrado e logo estará pronto.
          </p>
          <button 
            onClick={() => navigate("/pedidos")}
            className="bg-green-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-green-700 transition-colors cursor-pointer"
          >
            Ver meus pedidos
          </button>
        </div>
      </div>
    );
  }

  // 2. CARRINHO VAZIO (Só aparece se NÃO estiver aprovado e o carrinho estiver vazio)
  if (itens.length === 0) {
    return (
      <div className="text-center py-20">
        <h1 className="font-display text-2xl font-bold mb-4">Seu carrinho está vazio •︵•</h1>
        <Link to="/cardapio" className="bg-coffee text-white px-6 py-3 rounded-lg font-bold">Voltar ao cardápio</Link>
      </div>
    );
  }

  // 3. FORMULÁRIO DE PAGAMENTO
  return (
    <div className="mx-auto max-w-2xl px-5 py-10">
      <Link to="/pedidos" className="text-sm font-bold text-coffee hover:underline mb-6 inline-block">← Voltar ao carrinho</Link>
      
      <div className="bg-white p-8 rounded-3xl shadow-lg border border-line">
        <h1 className="font-display text-3xl font-bold text-ink mb-6">Finalizar pagamento</h1>
        
        <div className="bg-cream-2 p-4 rounded-xl mb-6">
          <p className="text-ink-soft">Total a pagar:</p>
          <p className="text-3xl font-bold text-coffee">R$ {valorTotal.toFixed(2)}</p>
        </div>

        <form onSubmit={handleFinalizar} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-semibold mb-2">Forma de pagamento</label>
            <select
              required
              value={metodo} 
              onChange={(e) => setMetodo(e.target.value)} 
              className="w-full border border-line rounded-lg p-3 bg-cream/50 cursor-pointer focus:outline-none focus:border-coffee"
            >
              <option value="" disabled>Selecione uma forma de pagamento</option>
              <option value="pix">PIX (Aprovação imediata)</option>
              <option value="cartao">Cartão de crédito</option>
              <option value="dinheiro">Dinheiro no balcão</option>
            </select>
          </div>

          {/* CHAVE PIX */}
          {metodo === "pix" && (
            <div className="flex flex-col gap-2 p-4 bg-cream-2 rounded-xl border border-line mt-2">
              <p className="text-sm text-ink-soft font-semibold mb-1">
                Nossa chave PIX é:
              </p>
              <div className="bg-white border border-line rounded-lg p-3 text-center">
                <span className="font-mono text-coffee font-bold select-all">
                  catccino@hotmail.com
                </span>
                <span className="block text-xs text-ink-soft mt-1">Banco: Bradesco</span>
              </div>
              <p className="text-xs text-ink-soft text-center mt-1">
                Após o pagamento, clique em "Confirmar pagamento".
              </p>
            </div>
          )}

          {/* CAMPOS DO CARTÃO */}
          {metodo === "cartao" && (
            <div className="flex flex-col gap-4 p-4 bg-cream-2 rounded-xl border border-line mt-2">
              <div>
                <label className="block text-sm font-semibold mb-1">Número do Cartão <span className="text-red-500">*</span></label>
                <input 
                  required 
                  type="text" 
                  name="numeroCartao" 
                  placeholder="0000 0000 0000 0000" 
                  onChange={handleMaskCartao} 
                  className="w-full border border-line rounded-lg p-3 bg-white" 
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-1">Validade <span className="text-red-500">*</span></label>
                  <input 
                    required 
                    type="text" 
                    name="validade" 
                    placeholder="MM/AA" 
                    onChange={handleMaskCartao} 
                    className="w-full border border-line rounded-lg p-3 bg-white" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">CVV <span className="text-red-500">*</span></label>
                  <input 
                    required 
                    type="text" 
                    name="cvv" 
                    placeholder="123" 
                    onChange={handleMaskCartao} 
                    className="w-full border border-line rounded-lg p-3 bg-white" 
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1">Nome impresso no cartão <span className="text-red-500">*</span></label>
                <input required type="text" placeholder="Como está no cartão" className="w-full border border-line rounded-lg p-3 bg-white" />
              </div>
            </div>
          )}

          <button type="submit" className="mt-4 w-full bg-coffee text-white py-4 rounded-lg text-lg font-bold hover:bg-coffee-dark transition-transform hover:-translate-y-1 hover:shadow-warm cursor-pointer">
            Confirmar pagamento
          </button>
        </form>
      </div>
    </div>
  );
}