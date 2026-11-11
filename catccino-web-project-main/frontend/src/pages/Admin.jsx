import { useState, useEffect } from "react";
import { GATOS as GATOS_INICIAIS } from "../data/gatos.js";
import { useToast } from "../context/ToastContext.jsx";

export default function Admin() {
  const showToast = useToast();
  const [abaAtiva, setAbaAtiva] = useState("gatos");
  
  // --- ESTADOS DE GATOS ---
  const [gatos, setGatos] = useState([]);
  const [editandoId, setEditandoId] = useState(null);
  const [gatoParaExcluir, setGatoParaExcluir] = useState(null);
  const [formGato, setFormGato] = useState({ 
    nome: "", idade: "", sexo: "Macho", cor: "", desc: "", img: "", posicao: "center 50%" 
  });

  // --- ESTADOS DE PRODUTOS ---
  const [produtos, setProdutos] = useState([]);
  const [produtoParaExcluir, setProdutoParaExcluir] = useState(null);
  const [formProduto, setFormProduto] = useState({ 
    nome: "", desc: "", preco: "", cat: "Bebidas", img: "" 
  });

  // --- ESTADOS DE FORMULÁRIOS ---
  const [formularios, setFormularios] = useState([]);

  // Carrega dados iniciais
  useEffect(() => {
    const salvosGatos = localStorage.getItem("catccino_gatos");
    setGatos(salvosGatos ? JSON.parse(salvosGatos) : GATOS_INICIAIS);
    
    const salvosProdutos = localStorage.getItem("catccino_produtos");
    setProdutos(salvosProdutos ? JSON.parse(salvosProdutos) : []);

    const salvosFormularios = JSON.parse(localStorage.getItem("catccino_formularios") || "[]");
    setFormularios(salvosFormularios);
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
      const listaAtualizada = gatos.map(g => 
        g.id === editandoId ? { ...formGato, id: editandoId, status: g.status } : g
      );
      salvarGatos(listaAtualizada);
      showToast("Gatinho atualizado!");
      setEditandoId(null);
    } else {
      const novoGato = { ...formGato, id: Date.now(), status: "Disponível" };
      salvarGatos([...gatos, novoGato]);
      showToast("Gatinho adicionado!");
    }
    
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
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function cancelarEdicao() {
    setEditandoId(null);
    setFormGato({ nome: "", idade: "", sexo: "Macho", cor: "", desc: "", img: "", posicao: "center 50%" });
  }

  function toggleStatusGato(id) {
    const novaLista = gatos.map(g => 
      g.id === id ? { ...g, status: g.status === "Disponível" ? "Adotado(a)" : "Disponível" } : g
    );
    salvarGatos(novaLista);
    showToast("Status do gatinho atualizado!");
  }

  function confirmarExclusaoGato() {
    if (gatoParaExcluir) {
      salvarGatos(gatos.filter(g => g.id !== gatoParaExcluir.id));
      showToast("Gatinho removido com sucesso.");
      setGatoParaExcluir(null);
    }
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

  function confirmarExclusaoProduto() {
    if (produtoParaExcluir) {
      salvarProdutos(produtos.filter(p => p.id !== produtoParaExcluir.id));
      showToast("Produto removido com sucesso.");
      setProdutoParaExcluir(null);
    }
  }

  // --- FUNÇÕES DE FORMULÁRIOS ---
  function atualizarStatusFormulario(formId, novoStatus, gatoId) {
    const formulariosAtualizados = formularios.map(f => 
      f.id === formId ? { ...f, status: novoStatus } : f
    );
    setFormularios(formulariosAtualizados);
    localStorage.setItem("catccino_formularios", JSON.stringify(formulariosAtualizados));

    const solicitados = JSON.parse(localStorage.getItem("catccino_adocoes_solicitadas") || "[]");

    if (novoStatus === "Aprovado" && gatoId) {
      const gatosAtualizados = gatos.map(g => 
        g.id === gatoId ? { ...g, status: "Adotado(a)" } : g
      );
      salvarGatos(gatosAtualizados);
      showToast("Adoção aprovada! O gatinho agora está como Adotado(a).");
    } else if (novoStatus === "Recusado" && gatoId) {
      const solicitadosAtualizados = solicitados.filter(id => id !== gatoId);
      localStorage.setItem("catccino_adocoes_solicitadas", JSON.stringify(solicitadosAtualizados));
      showToast("Adoção recusada. O gatinho está disponível novamente.");
    } else {
      showToast(`Solicitação ${novoStatus.toLowerCase()}.`);
    }
  }

  return (
    <section className="mx-auto max-w-5xl px-5 py-10">
      <div className="mb-6">
        <h2 className="font-display text-3xl font-bold text-ink">Painel administrativo</h2>
        <p className="text-sm text-ink-soft">Gerencie os gatinhos, o cardápio e as solicitações de adoção.</p>
      </div>

      {/* ABAS */}
      <div className="flex gap-4 mb-8 border-b border-line pb-2 overflow-x-auto">
        <button onClick={() => setAbaAtiva("gatos")} className={`font-bold pb-1 whitespace-nowrap ${abaAtiva === "gatos" ? "text-coffee border-b-2 border-coffee" : "text-ink-soft"}`}>
          Adoção (Gatos)
        </button>
        <button onClick={() => setAbaAtiva("produtos")} className={`font-bold pb-1 whitespace-nowrap ${abaAtiva === "produtos" ? "text-coffee border-b-2 border-coffee" : "text-ink-soft"}`}>
          Cardápio (Produtos)
        </button>
        <button onClick={() => setAbaAtiva("solicitacoes")} className={`font-bold pb-1 whitespace-nowrap flex items-center gap-2 ${abaAtiva === "solicitacoes" ? "text-coffee border-b-2 border-coffee" : "text-ink-soft"}`}>
          Solicitações de Adoção
          {formularios.filter(f => f.status === "Pendente").length > 0 && (
            <span className="bg-caramel text-white text-[0.7rem] px-2 py-0.5 rounded-full">
              {formularios.filter(f => f.status === "Pendente").length}
            </span>
          )}
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
                  {editandoId ? "Salvar alterações" : "Adicionar gato"}
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
                  <button onClick={() => setGatoParaExcluir(gato)} className="text-xs font-bold text-red-600 border border-red-600 px-3 py-1 rounded hover:bg-red-600 hover:text-white transition-colors">
                    Excluir
                  </button>
                  <button 
                    onClick={() => toggleStatusGato(gato.id)} 
                    disabled={gato.status === "Adotado(a)"} // <-- NOVO: Bloqueia se estiver adotado
                    className={`text-xs font-bold px-3 py-1 rounded transition-colors ${
                      gato.status === "Adotado(a)" 
                        ? "bg-gray-200 text-gray-400 cursor-not-allowed border border-gray-300" 
                        : "text-coffee border border-coffee hover:bg-coffee hover:text-white cursor-pointer"
                    }`}
                  >
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
            <h3 className="font-bold text-xl mb-4 text-ink">Novo produto</h3>
            <form onSubmit={handleAddProduto} className="flex flex-col gap-3">
              <div>
                <label className="block text-xs font-semibold mb-1 text-ink-soft">Nome <span className="text-red-500">*</span></label>
                <input required placeholder="Nome do produto" value={formProduto.nome} onChange={e => setFormProduto({...formProduto, nome: e.target.value})} className="w-full border border-line rounded-lg p-2 text-sm" />
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

              <button type="submit" className="bg-coffee text-white rounded-lg py-2 font-bold hover:bg-coffee-dark">Adicionar produto</button>
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
                <button onClick={() => setProdutoParaExcluir(produto)} className="text-xs font-bold text-red-600 border border-red-600 px-3 py-1 rounded hover:bg-red-600 hover:text-white transition-colors">
                  Excluir
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CONTEÚDO: SOLICITAÇÕES */}
      {abaAtiva === "solicitacoes" && (
        <div className="flex flex-col gap-4">
          <h3 className="font-bold text-xl text-ink mb-2">Formulários Recebidos</h3>
          {formularios.length === 0 && (
            <p className="text-ink-soft text-sm">Nenhum formulário de adoção recebido ainda.</p>
          )}
          
          {formularios.map(form => (
            <div key={form.id} className="bg-white p-6 rounded-2xl border border-line shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h4 className="font-bold text-ink text-lg">Adoção de: {form.gatoNome}</h4>
                  <p className="text-xs text-ink-soft">Enviado em: {new Date(form.data).toLocaleString('pt-BR')}</p>
                </div>
                <span className={`text-xs font-bold px-3 py-1 rounded ${form.status === "Pendente" ? "bg-yellow-100 text-yellow-700" : form.status === "Aprovado" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                  {form.status}
                </span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mb-4">
                <div><b>Nome:</b> {form.dados.nome}</div>
                <div><b>E-mail:</b> {form.dados.email}</div>
                <div><b>Telefone:</b> {form.dados.telefone}</div>
                <div><b>CPF:</b> {form.dados.cpf}</div>
                <div><b>Idade:</b> {form.dados.idade} anos</div>
                <div><b>Cidade/Estado:</b> {form.dados.cidade} - {form.dados.estado}</div>
                <div className="md:col-span-2"><b>Endereço:</b> {form.dados.endereco} (CEP: {form.dados.cep})</div>
                <div className="md:col-span-2"><b>Por que adotar?</b> {form.dados.porqueAdotar}</div>
                {form.dados.temOutrosPets === "Sim" && (
                  <div className="md:col-span-2"><b>Experiência com pets:</b> {form.dados.experienciaPets}</div>
                )}
              </div>

              {form.status === "Pendente" && (
                <div className="flex gap-3 pt-4 border-t border-line">
                  <button 
                    onClick={() => atualizarStatusFormulario(form.id, "Aprovado", form.gatoId)}
                    className="flex-1 bg-green-600 text-white py-2 rounded-lg font-bold hover:bg-green-700 cursor-pointer"
                  >
                    Aprovar a adoção
                  </button>
                  <button 
                    onClick={() => atualizarStatusFormulario(form.id, "Recusado")}
                    className="flex-1 bg-red-600 text-white py-2 rounded-lg font-bold hover:bg-red-700 cursor-pointer"
                  >
                    Recusar a adoção
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* MODAL DE EXCLUSÃO DE GATO */}
      {gatoParaExcluir && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
          <div className="bg-white rounded-2xl p-6 shadow-2xl max-w-sm w-full text-center">
            <h3 className="font-display text-xl font-bold text-ink mb-2">Tem certeza que deseja excluir?</h3>
            <p className="text-sm text-ink-soft mb-6">
              Você está prestes a excluir o gatinho <b>{gatoParaExcluir.nome}</b>. Essa ação não pode ser desfeita.
            </p>
            
            <div className="flex gap-3 justify-center">
              <button 
                onClick={() => setGatoParaExcluir(null)}
                className="px-5 py-2.5 rounded-lg border border-line font-semibold text-ink-soft hover:bg-cream-2 transition-colors cursor-pointer w-full"
              >
                Cancelar
              </button>
              <button 
                onClick={confirmarExclusaoGato}
                className="px-5 py-2.5 rounded-lg bg-red-600 font-semibold text-white hover:bg-red-700 transition-colors cursor-pointer w-full"
              >
                Sim, excluir
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL DE EXCLUSÃO DE PRODUTO */}
      {produtoParaExcluir && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
          <div className="bg-white rounded-2xl p-6 shadow-2xl max-w-sm w-full text-center">
            <h3 className="font-display text-xl font-bold text-ink mb-2">Tem certeza que deseja excluir?</h3>
            <p className="text-sm text-ink-soft mb-6">
              Você está prestes a excluir o produto <b>{produtoParaExcluir.nome}</b>. Essa ação não pode ser desfeita.
            </p>
            
            <div className="flex gap-3 justify-center">
              <button 
                onClick={() => setProdutoParaExcluir(null)}
                className="px-5 py-2.5 rounded-lg border border-line font-semibold text-ink-soft hover:bg-cream-2 transition-colors cursor-pointer w-full"
              >
                Cancelar
              </button>
              <button 
                onClick={confirmarExclusaoProduto}
                className="px-5 py-2.5 rounded-lg bg-red-600 font-semibold text-white hover:bg-red-700 transition-colors cursor-pointer w-full"
              >
                Sim, excluir
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}