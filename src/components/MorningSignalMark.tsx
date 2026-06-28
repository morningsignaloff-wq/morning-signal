import Image from "next/image";

interface MorningSignalMarkProps {
  size?: number;
  className?: string;
}

export function MorningSignalMark({ size = 80, className = "" }: MorningSignalMarkProps) {
  const height = Math.round(size * 0.42);

  return (
    <Image
      src="/morning-signal-mark.png"
      alt=""
      width={size}
      height={height}
      className={`object-contain object-left ${className ?? ""}`}
      priority
      unoptimized
    />
  );
}
