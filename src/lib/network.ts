/** North Network — single source of truth for HubLife deep links */

import { recordAppOpen } from "./profile";

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
    accent: "#a855f7",
  },
  {
    id: "zyeute",
    name: "Zyeuté",
    job: "Short video · Québec culture",
    url: "https://zyeute.com",
    emoji: "🎬",
    intentDefault: "create",
    accent: "#c9a227",
  },
  {
    id: "grok",
    name: "Grok Assistant",
    job: "Think, voice, calendar, weather",
    url: "https://grok-assistant.com",
    emoji: "✦",
    intentDefault: "ask",
    accent: "#c4783a",
  },
  {
    id: "floguru",
    name: "FloGuru",
    job: "Daily lifestyle & deeper planning",
    url: "https://floguru.com",
    emoji: "🧭",
    intentDefault: "plan",
    accent: "#8b6914",
  },
  {
    id: "hellyeah",
    name: "Hell Yeah Games",
    job: "Quick play · 5-minute reset",
    url: "https://www.hellyeah-games.com",
    emoji: "🎮",
    intentDefault: "play",
    accent: "#e11d48",
  },
  {
    id: "chatsnap",
    name: "ChatSnap",
    job: "Snaps, stories & chat with your crew",
    url: "https://chatsnap-app.netlify.app",
    emoji: "👻",
    intentDefault: "snap",
    accent: "#22d3ee",
  },
];

const LAST_APP_KEY = "hublife_last_app";
const LAST_INTENT_KEY = "hublife_last_intent";

export function buildNetworkUrl(
  app: NetworkApp,
  opts?: {
    via?: NetworkAppId;
    intent?: NetworkIntent;
    campaign?: string;
  },
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

export function rememberLaunch(appId: NetworkAppId, intent?: NetworkIntent) {
  try {
    localStorage.setItem(LAST_APP_KEY, appId);
    if (intent) localStorage.setItem(LAST_INTENT_KEY, intent);
  } catch {
    /* ignore */
  }
}

export function readLastLaunch(): {
  appId: NetworkAppId | null;
  intent: NetworkIntent | null;
} {
  try {
    const appId = localStorage.getItem(LAST_APP_KEY) as NetworkAppId | null;
    const intent = localStorage.getItem(
      LAST_INTENT_KEY,
    ) as NetworkIntent | null;
    return {
      appId: appId && getApp(appId) ? appId : null,
      intent: intent ?? null,
    };
  } catch {
    return { appId: null, intent: null };
  }
}

export function openApp(
  app: NetworkApp,
  opts?: {
    via?: NetworkAppId;
    intent?: NetworkIntent;
    campaign?: string;
  },
) {
  const intent = opts?.intent ?? app.intentDefault;
  const href = buildNetworkUrl(app, { ...opts, intent });
  if (!href) return false;
  rememberLaunch(app.id, intent);
  try {
    recordAppOpen(app.id, intent);
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
    /\b(brief|briefing|good morning|morning brief|weather|calendar|email|task|appointment|schedule)\b/.test(
      t,
    ) ||
    /\b(decide|think|assistant|grok)\b/.test(t)
  ) {
    return {
      appId: "grok",
      intent: /\b(brief|morning|weather|calendar)\b/.test(t) ? "brief" : "ask",
      label: "Grok Assistant",
    };
  }
  if (/\b(live|stream|watch|wacke|kick|twitch|going live)\b/.test(t)) {
    return { appId: "wacke", intent: "watch", label: "Wacké" };
  }
  if (
    /\b(clip|zyeute|tiktok|short video|shorts|create video|réel|reel)\b/.test(t)
  ) {
    return { appId: "zyeute", intent: "create", label: "Zyeuté" };
  }
  if (/\b(bored|game|play|hell yeah|arcade|reset)\b/.test(t)) {
    return { appId: "hellyeah", intent: "play", label: "Hell Yeah Games" };
  }
  if (
    /\b(floguru|lifestyle|routine|habit|plan my day|plan day|planner)\b/.test(
      t,
    )
  ) {
    return { appId: "floguru", intent: "plan", label: "FloGuru" };
  }
  if (
    /\b(snap|chatsnap|ghost|story|stories|friends only|crew|dm)\b/.test(t)
  ) {
    return { appId: "chatsnap", intent: "snap", label: "ChatSnap" };
  }
  return null;
}

export function getApp(id: NetworkAppId): NetworkApp | undefined {
  return APPS.find((a) => a.id === id);
}
