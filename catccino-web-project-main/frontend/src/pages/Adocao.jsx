import { Link } from "react-router-dom";

// Dados baseados no nosso arquivo gatos_adocao.md
const GATOS = [
  { 
    id: 1, 
    nome: "Mingau", 
    idade: "1 ano", 
    sexo: "Macho", 
    cor: "Laranja", 
    desc: "Muito brincalhão e energético. Adora subir nas prateleiras!",
    status: "Disponível",
    img: "/gato-mingau.jpg",
    posicao: "center 40%"
  },
  { 
    id: 2, 
    nome: "Luna", 
    idade: "2 anos", 
    sexo: "Fêmea", 
    cor: "Preta", 
    desc: "Calma e independente. Ideal para apartamentos.",
    status: "Disponível",
    img: "/gata-luna.jpg", // (coloque a foto da Luna na pasta public)
    posicao: "center 15%" // <-- Ajuste para a Luna (mostra mais a parte de baixo)
  },
  { 
    id: 3, 
    nome: "Fred", 
    idade: "3 anos", 
    sexo: "Macho", 
    cor: "Tigrado", 
    desc: "Tímido no começo, mas muito carinhoso.",
    status: "Disponível",
    img: "/gato-fred.jpg", // (coloque a foto do Fred na pasta public)
    posicao: "center 20%" // <-- Ajuste para o Fred
  },
  {
    id: 4, 
    nome: "Nina", // Nome do novo gatinho
    idade: "6 meses", 
    sexo: "Fêmea", 
    cor: "Branca", 
    desc: "Muito dócil e adora brincar com bolinhas de papel.",
    status: "Disponível",
    img: "/gato-nina.jpg", // Nome da foto na pasta public
    posicao: "center 50%"
  },
  {
    id: 5, 
    nome: " Kofu", 
    idade: "4 anos", 
    sexo: "Macho", 
    cor: "Laranja", 
    desc: "Um verdadeiro leãozinho, adora dormir no sol.",
    status: "Disponível",
    img: "/gato-simba.jpg",
    posicao: "center 50%"
  },
  {
    id: 6, 
    nome: "Frajola", 
    idade: "1 ano", 
    sexo: "Macho", 
    cor: "Branco e Preto", 
    desc: "Esperto, falante e muito carinhoso. Adora dormir no colo e brincar com ponteiros de laser",
    status: "Disponível",
    img: "/",
    posicao: "center 50%"
  }
];

export default function Adocao() {
  return (
    <div className="mx-auto max-w-5xl px-5 py-10">
      <div className="mb-10 text-center">
        <h1 className="font-display text-3xl font-bold text-ink mb-2">Adote um 'miau'migo</h1>
        <p className="text-ink-soft max-w-2xl mx-auto">
          Nossos gatinhos vêm de ONG's parceiras e estão esperando por um lar cheio de amor. 
          Conheça o perfil de cada um e descubra quem combina com você!
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3">
        {GATOS.map((gato) => (
          <div key={gato.id} className="overflow-hidden rounded-2xl bg-white shadow-md border border-line">

            {/* Foto do Gato */}
            <div className="h-48 w-full bg-cream-2 overflow-hidden">
              {gato.img ? (
                <img 
                  src={gato.img} 
                  alt={`Foto do ${gato.nome}`} 
                  className="h-full w-full object-cover"
                  style={{ objectPosition: gato.posicao || "center" }} // <-- Adicione esta linha
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-4xl">
                  🐈
                </div>
              )}
            </div>
            
            <div className="p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-display text-2xl font-bold text-ink">{gato.nome}</h3>
                <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-700">
                  {gato.status}
                </span>
              </div>
              
              <div className="flex gap-2 text-xs text-ink-soft mb-3 font-semibold">
                <span className="bg-cream px-2 py-1 rounded">{gato.idade}</span>
                <span className="bg-cream px-2 py-1 rounded">{gato.sexo}</span>
                <span className="bg-cream px-2 py-1 rounded">{gato.cor}</span>
              </div>

              <p className="text-sm text-ink-soft mb-6">{gato.desc}</p>
              
              <button className="w-full rounded-lg bg-coffee py-2.5 text-sm font-bold text-white transition-transform hover:-translate-y-0.5 hover:shadow-warm">
                Quero adotar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}