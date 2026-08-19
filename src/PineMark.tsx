/** Narrow pine used as the letter i in Pinekraft. */
export function PineLetter({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 64"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path fill="#183f35" d="M12 1.2 20.8 16.2H3.2Z" />
      <path fill="#183f35" d="M12 11 22.6 28.4H1.4Z" />
      <path fill="#183f35" d="M12 22.2 23.8 42H.2Z" />
      <path fill="#a39168" d="M10.15 40.2h3.7V61.6c0 .9-.7 1.6-1.85 1.6s-1.85-.7-1.85-1.6z" />
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
