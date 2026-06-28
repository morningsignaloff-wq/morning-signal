import Link from "next/link";
import { BRAND_NAME } from "@/lib/brand";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  variant?: "light" | "dark";
  showText?: boolean;
  showMark?: boolean;
}

const sizes = {
  sm: { height: 24, text: "text-sm", gap: "gap-2" },
  md: { height: 30, text: "text-base", gap: "gap-2.5" },
  lg: { height: 36, text: "text-lg sm:text-xl", gap: "gap-3" },
} as const;

export function Logo({ size = "md", variant = "light", showText = true, showMark = true }: LogoProps) {
  const { height, text, gap } = sizes[size];
  const isLight = variant === "light";
  const width = Math.round(height * 3.2);

  return (
    <Link href="/" className={`flex items-center ${gap} group shrink-0`}>
      {showMark && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src="/morning-signal-mark.png"
          alt={BRAND_NAME}
          width={width}
          height={height}
          className="shrink-0 object-contain object-left transition-transform group-hover:scale-[1.02]"
        />
      )}
      {showText && (
        <span className={`font-bold tracking-tight leading-none whitespace-nowrap ${text}`}>
          <span className={isLight ? "text-zinc-900" : "text-white"}>Morning </span>
          <span className="bg-gradient-to-r from-[#7c3aed] to-[#ec4899] bg-clip-text text-transparent">
            Signal
          </span>
        </span>
      )}
    </Link>
  );
}
