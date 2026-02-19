export function VehicleAnimation() {
  return (
    <svg viewBox="0 0 320 150" className="h-36 w-full animate-float drop-shadow-lg">
      <rect x="30" y="50" width="230" height="55" rx="14" fill="#3B82F6" />
      <rect x="60" y="60" width="95" height="25" rx="4" fill="#BFDBFE" />
      <rect x="170" y="60" width="65" height="25" rx="4" fill="#BFDBFE" />
      <circle cx="85" cy="112" r="16" fill="#1F2937" />
      <circle cx="215" cy="112" r="16" fill="#1F2937" />
      <path d="M260 66h24l10 20h-34z" fill="#8B5CF6" />
      <circle cx="280" cy="60" r="10" fill="#10B981" className="animate-pulse-slow" />
    </svg>
  );
}
