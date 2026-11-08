import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";

export default function Orders() {
  const { itens, removerItem, adicionarItem, valorTotal } = useCart();
  const navigate = useNavigate();

  if (itens.length === 0) {
    return (
      <div className="mx-auto max-w-4xl px-5 py-20 text-center">
        <h1 className="font-display text-3xl font-bold text-ink mb-4">Seu carrinho está vazio •︵• </h1>
        <p className="text-ink-soft mb-8">Que tal escolher um cafézinho e/ou um gatinho para chamar de seu?</p>
        
        {/* AQUI: Div com flex para colocar os botões lado a lado */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            to="/cardapio" 
            className="bg-coffee text-white px-6 py-3 rounded-lg font-bold hover:bg-coffee-dark transition-colors cursor-pointer"
          >
            Ir para o cardápio
          </Link>
          
          <Link 
            to="/adocao" 
            className="bg-coffee text-white px-6 py-3 rounded-lg font-bold hover:bg-coffee-dark transition-colors cursor-pointer"
          >
            Ir para a adoção
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-5 py-10">
      <h1 className="font-display text-3xl font-bold text-ink mb-8">Seu carrinho</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Lista de Itens */}
        <div className="md:col-span-2 flex flex-col gap-4">
          {itens.map((item) => (
            <div key={item.id} className="flex items-center justify-between bg-white p-4 rounded-2xl border border-line shadow-sm">
              <div className="flex items-center gap-4">
                <img src={item.img} alt={item.nome} className="w-16 h-16 rounded-lg object-cover" />
                <div>
                  <h3 className="font-bold text-ink">{item.nome}</h3>
                  <p className="text-sm text-coffee font-semibold">R$ {item.preco.toFixed(2)}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <button onClick={() => removerItem(item.id)} className="w-8 h-8 rounded-full border border-line flex items-center justify-center hover:bg-cream cursor-pointer font-bold">-</button>
                <span className="font-bold w-4 text-center">{item.quantidade}</span>
                <button onClick={() => adicionarItem(item)} className="w-8 h-8 rounded-full border border-line flex items-center justify-center hover:bg-cream cursor-pointer font-bold">+</button>
              </div>
            </div>
          ))}
        </div>

        {/* Resumo do Pedido */}
        <div className="bg-cream-2 p-6 rounded-2xl border border-line h-fit">
          <h2 className="font-bold text-xl text-ink mb-4">Resumo do pedido</h2>
          <div className="flex justify-between mb-2 text-ink-soft">
            <span>Subtotal</span>
            <span>R$ {valorTotal.toFixed(2)}</span>
          </div>
          <div className="border-t border-line my-4"></div>
          <div className="flex justify-between font-bold text-lg text-ink mb-6">
            <span>Total</span>
            <span>R$ {valorTotal.toFixed(2)}</span>
          </div>
          
          <button 
          onClick={() => navigate("/pagamento")} className="w-full bg-coffee text-white py-3 rounded-lg font-bold hover:bg-coffee-dark transition-colors cursor-pointer"
          >
            Ir para o pagamento
            </button>
        </div>
      </div>
    </div>
  );
}