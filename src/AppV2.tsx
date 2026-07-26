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
import "./AppV2.css";

function timeGreeting(): string {
  const h = new Date().getHours();
  if (h < 5) return "Night owl mode";
  if (h < 12) return "Morning";
  if (h < 17) return "Afternoon";
  if (h < 21) return "Evening";
  return "Late night";
}

function formatClock(d: Date): string {
  return d.toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
  });
}

type Shortcut = {
  label: string;
  appId: NetworkAppId;
  intent: NetworkIntent;
};

const SHORTCUTS: Shortcut[] = [
  { label: "Brief", appId: "grok", intent: "brief" },
  { label: "Live", appId: "wacke", intent: "watch" },
  { label: "Snap", appId: "chatsnap", intent: "snap" },
  { label: "Play", appId: "hellyeah", intent: "play" },
  { label: "Plan", appId: "floguru", intent: "plan" },
  { label: "Create", appId: "zyeute", intent: "create" },
];

type Props = {
  onSwitchVersion: () => void;
};

export default function AppV2({ onSwitchVersion }: Props) {
  const [query, setQuery] = useState("");
  const [hint, setHint] = useState<string | null>(null);
  const [now, setNow] = useState(() => new Date());
  const [lastAppId, setLastAppId] = useState<NetworkAppId | null>(null);
  const [focusId, setFocusId] = useState<NetworkAppId | null>(null);

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
  }, []);

  const readyCount = useMemo(() => APPS.filter((a) => a.url).length, []);
  const lastApp = lastAppId ? getApp(lastAppId) : undefined;
  const focusApp = focusId ? getApp(focusId) : lastApp ?? APPS.find((a) => a.url);

  const launch = (app: NetworkApp, intent?: NetworkIntent) => {
    if (!app.url) {
      setHint(`${app.name} isn’t live yet.`);
      return;
    }
    setHint(null);
    setLastAppId(app.id);
    setFocusId(app.id);
    openApp(app, intent ? { intent } : undefined);
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const hit = routeIntent(query);
    if (!hit) {
      setHint("Try: briefing · live · snap · bored · plan · shorts");
      return;
    }
    const app = getApp(hit.appId);
    if (!app?.url) {
      setHint(`${hit.label} isn’t linked yet.`);
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
      campaign: "hublife_v2_brief",
    });
    if (url) window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="v2-root">
      <div className="v2-aurora" aria-hidden />
      <div className="v2-noise" aria-hidden />

      <header className="v2-top">
        <div className="v2-brand">
          <div className="v2-mark">
            <AppIcon id="hublife" size={20} />
          </div>
          <div>
            <div className="v2-name">
              HubLife <span className="v2-badge">v2 preview</span>
            </div>
            <div className="v2-tag">
              {NETWORK_BRAND} · {NETWORK_TAGLINE}
            </div>
          </div>
        </div>
        <div className="v2-top-right">
          <div className="v2-clock">{formatClock(now)}</div>
          <button type="button" className="v2-switch" onClick={onSwitchVersion}>
            ← See classic (v1)
          </button>
        </div>
      </header>

      <section className="v2-hero">
        <p className="v2-kicker">{timeGreeting()}</p>
        <h1>
          One home.
          <br />
          <span className="v2-grad">Six apps.</span>
        </h1>
        <p className="v2-lede">
          Same constellation, grown-up iconography — line marks instead of
          cartoon emoji. Local preview only.
        </p>

        <div className="v2-cta-row">
          <button type="button" className="v2-cta-main" onClick={openBriefing}>
            Morning briefing
          </button>
          {lastApp?.url ? (
            <button
              type="button"
              className="v2-cta-ghost"
              onClick={() => launch(lastApp)}
            >
              <AppIcon id={lastApp.id} size={15} />
              <span>Resume {lastApp.name}</span>
            </button>
          ) : null}
        </div>

        <form className="v2-search" onSubmit={onSubmit}>
          <span className="v2-search-ico" aria-hidden>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
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
            placeholder="What do you need?"
            aria-label="What do you need"
            autoComplete="off"
          />
          <button type="submit">Go</button>
        </form>
        {hint ? <p className="v2-hint">{hint}</p> : null}

        <div className="v2-pills">
          {SHORTCUTS.map((s) => {
            const app = getApp(s.appId);
            const live = Boolean(app?.url);
            return (
              <button
                key={s.label}
                type="button"
                className="v2-pill"
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

      {focusApp ? (
        <section
          className="v2-spotlight"
          style={{ ["--spot" as string]: focusApp.accent }}
        >
          <div className="v2-spot-icon" aria-hidden>
            <AppIcon id={focusApp.id} size={24} />
          </div>
          <div className="v2-spot-copy">
            <h2>{focusApp.name}</h2>
            <p>{focusApp.job}</p>
          </div>
          <button
            type="button"
            className="v2-spot-open"
            disabled={!focusApp.url}
            onClick={() => launch(focusApp)}
          >
            {focusApp.url ? "Open →" : "Soon"}
          </button>
        </section>
      ) : null}

      <section className="v2-bento" aria-label="North Network apps">
        {APPS.map((app, i) => {
          const live = Boolean(app.url);
          const wide = i === 0 || i === 3;
          return (
            <button
              key={app.id}
              type="button"
              className={`v2-card ${wide ? "wide" : ""} ${live ? "live" : "soon"} ${
                focusId === app.id || lastAppId === app.id ? "hot" : ""
              }`}
              style={{ ["--card" as string]: app.accent }}
              disabled={!live}
              onClick={() => launch(app)}
              onMouseEnter={() => live && setFocusId(app.id)}
            >
              <span className="v2-card-icon" aria-hidden>
                <AppIcon id={app.id} size={22} />
              </span>
              <span className="v2-card-name">{app.name}</span>
              <span className="v2-card-job">{app.job}</span>
              <span className="v2-card-status">{live ? "Launch" : "Soon"}</span>
            </button>
          );
        })}
      </section>

      <nav className="v2-dock" aria-label="App dock">
        {APPS.filter((a) => a.url).map((app) => (
          <button
            key={app.id}
            type="button"
            className="v2-dock-item"
            style={{ ["--dock" as string]: app.accent }}
            title={app.name}
            onClick={() => launch(app)}
          >
            <AppIcon id={app.id} size={20} />
          </button>
        ))}
      </nav>

      <footer className="v2-foot">
        <span>
          {readyCount}/{APPS.length} live · preview skin · not production
        </span>
        <button type="button" className="v2-linkish" onClick={onSwitchVersion}>
          Switch to classic HubLife
        </button>
      </footer>
    </div>
  );
}
