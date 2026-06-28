import Image from "next/image";
import {
  siStripe,
  siMeta,
  siShopify,
} from "simple-icons";

interface IntegrationLogoProps {
  id: string;
  className?: string;
}

type BrandIcon = {
  title: string;
  hex: string;
  path: string;
};

const siLinkedin: BrandIcon = {
  title: "LinkedIn",
  hex: "0A66C2",
  path: "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z",
};

const SVG_ICONS: Record<string, BrandIcon> = {
  stripe: siStripe,
  "meta-ads": siMeta,
  "linkedin-ads": siLinkedin,
  shopify: siShopify,
};

const PNG_LOGOS: Record<string, { src: string; alt: string }> = {
  "google-ads": { src: "/logos/google-ads.png", alt: "Google Ads" },
  "google-analytics": { src: "/logos/google-analytics.png", alt: "Google Analytics" },
};

export function IntegrationLogo({ id, className = "w-6 h-6" }: IntegrationLogoProps) {
  const png = PNG_LOGOS[id];
  if (png) {
    return (
      <Image
        src={png.src}
        alt={png.alt}
        width={48}
        height={48}
        className={`${className} object-contain`}
      />
    );
  }

  const icon = SVG_ICONS[id];
  if (!icon) return null;

  return (
    <svg
      role="img"
      viewBox="0 0 24 24"
      className={className}
      aria-label={icon.title}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path fill={`#${icon.hex}`} d={icon.path} />
    </svg>
  );
}
