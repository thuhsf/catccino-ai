import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  // Inicializa o estado tentando pegar do localStorage. Se não tiver, começa vazio.
  const [itens, setItens] = useState(() => {
    const carrinhoSalvo = localStorage.getItem("catccino_cart");
    return carrinhoSalvo ? JSON.parse(carrinhoSalvo) : [];
  });

  // Sempre que o 'itens' mudar, salva no localStorage
  useEffect(() => {
    localStorage.setItem("catccino_cart", JSON.stringify(itens));
  }, [itens]);

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