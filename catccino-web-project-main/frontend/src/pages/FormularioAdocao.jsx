import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { GATOS } from "../data/gatos.js"; 

export default function FormularioAdocao() {
  const { id } = useParams(); 
  const [gato, setGato] = useState(null);
  
  useEffect(() => {
    window.scrollTo(0, 0);
    
    // Busca o gato no localStorage (gatos criados pelo admin) primeiro
    const salvos = JSON.parse(localStorage.getItem("catccino_gatos") || "[]");
    const gatoEncontrado = salvos.find(g => g.id === Number(id)) || GATOS.find(g => g.id === Number(id));
    setGato(gatoEncontrado);
  }, [id]);

  const [form, setForm] = useState({
    nome: "", email: "", telefone: "", cpf: "", idade: "",
    endereco: "", cidade: "", estado: "", cep: "",
    temOutrosPets: "", experienciaPets: "", porqueAdotar: "",
    concordaTermos: false
  });
  
  const [enviado, setEnviado] = useState(false);
  const [mensagemErro, setMensagemErro] = useState("");

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  }

  function handleMask(e) {
    const { name, value } = e.target;
    let formatado = value;

    if (name === "telefone") {
      formatado = value.replace(/\D/g, "").slice(0, 11);
      formatado = formatado.replace(/^(\d{2})(\d)/g, "($1) $2");
      formatado = formatado.replace(/(\d)(\d{4})$/, "$1-$2");
    } 
    else if (name === "cpf") {
      formatado = value.replace(/\D/g, "").slice(0, 11);
      formatado = formatado.replace(/(\d{3})(\d)/, "$1.$2");
      formatado = formatado.replace(/(\d{3})(\d)/, "$1.$2");
      formatado = formatado.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    } 
    else if (name === "cep") {
      formatado = value.replace(/\D/g, "").slice(0, 8);
      formatado = formatado.replace(/^(\d{5})(\d)/, "$1-$2");
    }

    setForm(prev => ({ ...prev, [name]: formatado }));
  }

  function handleSubmit(e) {
    e.preventDefault();

    const idadeNumerica = parseInt(form.idade, 10);
    if (idadeNumerica < 18) {
      setMensagemErro("Você precisa ter 18 anos ou mais para adotar um gatinho.");
      setTimeout(() => setMensagemErro(""), 4000);
      return; 
    }

    // 1. Salva os dados do formulário no localStorage
    const formulariosSalvos = JSON.parse(localStorage.getItem("catccino_formularios") || "[]");
    const novoFormulario = {
      id: Date.now(),
      gatoId: gato.id,
      gatoNome: gato.nome,
      data: new Date().toISOString(),
      dados: form,
      status: "Pendente"
    };
    localStorage.setItem("catccino_formularios", JSON.stringify([...formulariosSalvos, novoFormulario]));

    // 2. Salva o ID do gato como "solicitado"
    const solicitados = JSON.parse(localStorage.getItem("catccino_adocoes_solicitadas") || "[]");
    if (!solicitados.includes(gato.id)) {
      localStorage.setItem("catccino_adocoes_solicitadas", JSON.stringify([...solicitados, gato.id]));
    }

    setTimeout(() => {
      setEnviado(true);
    }, 1000);
  }

  if (!gato) {
    return (
      <div className="text-center py-20 text-lg font-bold text-ink">
        Gatinho não encontrado. <Link to="/adocao" className="text-coffee underline">Voltar</Link>
      </div>
    );
  }

  if (enviado) {
    return (
      <div className="mx-auto max-w-lg px-5 py-20 text-center">
        <h1 className="font-display text-3xl font-bold text-ink mb-4">Formulário enviado com sucesso!</h1>
        <p className="text-ink-soft mb-8 text-lg">
          Após o envio, a ONG parceira analisará sua solicitação e entrará em contato em até 48h.
        </p>
        <Link to="/adocao" className="bg-coffee text-white px-6 py-3 rounded-lg font-bold hover:bg-coffee-dark transition-colors inline-block">
          Voltar para a lista de gatinhos
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-5 py-10">
      <Link to="/adocao" className="text-sm font-bold text-coffee hover:underline mb-6 inline-block">
        ← Voltar para a lista
      </Link>
      
      <div className="bg-white p-8 rounded-3xl shadow-lg border border-line">
        
        <div className="flex items-center gap-6 mb-8 bg-cream-2 p-4 rounded-2xl">
          <img 
            src={gato.img} 
            alt={gato.nome} 
            className="w-24 h-24 rounded-xl object-cover shadow-sm"
            style={{ objectPosition: gato.posicao }}
          />
          <div>
            <h1 className="font-display text-3xl font-bold text-ink">{gato.nome}</h1>
            <p className="text-sm text-ink-soft">{gato.idade} • {gato.sexo} • {gato.cor}</p>
          </div>
        </div>

        <h2 className="font-display text-2xl font-bold text-ink mb-6">Formulário de adoção</h2>
        
        {mensagemErro && (
          <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 rounded-lg bg-red-600 px-6 py-3 text-white shadow-lg font-semibold animate-bounce">
            {mensagemErro}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          
          <fieldset className="border border-line p-6 rounded-2xl">
            <legend className="text-lg font-bold text-coffee px-2">1. Dados pessoais</legend>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
              <div>
                <label className="block text-sm font-semibold mb-1">Nome completo <span className="text-red-500">*</span></label>
                <input required name="nome" value={form.nome} onChange={handleChange} className="w-full border border-line rounded-lg p-3 bg-cream/50" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">E-mail <span className="text-red-500">*</span></label>
                <input required type="email" name="email" placeholder="seuemail@exemplo.com" value={form.email} onChange={handleChange} className="w-full border border-line rounded-lg p-3 bg-cream/50" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Telefone <span className="text-red-500">*</span></label>
                <input required type="text" name="telefone" placeholder="(00) 00000-0000" value={form.telefone} onChange={handleMask} className="w-full border border-line rounded-lg p-3 bg-cream/50" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">CPF <span className="text-red-500">*</span></label>
                <input required type="text" name="cpf" placeholder="000.000.000-00" value={form.cpf} onChange={handleMask} className="w-full border border-line rounded-lg p-3 bg-cream/50" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Idade <span className="text-red-500">*</span></label>
                <select required name="idade" value={form.idade} onChange={handleChange} className="w-full border border-line rounded-lg p-3 bg-cream/50 cursor-pointer">
                  <option value="" disabled>Selecione sua idade</option>
                  {Array.from({ length: 83 }, (_, i) => i + 18).map((idade) => (
                    <option key={idade} value={idade}>{idade} anos</option>
                  ))}
                </select>
                <span className="text-xs text-red-500 mt-1 block font-medium">Atenção: só poderá adotar quem tiver 18 anos ou mais.</span>
              </div>
            </div>
          </fieldset>

          <fieldset className="border border-line p-6 rounded-2xl">
            <legend className="text-lg font-bold text-coffee px-2">2. Endereço</legend>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold mb-1">Endereço completo <span className="text-red-500">*</span></label>
                <input required name="endereco" value={form.endereco} onChange={handleChange} className="w-full border border-line rounded-lg p-3 bg-cream/50" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Cidade <span className="text-red-500">*</span></label>
                <input required name="cidade" value={form.cidade} onChange={handleChange} className="w-full border border-line rounded-lg p-3 bg-cream/50" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Estado <span className="text-red-500">*</span></label>
                <input required name="estado" value={form.estado} onChange={handleChange} className="w-full border border-line rounded-lg p-3 bg-cream/50" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">CEP <span className="text-red-500">*</span></label>
                <input required type="text" name="cep" placeholder="00000-000" value={form.cep} onChange={handleMask} className="w-full border border-line rounded-lg p-3 bg-cream/50" />
              </div>
            </div>
          </fieldset>

          <fieldset className="border border-line p-6 rounded-2xl">
            <legend className="text-lg font-bold text-coffee px-2">3. Experiência com pets</legend>
            <div className="flex flex-col gap-4 mt-2">
              <div>
                <label className="block text-sm font-semibold mb-2">Possui outro(s) pet(s)? <span className="text-red-500">*</span></label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2">
                    <input type="radio" name="temOutrosPets" value="Sim" onChange={handleChange} required className="cursor-pointer" />
                    <span className="cursor-pointer">Sim</span>
                  </label>
                   <label className="flex items-center gap-2">
                    <input type="radio" name="temOutrosPets" value="Não" onChange={handleChange} required className="cursor-pointer" />
                    <span className="cursor-pointer">Não</span>
                  </label>
                </div>
              </div>

              {form.temOutrosPets === "Sim" && (
                <div>
                  <label className="block text-sm font-semibold mb-1">Qual a sua experiência com outro(s) pet(s)? <span className="text-red-500">*</span></label>
                  <textarea required rows={3} name="experienciaPets" value={form.experienciaPets} onChange={handleChange} className="w-full border border-line rounded-lg p-3 bg-cream/50 resize-none" />
                </div>
              )}

              <div>
                <label className="block text-sm font-semibold mb-1">Por que deseja adotar {gato.nome}? <span className="text-red-500">*</span></label>
                <textarea required rows={3} name="porqueAdotar" value={form.porqueAdotar} onChange={handleChange} className="w-full border border-line rounded-lg p-3 bg-cream/50 resize-none" />
              </div>
            </div>
          </fieldset>

          <fieldset className="border border-line p-6 rounded-2xl bg-cream-2/30">
            <legend className="text-lg font-bold text-coffee px-2">4. Termo de Compromisso</legend>
            <label className="flex items-start gap-3 cursor-pointer p-2 mt-2">
              <input type="checkbox" name="concordaTermos" checked={form.concordaTermos} onChange={handleChange} required className="mt-1 w-5 h-5 accent-coffee cursor-pointer" />
              <span className="text-sm text-ink">
                Concordo com os termos de adoção responsável e me comprometo a cuidar bem do pet. <span className="text-red-500">*</span>
              </span>
            </label>
          </fieldset>

          <div className="flex flex-col items-center mt-4">
            <button type="submit" className="w-full bg-coffee text-white py-4 rounded-lg text-lg font-bold hover:bg-coffee-dark transition-transform hover:-translate-y-1 hover:shadow-warm cursor-pointer">
              Enviar formulário de adoção
            </button>
            <p className="text-sm text-ink-soft mt-4 text-center">
              Após o envio, a ONG parceira analisará sua solicitação e entrará em contato em até 48h.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}