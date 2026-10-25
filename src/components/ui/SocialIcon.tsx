import type { SocialNetwork } from "@/types/site";

/** Minimal brand glyphs (lucide-react no longer ships brand icons). */
export function SocialIcon({ network, className }: { network: SocialNetwork; className?: string }) {
  const common = {
    className,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.6,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };

  switch (network) {
    case "instagram":
      return (
        <svg {...common}>
          <rect x="3" y="3" width="18" height="18" rx="5" />
          <circle cx="12" cy="12" r="4" />
          <circle cx="17.3" cy="6.7" r="0.6" fill="currentColor" stroke="none" />
        </svg>
      );
    case "facebook":
      return (
        <svg {...common}>
          <path d="M14.5 21v-7.5h2.6l.4-3h-3V8.6c0-.9.3-1.5 1.6-1.5h1.6V4.4c-.3 0-1.2-.1-2.3-.1-2.3 0-3.9 1.4-3.9 4v2.2H9v3h2.5V21" />
        </svg>
      );
    case "x":
      return (
        <svg {...common}>
          <path d="M4.5 4h4.2l10.8 16h-4.2z" />
          <path d="M19.5 4l-6.2 7M10.7 13l-6.2 7" />
        </svg>
      );
    case "youtube":
      return (
        <svg {...common}>
          <rect x="2.5" y="5.5" width="19" height="13" rx="4" />
          <path d="M10.2 9.3v5.4l4.6-2.7z" fill="currentColor" />
        </svg>
      );
  }
}
