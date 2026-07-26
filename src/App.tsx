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
import { AppIcon } from "./lib/appIcons";
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
};

const SHORTCUTS: Shortcut[] = [
  { label: "Brief me", appId: "grok", intent: "brief" },
  { label: "What's live", appId: "wacke", intent: "watch" },
  { label: "Snap crew", appId: "chatsnap", intent: "snap" },
  { label: "I'm bored", appId: "hellyeah", intent: "play" },
  { label: "Plan day", appId: "floguru", intent: "plan" },
  { label: "Shorts", appId: "zyeute", intent: "create" },
];

type Props = {
  onSwitchVersion?: () => void;
};

export default function App({ onSwitchVersion }: Props) {
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
          <p className="clock" aria-live="polite">
            <span className="clock-time">{formatClock(now)}</span>
            <span className="clock-date">{formatDate(now)}</span>
          </p>
          <p className="ready-pill">
            {readyCount}/{APPS.length} live
          </p>
          {onSwitchVersion ? (
            <button
              type="button"
              className="version-switch"
              onClick={onSwitchVersion}
              title="Optional blue glass preview — not the main hub"
            >
              Preview alt skin
            </button>
          ) : null}
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
            Morning briefing
            <span>Opens Grok Assistant with intent=brief</span>
          </button>

          {lastApp?.url ? (
            <button
              type="button"
              className="cta-resume"
              onClick={() => launch(lastApp)}
            >
              <AppIcon id={lastApp.id} size={15} />
              <span>Resume {lastApp.name}</span>
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
                  onClick={() => app && launch(app, s.intent)}
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
