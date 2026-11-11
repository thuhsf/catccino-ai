import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";

const PRODUTOS_INICIAIS = [
  // Bebidas
  { id: 1, nome: "Café Expresso", preco: 5.00, desc: "Grãos 100% arábica, encorpado e aromático.", cat: "Bebidas", img: "/cafe-expresso.jpg" },
  { id: 2, nome: "Cappuccino Tradicional", preco: 12.00, desc: "Leite vaporizado, cacau e canela.", cat: "Bebidas", img: "/cappuccino-trad.jpg" },
  { id: 3, nome: "Latte Gatinho", preco: 15.00, desc: "O mais pedido! Com arte em formato de patinha.", cat: "Bebidas", img: "/latte-gatinho.jpg" },
  { id: 4, nome: "Café Coado", preco: 6.00, desc: "Extração tradicional, leve e aromático.", cat: "Bebidas", img: "/cafe-coado.jpg" },
  { id: 5, nome: "Pingado", preco: 7.00, desc: "Clássico café coado com um toque de leite quente.", cat: "Bebidas", img: "/pingado.jpg" },
  { id: 6, nome: "Chá Quente", preco: 8.00, desc: "Ervas selecionadas: camomila, hortelã ou frutas vermelhas.", cat: "Bebidas", img: "/cha-quente.jpg" },
  { id: 7, nome: "Chá Gelado", preco: 10.00, desc: "Infusão batida com gelo e um toque de limão ou pêssego.", cat: "Bebidas", img: "/cha-gelado.jpg" },
  { id: 8, nome: "Chocolate Quente", preco: 11.00, desc: "Bebida cremosa à base de leite e cacau derretido.", cat: "Bebidas", img: "/chocolate-quente.jpg" },
  { id: 9, nome: "Mocaccino", preco: 13.00, desc: "Mistura perfeita de expresso, calda de chocolate e leite.", cat: "Bebidas", img: "/mocaccino.jpg" },

  // Comidas
  { id: 10, nome: "Bolo de Cenoura", preco: 8.00, desc: "Fatia generosa com cobertura de chocolate.", cat: "Comidas", img: "/bolo-cenoura.jpg" },
  { id: 11, nome: "Cookie de Aveia", preco: 6.00, desc: "Crocante por fora, macio por dentro.", cat: "Comidas", img: "/cookie-aveia.jpg" },
  { id: 12, nome: "Pão de Queijo", preco: 5.00, desc: "Receita mineira, quentinho e crocante por fora.", cat: "Comidas", img: "/pao-queijo.jpg" },
  { id: 13, nome: "Sonho Cremoso", preco: 7.00, desc: "Massa frita açucarada recheada com creme de baunilha.", cat: "Comidas", img: "/sonho-cremoso.jpg" },
  { id: 14, nome: "Bolo Caseiro", preco: 5.00, desc: "Fatia de bolo tradicional (fubá, laranja ou banana).", cat: "Comidas", img: "/bolo-caseiro.jpg" },
  { id: 15, nome: "Empada Salgada", preco: 8.00, desc: "Massa com recheio cremoso de frango ou palmito.", cat: "Comidas", img: "/empada-salg.jpg" },
  { id: 16, nome: "Croissant Simples", preco: 10.00, desc: "Massa folhada leve e amanteigada, servida quentinha.", cat: "Comidas", img: "/croissant-simples.jpg" },
  { id: 17, nome: "Brownie de Chocolate", preco: 10.00, desc: "Massa densa e intensa com pedaços de chocolate.", cat: "Comidas", img: "/brownie-chocolate.png" },
  { id: 18, nome: "Misto Quente", preco: 11.00, desc: "Pão grelhado na chapa recheado com queijo e presunto.", cat: "Comidas", img: "/misto-quente.jpg" },
];

export default function Cardapio() {
  const [categoriaAtiva, setCategoriaAtiva] = useState("Todos");
  const [mensagemErro, setMensagemErro] = useState("");
  const [produtos, setProdutos] = useState([]);

  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { adicionarItem } = useCart(); 

  // Carrega os produtos iniciais + os do admin
  useEffect(() => {
    const salvos = JSON.parse(localStorage.getItem("catccino_produtos") || "[]");
    setProdutos([...PRODUTOS_INICIAIS, ...salvos]);
  }, []);

  function handleAdd(produto) {
    if (!isAuthenticated) {
      setMensagemErro("Para continuar com o seu pedido, entre na sua conta.");
      setTimeout(() => setMensagemErro(""), 4000);
      return;
    }
    adicionarItem(produto);
  }

  const produtosFiltrados = categoriaAtiva === "Todos" 
    ? produtos 
    : produtos.filter(p => p.cat === categoriaAtiva);
    
  const produtosOrdenados = [...produtosFiltrados].sort((a, b) => a.nome.localeCompare(b.nome));

  return (
    <div className="mx-auto max-w-5xl px-5 py-10">
      
      <div 
        className="relative mb-10 flex flex-col justify-end overflow-hidden rounded-[20px] p-8 text-white min-h-[250px]"
        style={{
          backgroundImage: "url('/banner-cardapio.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center 40%",
        }}
      >
        <div className="absolute inset-0 bg-black/50"></div> 
        
        <div className="relative z-10">
          <h2 className="font-display text-3xl font-bold mb-2 bg-transparent" style={{ color: "#e6ccb2", backgroundColor: "transparent" }}> 
            Café fresquinho, companhia felina e muito amor.
          </h2>
          <p className="mt-2 max-w-md text-sm text-white">
            Descubra os sabores do Catccino. Do café quentinho ao cookie crocante, tudo feito com muito amor.
          </p>
        </div>
      </div>

      {mensagemErro && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 rounded-lg bg-red-600 px-6 py-3 text-white shadow-lg font-semibold animate-bounce">
          {mensagemErro}
        </div>
      )}

      <div className="mb-8 text-center">
        <h1 className="font-display text-3xl font-bold text-ink mb-2">Nosso Cardápio</h1>
        <p className="text-ink-soft">Tudo fresquinho, direto da cozinha para a sua mesa.</p>
      </div>

      <div className="mb-8 flex justify-center gap-3">
        {["Todos", "Bebidas", "Comidas"].map((cat) => (
          <button
            key={cat}
            onClick={() => setCategoriaAtiva(cat)} 
            className={`rounded-full px-5 py-2 text-sm font-semibold transition-colors cursor-pointer ${
              categoriaAtiva === cat 
                ? "bg-coffee text-white" 
                : "bg-white text-coffee border border-line hover:bg-cream-2"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
        {produtosOrdenados.map((produto) => (
          <div key={produto.id} className="flex flex-col rounded-2xl bg-white shadow-sm border border-line transition-transform hover:-translate-y-1 overflow-hidden">
            
            <div className="h-40 w-full bg-cream-2 flex items-center justify-center">
              {produto.img ? (
                <img src={produto.img} alt={produto.nome} className="w-full h-full object-cover" />
              ) : (
                <span className="text-4xl">☕</span>
              )}
            </div>

            <div className="p-6 flex flex-col flex-1">
              <h3 className="font-display text-xl font-bold text-ink mb-2">{produto.nome}</h3>
              <p className="text-sm text-ink-soft mb-4 flex-1">{produto.desc}</p>
              <div className="flex items-center justify-between mt-auto">
                <span className="font-bold text-coffee text-lg">R$ {produto.preco.toFixed(2)}</span>
                <button onClick={() => handleAdd(produto)} className="rounded-lg bg-caramel px-4 py-2 text-sm font-bold text-white hover:bg-coffee transition-colors cursor-pointer">
                  Adicionar pedido
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}