import { Logo } from "@/components/Logo";

interface FullLogoProps {
  className?: string;
}

export function FullLogo({ className = "" }: FullLogoProps) {
  return (
    <div className={`flex justify-center ${className}`}>
      <Logo size="lg" variant="light" />
    </div>
  );
}
