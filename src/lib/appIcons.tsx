import type { NetworkAppId } from "./network";

/** Adult / product-grade stroke icons — no emoji. */
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
    strokeWidth: 1.6,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    className,
    "aria-hidden": true as const,
  };

  switch (id) {
    case "wacke":
      // broadcast / live
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="2.2" fill="currentColor" stroke="none" />
          <path d="M7.2 7.2a6.8 6.8 0 0 0 0 9.6" />
          <path d="M16.8 7.2a6.8 6.8 0 0 1 0 9.6" />
          <path d="M4.5 4.5a10.5 10.5 0 0 0 0 15" />
          <path d="M19.5 4.5a10.5 10.5 0 0 1 0 15" />
        </svg>
      );
    case "zyeute":
      // film / short clip
      return (
        <svg {...common}>
          <rect x="3.5" y="5" width="17" height="14" rx="2.2" />
          <path d="M8 5v14M16 5v14M3.5 9.5h17M3.5 14.5h17" />
        </svg>
      );
    case "grok":
      // diamond / mind mark
      return (
        <svg {...common}>
          <path d="M12 3.5 19.5 12 12 20.5 4.5 12 12 3.5z" />
          <path d="M12 8v8M8.5 12h7" />
        </svg>
      );
    case "floguru":
      // compass / plan
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="8.5" />
          <path d="m14.8 9.2-1.4 4.6-4.6 1.4 1.4-4.6 4.6-1.4z" />
        </svg>
      );
    case "hellyeah":
      // controller simplified
      return (
        <svg {...common}>
          <path d="M7 15.5c-2.2 0-3.5-1.5-3.5-3.4C3.5 9.2 5.6 7 8.2 7h7.6c2.6 0 4.7 2.2 4.7 5.1 0 1.9-1.3 3.4-3.5 3.4-.8 0-1.5-.2-2.2-.6L12 17l-2.8-2.1c-.7.4-1.4.6-2.2.6z" />
          <path d="M9 11v2.5M7.75 12.25h2.5" />
          <circle cx="15.2" cy="11.2" r="0.7" fill="currentColor" stroke="none" />
          <circle cx="16.8" cy="12.8" r="0.7" fill="currentColor" stroke="none" />
        </svg>
      );
    case "chatsnap":
      // lens / capture
      return (
        <svg {...common}>
          <path d="M4 9.2A2.2 2.2 0 0 1 6.2 7h2L9.5 5h5L16 7h1.8A2.2 2.2 0 0 1 20 9.2v7.6a2.2 2.2 0 0 1-2.2 2.2H6.2A2.2 2.2 0 0 1 4 16.8V9.2z" />
          <circle cx="12" cy="13" r="3.2" />
        </svg>
      );
    case "hublife":
    default:
      return (
        <svg {...common}>
          <path d="M4.5 10.5 12 4.5l7.5 6V19a1.5 1.5 0 0 1-1.5 1.5h-4.2v-5.2h-5.6v5.2H6A1.5 1.5 0 0 1 4.5 19v-8.5z" />
        </svg>
      );
  }
}
