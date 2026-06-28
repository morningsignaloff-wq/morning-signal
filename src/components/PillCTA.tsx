import Link from "next/link";

interface PillCTAProps {
  href: string;
  children: React.ReactNode;
  variant?: "solid" | "ghost";
}

export function PillCTA({ href, children, variant = "solid" }: PillCTAProps) {
  return (
    <Link href={href} className={`pill-cta ${variant === "ghost" ? "pill-cta--ghost" : ""}`}>
      <span>{children}</span>
      {variant === "solid" && (
        <span className="pill-cta__arrow" aria-hidden>
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M7 17 17 7M8 7h9v9" />
          </svg>
        </span>
      )}
    </Link>
  );
}
