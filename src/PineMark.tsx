/** Geometric pine — full mark, or a narrow letter-i for the wordmark. */
export function PineMark({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 36 44"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path className="pine-crown" d="M18 1.4 28.6 15.2H7.4Z" />
      <path className="pine-crown" d="M18 9.8 32 25.6H4Z" />
      <path className="pine-crown" d="M18 19.4 35.2 38.4H.8Z" />
      <path className="pine-trunk" d="M15.35 36.4h5.3V42.2c0 .55-.4 1-1 1h-3.3c-.6 0-1-.45-1-1z" />
    </svg>
  );
}

/** Pine drawn as the letter i — stem is the trunk, tittle is the crown. */
export function PineLetter({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 14 52"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path className="pine-crown" d="M7 .6 12.4 11.8H1.6Z" />
      <path className="pine-crown" d="M7 7.2 13.2 19.6H.8Z" />
      <path className="pine-crown" d="M7 14.4 13.7 28H.3Z" />
      <path className="pine-trunk" d="M5.9 26.8h2.2V50.5c0 .6-.4 1.1-1.1 1.1s-1.1-.5-1.1-1.1z" />
    </svg>
  );
}

export function PinekraftWord({ className }: { className?: string }) {
  return (
    <span className={className}>
      P
      <PineLetter className="pine-letter" />
      nekraft
    </span>
  );
}
