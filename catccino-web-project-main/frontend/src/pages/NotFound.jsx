import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <section className="py-20 text-center">
      <h2 className="font-display text-3xl">Essa página fugiu do gato 🐾</h2>
      <p className="mt-2 text-ink-soft">Não encontramos o que você procurava.</p>
      <Link
        to="/"
        className="mt-6 inline-block rounded-full bg-coffee px-5 py-2.5 text-sm font-semibold text-paper"
      >
        Voltar ao cardápio
      </Link>
    </section>
  );
}
