import { useState, useEffect } from "react";
import { GATOS as GATOS_INICIAIS } from "../data/gatos.js";
import { useToast } from "../context/ToastContext.jsx";

export default function Admin() {
  const showToast = useToast();
  const [abaAtiva, setAbaAtiva] = useState("gatos");
  
  // --- ESTADOS DE GATOS ---
  const [gatos, setGatos] = useState([]);
  const [editandoId, setEditandoId] = useState(null); // ID do gato em edição
  const [formGato, setFormGato] = useState({ 
    nome: "", idade: "", sexo: "Macho", cor: "", desc: "", img: "", posicao: "center 50%" 
  });

  // --- ESTADOS DE PRODUTOS ---
  const [produtos, setProdutos] = useState([]);
  const [formProduto, setFormProduto] = useState({ 
    nome: "", desc: "", preco: "", cat: "Bebidas", img: "" 
  });

  // Carrega dados iniciais
  useEffect(() => {
    const salvosGatos = localStorage.getItem("catccino_gatos");
    setGatos(salvosGatos ? JSON.parse(salvosGatos) : GATOS_INICIAIS);
    
    const salvosProdutos = localStorage.getItem("catccino_produtos");
    setProdutos(salvosProdutos ? JSON.parse(salvosProdutos) : []);
  }, []);

  // --- FUNÇÕES DE IMAGEM ---
  function handleImagemGato(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormGato({ ...formGato, img: reader.result });
    };
    reader.readAsDataURL(file);
  }

  function handleImagemProduto(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormProduto({ ...formProduto, img: reader.result });
    };
    reader.readAsDataURL(file);
  }

  // --- FUNÇÕES DE GATOS ---
  function salvarGatos(novaLista) {
    setGatos(novaLista);
    localStorage.setItem("catccino_gatos", JSON.stringify(novaLista));
  }

  function handleSubmitGato(e) {
    e.preventDefault();
    
    if (editandoId) {
      // Modo Edição: Atualiza o gato existente
      const listaAtualizada = gatos.map(g => 
        g.id === editandoId ? { ...formGato, id: editandoId, status: g.status } : g
      );
      salvarGatos(listaAtualizada);
      showToast("Gatinho atualizado!");
      setEditandoId(null);
    } else {
      // Modo Criação: Adiciona um novo gato
      const novoGato = { ...formGato, id: Date.now(), status: "Disponível" };
      salvarGatos([...gatos, novoGato]);
      showToast("Gatinho adicionado!");
    }
    
    // Reseta o formulário
    setFormGato({ nome: "", idade: "", sexo: "Macho", cor: "", desc: "", img: "", posicao: "center 50%" });
  }

  function iniciarEdicao(gato) {
    setEditandoId(gato.id);
    setFormGato({
      nome: gato.nome,
      idade: gato.idade,
      sexo: gato.sexo,
      cor: gato.cor,
      desc: gato.desc,
      img: gato.img,
      posicao: gato.posicao || "center 50%"
    });
    // Rola a tela para o topo (para ver o formulário)
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function cancelarEdicao() {
    setEditandoId(null);
    setFormGato({ nome: "", idade: "", sexo: "Macho", cor: "", desc: "", img: "", posicao: "center 50%" });
  }

  function toggleStatusGato(id) {
    const novaLista = gatos.map(g => 
      g.id === id ? { ...g, status: g.status === "Disponível" ? "Adotado" : "Disponível" } : g
    );
    salvarGatos(novaLista);
    showToast("Status do gatinho atualizado!");
  }

  // --- FUNÇÕES DE PRODUTOS ---
  function salvarProdutos(novaLista) {
    setProdutos(novaLista);
    localStorage.setItem("catccino_produtos", JSON.stringify(novaLista));
  }

  function handleAddProduto(e) {
    e.preventDefault();
    const novoProduto = { ...formProduto, id: Date.now(), preco: parseFloat(formProduto.preco) };
    salvarProdutos([...produtos, novoProduto]);
    setFormProduto({ nome: "", desc: "", preco: "", cat: "Bebidas", img: "" });
    showToast("Produto adicionado!");
  }

  function removerProduto(id) {
    if (window.confirm("Tem certeza que deseja remover este produto?")) {
      salvarProdutos(produtos.filter(p => p.id !== id));
      showToast("Produto removido.");
    }
  }

  return (
    <section className="mx-auto max-w-5xl px-5 py-10">
      <div className="mb-6">
        <h2 className="font-display text-3xl font-bold text-ink">Painel administrativo</h2>
        <p className="text-sm text-ink-soft">Gerencie os gatinhos e o cardápio do Catccino.</p>
      </div>

      {/* ABAS */}
      <div className="flex gap-4 mb-8 border-b border-line pb-2">
        <button 
          onClick={() => setAbaAtiva("gatos")} 
          className={`font-bold pb-1 ${abaAtiva === "gatos" ? "text-coffee border-b-2 border-coffee" : "text-ink-soft"}`}
        >
          Adoção (Gatos)
        </button>
        <button 
          onClick={() => setAbaAtiva("produtos")} 
          className={`font-bold pb-1 ${abaAtiva === "produtos" ? "text-coffee border-b-2 border-coffee" : "text-ink-soft"}`}
        >
          Cardápio (Produtos)
        </button>
      </div>

      {/* CONTEÚDO: GATOS */}
      {abaAtiva === "gatos" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-line h-fit">
            <h3 className="font-bold text-xl mb-4 text-ink">
              {editandoId ? "Editar gatinho" : "Novo gatinho"}
            </h3>
            <form onSubmit={handleSubmitGato} className="flex flex-col gap-3">
              <div>
                <label className="block text-xs font-semibold mb-1 text-ink-soft">Nome <span className="text-red-500">*</span></label>
                <input required placeholder="Nome" value={formGato.nome} onChange={e => setFormGato({...formGato, nome: e.target.value})} className="w-full border border-line rounded-lg p-2 text-sm" />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1 text-ink-soft">Idade <span className="text-red-500">*</span></label>
                <input required placeholder="Idade" value={formGato.idade} onChange={e => setFormGato({...formGato, idade: e.target.value})} className="w-full border border-line rounded-lg p-2 text-sm" />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1 text-ink-soft">Sexo <span className="text-red-500">*</span></label>
                <select value={formGato.sexo} onChange={e => setFormGato({...formGato, sexo: e.target.value})} className="w-full border border-line rounded-lg p-2 text-sm cursor-pointer">
                  <option value="Macho">Macho</option>
                  <option value="Fêmea">Fêmea</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1 text-ink-soft">Cor <span className="text-red-500">*</span></label>
                <input required placeholder="Cor" value={formGato.cor} onChange={e => setFormGato({...formGato, cor: e.target.value})} className="w-full border border-line rounded-lg p-2 text-sm" />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1 text-ink-soft">Descrição <span className="text-red-500">*</span></label>
                <textarea required placeholder="Descrição" rows={2} value={formGato.desc} onChange={e => setFormGato({...formGato, desc: e.target.value})} className="w-full border border-line rounded-lg p-2 text-sm resize-none" />
              </div>
              
              <div className="flex flex-col gap-2">
                {formGato.img && (
                  <img src={formGato.img} alt="Preview" className="w-16 h-16 rounded-lg object-cover border border-line" style={{ objectPosition: formGato.posicao }} />
                )}
                <label className="cursor-pointer bg-cream-2 border border-line rounded-lg py-2 px-3 text-sm text-center font-semibold text-coffee hover:bg-cream transition-colors">
                  Coloque uma imagem do(a) gatinho(a) aqui
                  <input type="file" accept="image/*" onChange={handleImagemGato} className="hidden" />
                </label>
              </div>

              {formGato.img && (
                <div>
                  <label className="block text-xs font-semibold mb-1 text-ink-soft">Ajuste o enquadramento da foto:</label>
                  <input 
                    type="range" min="0" max="100" 
                    value={parseInt(formGato.posicao.split(" ")[1] || "50")}
                    onChange={(e) => setFormGato({...formGato, posicao: `center ${e.target.value}%`})}
                    className="w-full cursor-pointer"
                  />
                </div>
              )}

              <div className="flex gap-2 mt-2">
                <button type="submit" className="flex-1 bg-coffee text-white rounded-lg py-2 font-bold hover:bg-coffee-dark">
                  {editandoId ? "Salvar Alterações" : "Adicionar gato"}
                </button>
                {editandoId && (
                  <button type="button" onClick={cancelarEdicao} className="bg-gray-200 text-gray-700 rounded-lg px-4 font-bold hover:bg-gray-300">
                    Cancelar
                  </button>
                )}
              </div>
            </form>
          </div>

          <div className="md:col-span-2 flex flex-col gap-4">
            {gatos.map(gato => (
              <div key={gato.id} className="bg-white p-4 rounded-2xl border border-line flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <img src={gato.img} alt={gato.nome} className="w-12 h-12 rounded-lg object-cover" style={{ objectPosition: gato.posicao }} />
                  <div>
                    <h3 className="font-bold text-ink">{gato.nome}</h3>
                    <p className="text-xs text-ink-soft">{gato.idade} • {gato.sexo}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-xs font-bold px-2 py-1 rounded ${gato.status === "Disponível" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                    {gato.status}
                  </span>
                  <button onClick={() => iniciarEdicao(gato)} className="text-xs font-bold text-blue-600 border border-blue-600 px-3 py-1 rounded hover:bg-blue-600 hover:text-white transition-colors">
                    Editar
                  </button>
                  <button onClick={() => toggleStatusGato(gato.id)} className="text-xs font-bold text-coffee border border-coffee px-3 py-1 rounded hover:bg-coffee hover:text-white">
                    Mudar Status
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CONTEÚDO: PRODUTOS */}
      {abaAtiva === "produtos" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-line h-fit">
            <h3 className="font-bold text-xl mb-4 text-ink">Novo Produto</h3>
            <form onSubmit={handleAddProduto} className="flex flex-col gap-3">
              <div>
                <label className="block text-xs font-semibold mb-1 text-ink-soft">Nome <span className="text-red-500">*</span></label>
                <input required placeholder="Nome do Produto" value={formProduto.nome} onChange={e => setFormProduto({...formProduto, nome: e.target.value})} className="w-full border border-line rounded-lg p-2 text-sm" />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1 text-ink-soft">Descrição <span className="text-red-500">*</span></label>
                <textarea required placeholder="Descrição" rows={2} value={formProduto.desc} onChange={e => setFormProduto({...formProduto, desc: e.target.value})} className="w-full border border-line rounded-lg p-2 text-sm resize-none" />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1 text-ink-soft">Preço (R$) <span className="text-red-500">*</span></label>
                <input required type="number" step="0.01" placeholder="Preço (R$)" value={formProduto.preco} onChange={e => setFormProduto({...formProduto, preco: e.target.value})} className="w-full border border-line rounded-lg p-2 text-sm" />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1 text-ink-soft">Categoria <span className="text-red-500">*</span></label>
                <select value={formProduto.cat} onChange={e => setFormProduto({...formProduto, cat: e.target.value})} className="w-full border border-line rounded-lg p-2 text-sm cursor-pointer">
                  <option value="Bebidas">Bebidas</option>
                  <option value="Comidas">Comidas</option>
                </select>
              </div>
              
              <div className="flex flex-col gap-2">
                {formProduto.img && (
                  <img src={formProduto.img} alt="Preview" className="w-16 h-16 rounded-lg object-cover border border-line" />
                )}
                <label className="cursor-pointer bg-cream-2 border border-line rounded-lg py-2 px-3 text-sm text-center font-semibold text-coffee hover:bg-cream transition-colors">
                  Coloque uma imagem do produto aqui
                  <input type="file" accept="image/*" onChange={handleImagemProduto} className="hidden" />
                </label>
              </div>

              <button type="submit" className="bg-coffee text-white rounded-lg py-2 font-bold hover:bg-coffee-dark">Adicionar Produto</button>
            </form>
          </div>

          <div className="md:col-span-2 flex flex-col gap-4">
            {produtos.length === 0 && (
              <p className="text-ink-soft text-sm">Nenhum produto adicionado ainda (os produtos padrão continuam no cardápio).</p>
            )}
            {produtos.map(produto => (
              <div key={produto.id} className="bg-white p-4 rounded-2xl border border-line flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <img src={produto.img} alt={produto.nome} className="w-12 h-12 rounded-lg object-cover" />
                  <div>
                    <h3 className="font-bold text-ink">{produto.nome}</h3>
                    <p className="text-xs text-ink-soft">R$ {produto.preco.toFixed(2)} • {produto.cat}</p>
                  </div>
                </div>
                <button onClick={() => removerProduto(produto.id)} className="text-xs font-bold text-red-600 border border-red-600 px-3 py-1 rounded hover:bg-red-600 hover:text-white transition-colors">
                  Excluir
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}