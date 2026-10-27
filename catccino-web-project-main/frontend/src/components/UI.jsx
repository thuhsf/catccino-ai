export const money = (n) =>
  (Number(n) || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

export function Chip({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      style={{ borderWidth: "1.5px" }}
      className={`rounded-full border px-4 py-1.5 text-sm font-semibold transition-colors ${
        active
          ? "border-coffee bg-cream-2 text-coffee"
          : "border-line text-ink-soft hover:border-coffee hover:text-coffee"
      }`}
    >
      {children}
    </button>
  );
}

export function EmptyState({ children }) {
  return (
    <div
      style={{ borderWidth: "1.5px" }}
      className="rounded-2xl border border-dashed border-line bg-paper p-10 text-center text-ink-soft"
    >
      {children}
    </div>
  );
}
