import { Link } from "react-router-dom";

export default function Menu() {
  return (
    <div className="mx-auto max-w-5xl px-5 py-10 flex flex-col gap-16">
      
      {/* 1. HERO SECTION (Apresentação Principal) */}
      <section className="relative flex flex-col items-center justify-center overflow-hidden rounded-[30px] bg-coffee-dark px-6 py-20 text-center text-cream">
        <div className="relative z-10 flex flex-col items-center max-w-2xl">
          
          <h1 
            className="font-display text-4xl md:text-5xl font-bold leading-tight mb-4"
            style={{ color: "#e6ccb2" }}
          >
            Bem-vindos ao Catccino!
          </h1>
          
          <p className="text-lg text-white mb-8">
            Um espaço acolhedor onde você pode saborear bebidas artesanais e comidas deliciosas, enquanto conhece gatinhos que esperam por um lar.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link 
              to="/cardapio" 
              className="rounded-full border-2 border-cream px-8 py-3 text-base font-bold text-cream transition-all duration-300 hover:-translate-y-1 hover:bg-caramel hover:border-caramel hover:text-white hover:shadow-warm"
            >
              Ver o nosso cardápio
            </Link>
            <Link 
              to="/adocao" 
              className="rounded-full border-2 border-cream px-8 py-3 text-base font-bold text-cream transition-all duration-300 hover:-translate-y-1 hover:bg-caramel hover:border-caramel hover:text-white hover:shadow-warm"
            >
              Conhecer os nossos gatinhos
            </Link>
          </div>
        </div>
      </section>

      {/* 2. SEÇÃO SOBRE A CAFETERIA */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        <div className="order-2 md:order-1">
          <h2 className="font-display text-3xl font-bold text-ink mb-4">Muito mais que um café.</h2>
          <p className="text-ink-soft mb-4 leading-relaxed">
            O Catccino nasceu do amor por cafés especiais e pela causa animal. Nossa cafeteria é um refúgio para os amantes de gatos, onde cada detalhe foi pensado para proporcionar bem-estar, tanto para os clientes quanto para os nossos felinos residentes.
          </p>
          <p className="text-ink-soft mb-6 leading-relaxed">
            Venha trabalhar, ler um livro ou simplesmente relaxar. Temos opções de bebidas quentes, geladas e comidinhas artesanais feitas com muito carinho.
          </p>
          <Link 
            to="/cardapio" 
            className="text-coffee font-bold hover:underline flex items-center gap-2"
          >
            Explorar o menu →
          </Link>
        </div>
        <div className="order-1 md:order-2 h-72 rounded-2xl overflow-hidden bg-cream-2 shadow-lg">
           <img 
             src="/cafeteria-home.jpg"
             alt="Interior da Cafeteria Catccino" 
             className="w-full h-full object-cover"
             style={{ objectPosition: "center 30%" }}
           />
        </div>
      </section>

      {/* 3. SEÇÃO DE ADOÇÃO */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center bg-cream-2 rounded-[30px] p-8 md:p-12">
        <div className="h-72 rounded-2xl overflow-hidden shadow-lg">
           <img 
             src="/cafeteria-home-2.jpg"
             alt="Gatinho esperando adoção" 
             className="w-full h-full object-cover"
             style={{ objectPosition: "center 20%" }}
           />
        </div>
        <div>
          <h2 className="font-display text-3xl font-bold text-ink mb-4">Adote um 'miau'migo.</h2>
          <p className="text-ink-soft mb-4 leading-relaxed">
            Todos os gatinhos que você vê por aqui são resgatados em parceria com ONG's locais. Eles estão castrados, vacinados e prontos para receber muito amor.
          </p>
          <p className="text-ink-soft mb-6 leading-relaxed">
            Adotar transforma duas vidas: a do gato que ganha um lar e a sua que ganha um companheiro fiel para a vida toda.
          </p>
          <Link 
            to="/adocao" 
            className="text-coffee font-bold hover:underline flex items-center gap-2"
          >
            Ver gatos disponíveis →
          </Link>
        </div>
      </section>

      {/* 4. DEPOIMENTOS */}
      <section className="text-center">
        <h2 className="font-display text-3xl font-bold text-ink mb-10">O que dizem sobre nós?</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          
          {/* Depoimento 1 */}
          <div className="bg-white p-6 rounded-2xl border border-line shadow-sm relative flex flex-col justify-between">
            <div>
              <span className="text-4xl text-cream-2 absolute top-4 left-4 font-serif">"</span>
              <p className="text-ink-soft italic mb-4 relative z-10 pt-4">
                O melhor lugar para trabalhar e relaxar. O café é maravilhoso e os gatinhos são super dóceis. Já virei cliente fiel!
              </p>
            </div>
            <div className="flex items-start gap-3 mt-6">
              <div className="w-10 h-10 rounded-full bg-caramel text-white flex items-center justify-center font-bold shrink-0">M</div>
              <div className="flex flex-col gap-0.5">
                <p className="font-bold text-ink text-sm">Maria Silva</p>
                <p className="text-xs text-ink-soft">Cliente desde 2025</p>
              </div>
            </div>
          </div>

          {/* Depoimento 2 */}
          <div className="bg-white p-6 rounded-2xl border border-line shadow-sm relative flex flex-col justify-between">
            <div>
              <span className="text-4xl text-cream-2 absolute top-4 left-4 font-serif">"</span>
              <p className="text-ink-soft italic mb-4 relative z-10 pt-4">
                Adotei meu melhor amigo aqui! A equipe é super atenciosa e o processo de adoção foi muito tranquilo.
              </p>
            </div>
            <div className="flex items-start gap-3 mt-6">
              <div className="w-10 h-10 rounded-full bg-coffee text-white flex items-center justify-center font-bold shrink-0">R</div>
              <div className="flex flex-col gap-0.5">
                <p className="font-bold text-ink text-sm">Rodrigo Lira</p>
                <p className="text-xs text-ink-soft">Adotou o Rick</p>
              </div>
            </div>
          </div>

          {/* Depoimento 3 */}
          <div className="bg-white p-6 rounded-2xl border border-line shadow-sm relative flex flex-col justify-between">
            <div>
              <span className="text-4xl text-cream-2 absolute top-4 left-4 font-serif">"</span>
              <p className="text-ink-soft italic mb-4 relative z-10 pt-4">
                A combinação perfeita de um café artesanal com a companhia de felinos resgatados. Um lugar que aquece o coração.
              </p>
            </div>
            <div className="flex items-start gap-3 mt-6">
              <div className="w-10 h-10 rounded-full bg-coffee-dark text-white flex items-center justify-center font-bold shrink-0">L</div>
              <div className="flex flex-col gap-0.5">
                <p className="font-bold text-ink text-sm">Lucas Henrique</p>
                <p className="text-xs text-ink-soft">Cliente mais recente</p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 5. GALERIA DE FOTOS */}
      <section className="pb-10">
        <div className="text-center mb-8">
          <h2 className="font-display text-2xl font-bold text-ink mb-2">Momentos no Catccino</h2>
          <p className="text-sm text-ink-soft">
            Siga a gente no Instagram:{" "}
            <a href="https://www.instagram.com/ifpepaulista/" target="_blank"
            rel="noopener noreferrer"
            className="font-bold text-coffee hover:underline" > @catccino
            </a>
          </p>
        </div>
        
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="aspect-square rounded-xl overflow-hidden bg-cream-2 shadow-sm hover:opacity-90 transition-opacity">
            <img src="/gatinho1-home.jpg" alt="Gatinho 1" className="w-full h-full object-cover" />
          </div>
          
          <div className="aspect-square rounded-xl overflow-hidden bg-cream-2 shadow-sm hover:opacity-90 transition-opacity">
             <img src="/gatinho2-home.jpg" alt="Gatinho 2" className="w-full h-full object-cover" />
          </div>
          
          <div className="aspect-square rounded-xl overflow-hidden bg-cream-2 shadow-sm hover:opacity-90 transition-opacity">
             <img src="/cake-home.jpg" alt="Bolo" className="w-full h-full object-cover" />
          </div>
          
          <div className="aspect-square rounded-xl overflow-hidden bg-cream-2 shadow-sm hover:opacity-90 transition-opacity">
             <img src="/coffee-home.jpg" alt="Café" className="w-full h-full object-cover" />
          </div>
        </div>
      </section>

    </div>
  );
}