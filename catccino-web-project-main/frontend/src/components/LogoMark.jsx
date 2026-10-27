export default function LogoMark({ className = "w-9 h-9" }) {
  return (
    <svg viewBox="0 0 40 40" fill="none" className={className}>
      <path
        d="M9 15 L13 6 L17 15"
        stroke="#43281A"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="#C97B3D"
      />
      <path
        d="M23 15 L27 6 L31 15"
        stroke="#43281A"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="#C97B3D"
      />
      <rect x="7" y="14" width="26" height="18" rx="6" fill="#6B4226" />
      <ellipse cx="20" cy="14.5" rx="13" ry="3.4" fill="#EFE2C9" />
      <path
        className="animate-steam"
        d="M17 5 Q15 2 17 0"
        stroke="#EFE2C9"
        strokeWidth="1.6"
        fill="none"
        strokeLinecap="round"
      />
      <path
        className="animate-steam animate-steam-delay"
        d="M23 5 Q25 2 23 0"
        stroke="#EFE2C9"
        strokeWidth="1.6"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  );
}
