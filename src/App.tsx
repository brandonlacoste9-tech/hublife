import { useEffect, useMemo, useState, type FormEvent } from "react";
import {
  APPS,
  NETWORK_BRAND,
  NETWORK_TAGLINE,
  buildNetworkUrl,
  getApp,
  openApp,
  readLastLaunch,
  routeIntent,
  type NetworkApp,
  type NetworkAppId,
  type NetworkIntent,
} from "./lib/network";
import { AppIcon } from "./lib/appIcons";
import { AuthChip } from "./components/AuthChip";
import { ProfileSync } from "./components/ProfileSync";
import { readProfile } from "./lib/profile";
import "./App.css";

const CLERK_ON = Boolean(import.meta.env.VITE_CLERK_PUBLISHABLE_KEY);

function timeGreeting(): string {
  const h = new Date().getHours();
  if (h < 5) return "Still up?";
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  if (h < 21) return "Good evening";
  return "Hey";
}

function formatClock(d: Date): string {
  return d.toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
  });
}

function formatDate(d: Date): string {
  return d.toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

type Shortcut = {
  label: string;
  appId: NetworkAppId;
  intent: NetworkIntent;
  campaign: string;
};

const SHORTCUTS: Shortcut[] = [
  {
    label: "Brief me",
    appId: "grok",
    intent: "brief",
    campaign: "hublife_chip_brief",
  },
  {
    label: "What's live",
    appId: "wacke",
    intent: "watch",
    campaign: "hublife_chip_live",
  },
  {
    label: "Snap crew",
    appId: "chatsnap",
    intent: "snap",
    campaign: "hublife_chip_snap",
  },
  {
    label: "I'm bored",
    appId: "hellyeah",
    intent: "play",
    campaign: "hublife_chip_play",
  },
  {
    label: "Plan day",
    appId: "floguru",
    intent: "plan",
    campaign: "hublife_chip_plan",
  },
  {
    label: "Shorts",
    appId: "zyeute",
    intent: "create",
    campaign: "hublife_chip_shorts",
  },
];

export default function App() {
  const [query, setQuery] = useState("");
  const [hint, setHint] = useState<string | null>(null);
  const [now, setNow] = useState(() => new Date());
  const [lastAppId, setLastAppId] = useState<NetworkAppId | null>(null);
  const [lastIntent, setLastIntent] = useState<NetworkIntent | null>(null);
  const [installHint, setInstallHint] = useState(false);
  const [displayName, setDisplayName] = useState<string | null>(null);

  useEffect(() => {
    const t = window.setInterval(() => setNow(new Date()), 30_000);
    return () => window.clearInterval(t);
  }, []);

  useEffect(() => {
    const last = readLastLaunch();
    if (last.appId) setLastAppId(last.appId);
    if (last.intent) setLastIntent(last.intent);
    try {
      const p = readProfile();
      if (p.displayName) setDisplayName(p.displayName);
    } catch {
      /* ignore */
    }
    try {
      const standalone =
        window.matchMedia("(display-mode: standalone)").matches ||
        Boolean(
          (navigator as Navigator & { standalone?: boolean }).standalone,
        );
      setInstallHint(!standalone);
    } catch {
      /* ignore */
    }

    // PWA shortcuts: /?shortcut=brief|live|snap
    try {
      const sp = new URLSearchParams(window.location.search);
      const sc = sp.get("shortcut");
      if (!sc) return;
      const map: Record<string, { appId: NetworkAppId; intent: NetworkIntent; campaign: string }> =
        {
          brief: { appId: "grok", intent: "brief", campaign: "hublife_pwa_brief" },
          live: { appId: "wacke", intent: "watch", campaign: "hublife_pwa_live" },
          snap: {
            appId: "chatsnap",
            intent: "snap",
            campaign: "hublife_pwa_snap",
          },
        };
      const hit = map[sc];
      if (!hit) return;
      const app = getApp(hit.appId);
      if (!app?.url) return;
      openApp(app, { intent: hit.intent, campaign: hit.campaign });
      setLastAppId(hit.appId);
      setLastIntent(hit.intent);
      const url = new URL(window.location.href);
      url.searchParams.delete("shortcut");
      window.history.replaceState({}, "", url.pathname + url.search + url.hash);
    } catch {
      /* ignore */
    }
  }, []);

  const readyCount = useMemo(() => APPS.filter((a) => a.url).length, []);
  const lastApp = lastAppId ? getApp(lastAppId) : undefined;

  const launch = (
    app: NetworkApp,
    intent?: NetworkIntent,
    campaign?: string,
  ) => {
    if (!app.url) {
      setHint(`${app.name} URL coming soon.`);
      return;
    }
    const useIntent = intent ?? app.intentDefault;
    setHint(null);
    setLastAppId(app.id);
    setLastIntent(useIntent);
    openApp(app, {
      intent: useIntent,
      campaign: campaign ?? "hublife_tile",
    });
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const hit = routeIntent(query);
    if (!hit) {
      setHint("Try: briefing · live · snap · bored · plan · shorts");
      return;
    }
    const app = getApp(hit.appId);
    if (!app) return;
    if (!app.url) {
      setHint(`${app.name} isn’t linked yet — tile says Soon.`);
      return;
    }
    setHint(`Opening ${hit.label}…`);
    setLastAppId(app.id);
    setLastIntent(hit.intent);
    openApp(app, { intent: hit.intent, campaign: "hublife_search" });
  };

  const openBriefing = () => {
    const grok = getApp("grok");
    if (!grok?.url) return;
    setLastAppId("grok");
    setLastIntent("brief");
    const url = buildNetworkUrl(grok, {
      intent: "brief",
      campaign: "hublife_brief",
    });
    if (url) {
      try {
        localStorage.setItem("hublife_last_app", "grok");
        localStorage.setItem("hublife_last_intent", "brief");
      } catch {
        /* ignore */
      }
      window.open(url, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <div className="shell">
      {CLERK_ON ? <ProfileSync /> : null}
      <header className="top">
        <div className="brand-block">
          <span className="logo" aria-hidden>
            <AppIcon id="hublife" size={20} />
          </span>
          <div>
            <h1>HubLife</h1>
            <p className="tag">
              {NETWORK_BRAND} · {NETWORK_TAGLINE}
            </p>
          </div>
        </div>
        <div className="top-meta">
          {CLERK_ON ? <AuthChip /> : null}
          <p className="clock" aria-live="polite">
            <span className="clock-time">{formatClock(now)}</span>
            <span className="clock-date">{formatDate(now)}</span>
          </p>
          <p className="ready-pill" title="All North Network spokes linked">
            {readyCount}/{APPS.length} live
          </p>
        </div>
      </header>

      <main>
        <section className="hero">
          <h2>
            {timeGreeting()}
            {displayName ? `, ${displayName}` : ""}.
            <br />
            What do you need?
          </h2>
          <p className="lede">
            One home for your constellation — live, create, decide, plan, play,
            snap.
          </p>

          <button type="button" className="cta-brief" onClick={openBriefing}>
            Morning briefing
            <span>Grok · weather, calendar, what matters today</span>
          </button>

          {lastApp?.url ? (
            <button
              type="button"
              className="cta-resume"
              onClick={() =>
                launch(
                  lastApp,
                  lastIntent ?? lastApp.intentDefault,
                  "hublife_resume",
                )
              }
            >
              <AppIcon id={lastApp.id} size={15} />
              <span>
                Resume {lastApp.name}
                {lastIntent && lastIntent !== lastApp.intentDefault
                  ? ` · ${lastIntent}`
                  : ""}
              </span>
            </button>
          ) : null}

          <form className="intent-form" onSubmit={onSubmit}>
            <span className="intent-search-ico" aria-hidden>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
              >
                <circle cx="11" cy="11" r="6.5" />
                <path d="m16 16 4 4" strokeLinecap="round" />
              </svg>
            </span>
            <input
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setHint(null);
              }}
              placeholder="I’m bored · what’s live · snap · briefing…"
              aria-label="What do you need"
              autoComplete="off"
            />
            <button type="submit" className="go-btn">
              Go
            </button>
          </form>
          {hint ? <p className="hint">{hint}</p> : null}

          <div className="shortcuts" aria-label="Quick jumps">
            {SHORTCUTS.map((s) => {
              const app = getApp(s.appId);
              const live = Boolean(app?.url);
              return (
                <button
                  key={s.label}
                  type="button"
                  className={`chip ${live ? "" : "chip-soon"}`}
                  disabled={!live}
                  onClick={() => app && launch(app, s.intent, s.campaign)}
                >
                  <AppIcon id={s.appId} size={14} />
                  <span>{s.label}</span>
                </button>
              );
            })}
          </div>
        </section>

        <section className="grid" aria-label="North Network apps">
          {APPS.map((app) => {
            const live = Boolean(app.url);
            return (
              <button
                key={app.id}
                type="button"
                className={`tile ${live ? "live" : "soon"} ${
                  lastAppId === app.id ? "recent" : ""
                }`}
                style={{ ["--tile-accent" as string]: app.accent }}
                onClick={() => launch(app)}
                disabled={!live}
              >
                <span className="tile-icon" aria-hidden>
                  <AppIcon id={app.id} size={20} />
                </span>
                <span className="tile-name">{app.name}</span>
                <span className="tile-job">{app.job}</span>
                <span className="tile-status">{live ? "Open →" : "Soon"}</span>
              </button>
            );
          })}
        </section>

        <section className="spoke-strip" aria-label="Network status">
          {APPS.map((app) => (
            <span
              key={app.id}
              className={`spoke-dot ${app.url ? "ok" : "down"}`}
              title={app.url ? `${app.name} linked` : `${app.name} soon`}
            >
              <i style={{ background: app.accent }} />
              {app.name.split(" ")[0]}
            </span>
          ))}
        </section>

        {installHint ? (
          <p className="install-tip">
            Tip: on your phone, use <strong>Add to Home Screen</strong> so
            HubLife is one tap away. Shortcuts: Brief me · Live · Snap.
          </p>
        ) : null}
      </main>

      <footer className="foot">
        <p>
          Part of <strong>{NETWORK_BRAND}</strong>
        </p>
        <p className="fine">
          Deep links use <code>from=network</code> · Hub for Grok, Wacké,
          Zyeuté, FloGuru, Hell Yeah Games &amp; ChatSnap ·{" "}
          <a href="https://hublife.ca">hublife.ca</a>
        </p>
      </footer>
    </div>
  );
}
