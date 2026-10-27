export default function PawIcon({ filled = false, className = "w-5 h-5" }) {
  const color = filled ? "#C97B3D" : "#C9BBA0";
  return (
    <svg viewBox="0 0 24 24" fill={color} className={className}>
      <ellipse cx="12" cy="16" rx="6" ry="5" />
      <ellipse cx="4.5" cy="8" rx="2.3" ry="3" />
      <ellipse cx="10" cy="4.5" rx="2.3" ry="3" />
      <ellipse cx="14.5" cy="4.5" rx="2.3" ry="3" />
      <ellipse cx="18.5" cy="8" rx="2.3" ry="3" />
    </svg>
  );
}
