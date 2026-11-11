import { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext.jsx"; // <-- Importa o useAuth

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { isAuthenticated } = useAuth(); // <-- Pega o status de login
  
  const [itens, setItens] = useState(() => {
    const carrinhoSalvo = localStorage.getItem("catccino_cart");
    return carrinhoSalvo ? JSON.parse(carrinhoSalvo) : [];
  });

  // Sempre que os itens mudarem, salva no localStorage
  useEffect(() => {
    localStorage.setItem("catccino_cart", JSON.stringify(itens));
  }, [itens]);

  // NOVO: Se o usuário deslogar, limpa o carrinho
  useEffect(() => {
    if (!isAuthenticated) {
      setItens([]); // Limpa os itens da memória do React
      localStorage.removeItem("catccino_cart"); // Limpa do navegador
    }
  }, [isAuthenticated]);

  const adicionarItem = (produto) => {
    setItens(prev => {
      const existe = prev.find(item => item.id === produto.id);
      if (existe) {
        return prev.map(item => item.id === produto.id ? { ...item, quantidade: item.quantidade + 1 } : item);
      }
      return [...prev, { ...produto, quantidade: 1 }];
    });
  };

  const removerItem = (produtoId) => {
    setItens(prev => {
      const item = prev.find(i => i.id === produtoId);
      if (item.quantidade > 1) {
        return prev.map(i => i.id === produtoId ? { ...i, quantidade: i.quantidade - 1 } : i);
      }
      return prev.filter(i => i.id !== produtoId);
    });
  };

  const limparCarrinho = () => setItens([]);

  const totalItens = itens.reduce((acc, item) => acc + item.quantidade, 0);
  const valorTotal = itens.reduce((acc, item) => acc + (item.preco * item.quantidade), 0);

  return (
    <CartContext.Provider value={{ itens, adicionarItem, removerItem, limparCarrinho, totalItens, valorTotal }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);