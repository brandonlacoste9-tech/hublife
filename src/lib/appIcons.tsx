import type { NetworkAppId } from "./network";

/** Promo-still icons — line marks on coloured suede patches. */
export function AppIcon({
  id,
  size = 22,
  className,
}: {
  id: NetworkAppId | string;
  size?: number;
  className?: string;
}) {
  const s = size;
  const common = {
    width: s,
    height: s,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.65,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    className,
    "aria-hidden": true as const,
  };

  switch (id) {
    case "wacke":
      // Radio tower / live broadcast (promo still)
      return (
        <svg {...common}>
          <path d="M12 3v11" />
          <path d="M9 21h6" />
          <path d="M10.5 14 9 21" />
          <path d="M13.5 14 15 21" />
          <circle cx="12" cy="5.5" r="1.6" fill="currentColor" stroke="none" />
          <path d="M7.2 7.2a6.8 6.8 0 0 0 0 9.6" />
          <path d="M16.8 7.2a6.8 6.8 0 0 1 0 9.6" />
          <path d="M5 5a10 10 0 0 0 0 14" />
          <path d="M19 5a10 10 0 0 1 0 14" />
        </svg>
      );
    case "zyeute":
      // Film strip
      return (
        <svg {...common}>
          <rect x="4" y="5" width="16" height="14" rx="2" />
          <path d="M8 5v14M16 5v14" />
          <path d="M4 9h4M16 9h4M4 13h4M16 13h4M4 17h4M16 17h4" />
        </svg>
      );
    case "grok":
      // Diamond
      return (
        <svg {...common}>
          <path d="M12 3.5 19.5 12 12 20.5 4.5 12 12 3.5z" />
        </svg>
      );
    case "floguru":
      // Compass rose
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="8.5" />
          <path d="m14.9 9.1-1.5 4.7-4.7 1.5 1.5-4.7 4.7-1.5z" />
          <path d="M12 5.2v1.6M12 17.2v1.6M5.2 12h1.6M17.2 12h1.6" />
        </svg>
      );
    case "hellyeah":
      // Gamepad
      return (
        <svg {...common}>
          <path d="M7 16c-2.4 0-3.8-1.6-3.8-3.6C3.2 9.4 5.4 7.2 8.1 7.2h7.8c2.7 0 4.9 2.2 4.9 5.2 0 2-1.4 3.6-3.8 3.6-.8 0-1.5-.2-2.2-.6L12 17.2l-2.8-2.2c-.7.4-1.4.6-2.2.6z" />
          <path d="M9 11v2.6M7.7 12.3h2.6" />
          <circle cx="15.2" cy="11.1" r="0.75" fill="currentColor" stroke="none" />
          <circle cx="16.9" cy="12.8" r="0.75" fill="currentColor" stroke="none" />
        </svg>
      );
    case "chatsnap":
      // Camera aperture
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="8.2" />
          <circle cx="12" cy="12" r="3.4" />
          <path d="M12 3.8v2.4M12 17.8v2.4M3.8 12h2.4M17.8 12h2.4" />
          <path d="m6.2 6.2 1.7 1.7M16.1 16.1l1.7 1.7M6.2 17.8l1.7-1.7M16.1 7.9l1.7-1.7" />
        </svg>
      );
    case "hublife":
    default:
      // Yellow-tile ghost mark (promo still / Snap-style)
      return (
        <svg
          width={s}
          height={s}
          viewBox="0 0 24 24"
          className={className}
          aria-hidden
        >
          <path
            fill="currentColor"
            stroke="none"
            d="M12 3.2c-3.6 0-6.2 2.6-6.2 6.1 0 1.3.3 2.3.7 3.2-.5.5-1.3 1-1.9 1.1-.2 0-.3.2-.3.4 0 .4.5.7 1.2.9.6.2 1 .6 1.1 1.1.2 1.1 1.1 1.9 2.4 2.3.4.6 1.1 1.1 2 1.4.3.5.8.8 1.5.8h.1c.7 0 1.2-.3 1.5-.8.9-.3 1.6-.8 2-1.4 1.3-.4 2.2-1.2 2.4-2.3.1-.5.5-.9 1.1-1.1.7-.2 1.2-.5 1.2-.9 0-.2-.1-.4-.3-.4-.6-.1-1.4-.6-1.9-1.1.4-.9.7-1.9.7-3.2 0-3.5-2.6-6.1-6.2-6.1z"
          />
        </svg>
      );
  }
}
