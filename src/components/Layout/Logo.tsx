export function Logo({ size = 30 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true">
      <circle cx="32" cy="32" r="28" fill="#fff" stroke="currentColor" strokeWidth="5" />
      <path d="M4 32a28 28 0 0 1 56 0z" fill="#e3350d" stroke="currentColor" strokeWidth="5" />
      <circle cx="32" cy="32" r="9" fill="#fff" stroke="currentColor" strokeWidth="5" />
    </svg>
  )
}
