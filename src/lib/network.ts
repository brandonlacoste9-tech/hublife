/** North Network — single source of truth for HubLife deep links */

export const NETWORK_BRAND = "North Network";
export const NETWORK_TAGLINE = "Live · Create · Decide · Plan · Play · Snap";

export type NetworkAppId =
  | "hublife"
  | "grok"
  | "wacke"
  | "zyeute"
  | "floguru"
  | "hellyeah"
  | "chatsnap";

export type NetworkIntent =
  | "home"
  | "watch"
  | "create"
  | "plan"
  | "play"
  | "ask"
  | "brief"
  | "snap";

export type NetworkApp = {
  id: NetworkAppId;
  name: string;
  job: string;
  /** Production URL; null = coming soon */
  url: string | null;
  emoji: string;
  intentDefault: NetworkIntent;
  accent: string;
};

export const APPS: NetworkApp[] = [
  {
    id: "wacke",
    name: "Wacké",
    job: "Live streaming & creator chaos",
    url: "https://wacke.live",
    emoji: "📺",
    intentDefault: "watch",
    accent: "#6b3d9a", // deep purple suede (promo)
  },
  {
    id: "zyeute",
    name: "Zyeuté",
    job: "Short video · Québec culture",
    url: "https://zyeute.com",
    emoji: "🎬",
    intentDefault: "create",
    accent: "#c9a227", // mustard gold (promo)
  },
  {
    id: "grok",
    name: "Grok Assistant",
    job: "Think, voice, calendar, weather",
    url: "https://grok-assistant.com",
    emoji: "✦",
    intentDefault: "ask",
    accent: "#8a6744", // cognac leather (promo)
  },
  {
    id: "floguru",
    name: "FloGuru",
    job: "Daily lifestyle & deeper planning",
    url: "https://floguru.com",
    emoji: "🧭",
    intentDefault: "plan",
    accent: "#6d7a3e", // olive suede (promo)
  },
  {
    id: "hellyeah",
    name: "Hell Yeah",
    job: "Quick play · 5-minute reset",
    url: "https://www.hellyeah-games.com",
    emoji: "🎮",
    intentDefault: "play",
    accent: "#c9a0a8", // dusty rose (promo)
  },
  {
    id: "chatsnap",
    name: "ChatSnap",
    job: "Snaps, stories & chat with your crew",
    url: "https://chatsnap-app.netlify.app",
    emoji: "👻",
    intentDefault: "snap",
    accent: "#6ec6e0", // sky cyan (promo)
  },
];

export function buildNetworkUrl(
  app: NetworkApp,
  opts?: {
    via?: NetworkAppId;
    intent?: NetworkIntent;
    campaign?: string;
  }
): string | null {
  if (!app.url) return null;
  const via = opts?.via ?? "hublife";
  const intent = opts?.intent ?? app.intentDefault;
  const campaign = opts?.campaign ?? "hublife_v1";
  const u = new URL(app.url);
  u.searchParams.set("from", "network");
  u.searchParams.set("via", via);
  u.searchParams.set("intent", intent);
  u.searchParams.set("utm_source", "north_network");
  u.searchParams.set("utm_medium", "cross_app");
  u.searchParams.set("utm_campaign", campaign);
  return u.toString();
}

export function openApp(
  app: NetworkApp,
  opts?: { via?: NetworkAppId; intent?: NetworkIntent }
) {
  const href = buildNetworkUrl(app, opts);
  if (!href) return false;
  try {
    localStorage.setItem("hublife_last_app", app.id);
  } catch {
    /* ignore */
  }
  window.open(href, "_blank", "noopener,noreferrer");
  return true;
}

/** Simple local intent routing from free text */
export function routeIntent(text: string): {
  appId: NetworkAppId;
  intent: NetworkIntent;
  label: string;
} | null {
  const t = text.trim().toLowerCase();
  if (!t) return null;

  if (
    /\b(brief|briefing|good morning|plan my day|weather|calendar|email|task)\b/.test(
      t
    ) ||
    /\b(decide|think|assistant|grok)\b/.test(t)
  ) {
    return {
      appId: "grok",
      intent: /\bbrief|morning\b/.test(t) ? "brief" : "ask",
      label: "Grok Assistant",
    };
  }
  if (/\b(live|stream|watch|wacke|kick|twitch)\b/.test(t)) {
    return { appId: "wacke", intent: "watch", label: "Wacké" };
  }
  if (/\b(clip|zyeute|tiktok|short video|create video)\b/.test(t)) {
    return { appId: "zyeute", intent: "create", label: "Zyeuté" };
  }
  if (/\b(bored|game|play|hell yeah)\b/.test(t)) {
    return { appId: "hellyeah", intent: "play", label: "Hell Yeah Games" };
  }
  if (/\b(floguru|lifestyle|routine|habit)\b/.test(t)) {
    return { appId: "floguru", intent: "plan", label: "FloGuru" };
  }
  if (/\b(snap|chatsnap|ghost|story|stories|friends only)\b/.test(t)) {
    return { appId: "chatsnap", intent: "snap", label: "ChatSnap" };
  }
  return null;
}

export function getApp(id: NetworkAppId): NetworkApp | undefined {
  return APPS.find((a) => a.id === id);
}
