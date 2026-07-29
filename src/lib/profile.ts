/**
 * Thin North Network profile — local first, keyed by Clerk userId when signed in.
 * Not a full identity system; enough to personalize the hub and hand off context.
 */

import type { NetworkAppId, NetworkIntent } from "./network";

export type NetworkProfile = {
  version: 1;
  /** Clerk user id or "guest" */
  userId: string;
  displayName: string | null;
  preferredAppId: NetworkAppId | null;
  lastIntent: NetworkIntent | null;
  lastApps: NetworkAppId[];
  updatedAt: number;
};

const STORAGE_KEY = "north_network_profile_v1";

export function emptyProfile(userId = "guest"): NetworkProfile {
  return {
    version: 1,
    userId,
    displayName: null,
    preferredAppId: null,
    lastIntent: null,
    lastApps: [],
    updatedAt: Date.now(),
  };
}

export function readProfile(): NetworkProfile {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyProfile();
    const parsed = JSON.parse(raw) as NetworkProfile;
    if (parsed?.version !== 1) return emptyProfile();
    return parsed;
  } catch {
    return emptyProfile();
  }
}

export function writeProfile(patch: Partial<NetworkProfile>): NetworkProfile {
  const prev = readProfile();
  const next: NetworkProfile = {
    ...prev,
    ...patch,
    version: 1,
    updatedAt: Date.now(),
  };
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    /* ignore */
  }
  return next;
}

export function recordAppOpen(
  appId: NetworkAppId,
  intent?: NetworkIntent | null,
): NetworkProfile {
  const prev = readProfile();
  const lastApps = [appId, ...prev.lastApps.filter((id) => id !== appId)].slice(
    0,
    6,
  );
  return writeProfile({
    preferredAppId: appId,
    lastIntent: intent ?? prev.lastIntent,
    lastApps,
  });
}

export function bindClerkUser(
  userId: string,
  displayName?: string | null,
): NetworkProfile {
  const prev = readProfile();
  // Guest data can migrate onto the first signed-in account on this device
  if (prev.userId === "guest" || prev.userId === userId) {
    return writeProfile({
      userId,
      displayName: displayName ?? prev.displayName,
    });
  }
  return writeProfile({
    userId,
    displayName: displayName ?? null,
    preferredAppId: null,
    lastIntent: null,
    lastApps: [],
  });
}

/** Public JSON shape for future Intent API / spoke handoff */
export function profileToHandoff(p: NetworkProfile = readProfile()) {
  return {
    network: "north_network",
    profile: {
      userId: p.userId === "guest" ? null : p.userId,
      displayName: p.displayName,
      preferredAppId: p.preferredAppId,
      lastIntent: p.lastIntent,
      lastApps: p.lastApps,
      updatedAt: p.updatedAt,
    },
  };
}
