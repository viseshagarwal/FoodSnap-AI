interface IconProps {
  className?: string;
}

export default function InsightIcon({ className = "h-6 w-6" }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
      <path d="M6 8h4" />
      <path d="M14 8h4" />
      <path d="M6 12h4" />
      <path d="M14 12h4" />
      <path d="M6 16h4" />
      <path d="M14 16h4" />
    </svg>
  );
}
