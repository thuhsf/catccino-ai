import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { GATOS as GATOS_INICIAIS } from "../data/gatos.js";

export default function Adocao() {
  const [gatos, setGatos] = useState([]);

  useEffect(() => {
    const salvos = localStorage.getItem("catccino_gatos");
    if (salvos) {
      setGatos(JSON.parse(salvos));
    } else {
      setGatos(GATOS_INICIAIS);
      localStorage.setItem("catccino_gatos", JSON.stringify(GATOS_INICIAIS));
    }
  }, []);

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
        {gatos.map((gato) => (
          <div key={gato.id} className="overflow-hidden rounded-2xl bg-white shadow-md border border-line flex flex-col">
            
            <div className="h-48 w-full bg-cream-2 overflow-hidden">
              {gato.img ? (
                <img 
                  src={gato.img} 
                  alt={`Foto do ${gato.nome}`} 
                  className="h-full w-full object-cover"
                  style={{ objectPosition: gato.posicao || "center" }}
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-4xl">🐈</div>
              )}
            </div>
            
            <div className="p-6 flex flex-col flex-1">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-display text-2xl font-bold text-ink">{gato.nome}</h3>
                <span className={`rounded-full px-3 py-1 text-xs font-bold ${gato.status === "Disponível" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                  {gato.status}
                </span>
              </div>
              
              <div className="flex gap-2 text-xs text-ink-soft mb-3 font-semibold">
                <span className="bg-cream px-2 py-1 rounded">{gato.idade}</span>
                <span className="bg-cream px-2 py-1 rounded">{gato.sexo}</span>
                <span className="bg-cream px-2 py-1 rounded">{gato.cor}</span>
              </div>

              <p className="text-sm text-ink-soft mb-6 flex-1">{gato.desc}</p>
              
              <Link
                to={`/adocao/${gato.id}`}
                className="block w-full rounded-lg bg-coffee py-2.5 text-center text-sm font-bold text-white transition-transform hover:-translate-y-0.5 hover:shadow-warm cursor-pointer"
              >
                Quero Adotar
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}