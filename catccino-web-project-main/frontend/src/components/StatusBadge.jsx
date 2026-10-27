const STYLES = {
  pending: "bg-cream-2 text-caramel",
  paid: "bg-sage-bg text-sage",
  approved: "bg-sage-bg text-sage",
  canceled: "bg-rust-bg text-rust",
  rejected: "bg-rust-bg text-rust",
  preparing: "bg-[#EFE0C9] text-[#9A6A22]",
  ready: "bg-sage-bg text-sage",
  delivered: "bg-[#E4E4E4] text-[#555555]",
};

export default function StatusBadge({ status }) {
  const cls = STYLES[status] || "bg-cream-2 text-ink-soft";
  return (
    <span className={`inline-block rounded-full px-2.5 py-1 text-xs font-bold capitalize ${cls}`}>
      {status}
    </span>
  );
}
