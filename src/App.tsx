import { useEffect, useMemo, useState, type FormEvent } from "react";
import {
  APPS,
  NETWORK_BRAND,
  NETWORK_TAGLINE,
  buildNetworkUrl,
  getApp,
  openApp,
  routeIntent,
  type NetworkApp,
  type NetworkAppId,
  type NetworkIntent,
} from "./lib/network";
import "./App.css";

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
  emoji: string;
};

const SHORTCUTS: Shortcut[] = [
  { label: "Brief me", appId: "grok", intent: "brief", emoji: "✦" },
  { label: "What's live", appId: "wacke", intent: "watch", emoji: "📺" },
  { label: "Snap crew", appId: "chatsnap", intent: "snap", emoji: "👻" },
  { label: "I'm bored", appId: "hellyeah", intent: "play", emoji: "🎮" },
  { label: "Plan day", appId: "floguru", intent: "plan", emoji: "🧭" },
  { label: "Shorts", appId: "zyeute", intent: "create", emoji: "🎬" },
];

export default function App() {
  const [query, setQuery] = useState("");
  const [hint, setHint] = useState<string | null>(null);
  const [now, setNow] = useState(() => new Date());
  const [lastAppId, setLastAppId] = useState<NetworkAppId | null>(null);
  const [installHint, setInstallHint] = useState(false);

  useEffect(() => {
    const t = window.setInterval(() => setNow(new Date()), 30_000);
    return () => window.clearInterval(t);
  }, []);

  useEffect(() => {
    try {
      const id = localStorage.getItem("hublife_last_app") as NetworkAppId | null;
      if (id && getApp(id)) setLastAppId(id);
    } catch {
      /* ignore */
    }
    // PWA install tip when not standalone
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
  }, []);

  const readyCount = useMemo(() => APPS.filter((a) => a.url).length, []);
  const lastApp = lastAppId ? getApp(lastAppId) : undefined;

  const launch = (app: NetworkApp, intent?: NetworkIntent) => {
    if (!app.url) {
      setHint(`${app.name} URL coming soon.`);
      return;
    }
    setHint(null);
    setLastAppId(app.id);
    openApp(app, intent ? { intent } : undefined);
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const hit = routeIntent(query);
    if (!hit) {
      setHint("Try: briefing, live, snap, bored, plan my day, shorts…");
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
    openApp(app, { intent: hit.intent });
  };

  const openBriefing = () => {
    const grok = getApp("grok");
    if (!grok?.url) return;
    setLastAppId("grok");
    const url = buildNetworkUrl(grok, {
      intent: "brief",
      campaign: "hublife_brief",
    });
    if (url) window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="shell">
      <header className="top">
        <div className="brand-block">
          <span className="logo" aria-hidden>
            ⌂
          </span>
          <div>
            <h1>HubLife</h1>
            <p className="tag">
              {NETWORK_BRAND} · {NETWORK_TAGLINE}
            </p>
          </div>
        </div>
        <div className="top-meta">
          <p className="clock" aria-live="polite">
            <span className="clock-time">{formatClock(now)}</span>
            <span className="clock-date">{formatDate(now)}</span>
          </p>
          <p className="ready-pill">
            {readyCount}/{APPS.length} live
          </p>
        </div>
      </header>

      <main>
        <section className="hero">
          <h2>
            {timeGreeting()}.
            <br />
            What do you need?
          </h2>
          <p className="lede">
            One home for your constellation — live, create, decide, plan, play,
            snap.
          </p>

          <button type="button" className="cta-brief" onClick={openBriefing}>
            ✦ Morning briefing
            <span>Opens Grok Assistant with intent=brief</span>
          </button>

          {lastApp?.url ? (
            <button
              type="button"
              className="cta-resume"
              onClick={() => launch(lastApp)}
            >
              Resume {lastApp.emoji} {lastApp.name}
            </button>
          ) : null}

          <form className="intent-form" onSubmit={onSubmit}>
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
                  onClick={() => app && launch(app, s.intent)}
                >
                  <span aria-hidden>{s.emoji}</span> {s.label}
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
                <span className="tile-emoji" aria-hidden>
                  {app.emoji}
                </span>
                <span className="tile-name">{app.name}</span>
                <span className="tile-job">{app.job}</span>
                <span className="tile-status">{live ? "Open →" : "Soon"}</span>
              </button>
            );
          })}
        </section>

        {installHint ? (
          <p className="install-tip">
            Tip: on your phone, use <strong>Add to Home Screen</strong> so
            HubLife is one tap away.
          </p>
        ) : null}
      </main>

      <footer className="foot">
        <p>
          Part of <strong>{NETWORK_BRAND}</strong>
        </p>
        <p className="fine">
          Deep links use <code>from=network</code> · Hub for Grok, Wacké,
          Zyeuté, FloGuru, Hell Yeah Games &amp; ChatSnap
        </p>
      </footer>
    </div>
  );
}
