import { useMemo, useState, type FormEvent } from "react";
import {
  APPS,
  NETWORK_BRAND,
  NETWORK_TAGLINE,
  buildNetworkUrl,
  getApp,
  openApp,
  routeIntent,
  type NetworkApp,
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

export default function App() {
  const [query, setQuery] = useState("");
  const [hint, setHint] = useState<string | null>(null);

  const readyCount = useMemo(
    () => APPS.filter((a) => a.url).length,
    []
  );

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const hit = routeIntent(query);
    if (!hit) {
      setHint("Try: briefing, live stream, bored, plan my day…");
      return;
    }
    const app = getApp(hit.appId);
    if (!app) return;
    if (!app.url) {
      setHint(`${app.name} isn’t linked yet — tile says Soon.`);
      return;
    }
    setHint(`Opening ${hit.label}…`);
    openApp(app, { intent: hit.intent });
  };

  const go = (app: NetworkApp) => {
    if (!app.url) {
      setHint(`${app.name} URL coming soon.`);
      return;
    }
    setHint(null);
    openApp(app);
  };

  const openBriefing = () => {
    const grok = getApp("grok");
    if (!grok?.url) return;
    const url = buildNetworkUrl(grok, { intent: "brief", campaign: "hublife_brief" });
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
        <p className="ready-pill">{readyCount}/{APPS.length} live</p>
      </header>

      <main>
        <section className="hero">
          <h2>
            {timeGreeting()}.
            <br />
            What do you need?
          </h2>
          <p className="lede">
            One home for your apps — jump to live, create, decide, plan, or
            play.
          </p>

          <button type="button" className="cta-brief" onClick={openBriefing}>
            ✦ Morning briefing
            <span>Opens Grok Assistant</span>
          </button>

          <form className="intent-form" onSubmit={onSubmit}>
            <input
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setHint(null);
              }}
              placeholder="I’m bored · what’s live · plan my day…"
              aria-label="What do you need"
            />
            <button type="submit" className="go-btn">
              Go
            </button>
          </form>
          {hint ? <p className="hint">{hint}</p> : null}
        </section>

        <section className="grid" aria-label="North Network apps">
          {APPS.map((app) => {
            const live = Boolean(app.url);
            return (
              <button
                key={app.id}
                type="button"
                className={`tile ${live ? "live" : "soon"}`}
                style={{ ["--tile-accent" as string]: app.accent }}
                onClick={() => go(app)}
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
      </main>

      <footer className="foot">
        <p>
          Part of <strong>{NETWORK_BRAND}</strong>
        </p>
        <p className="fine">
          Deep links use <code>from=network</code> · Hub for Grok, Wacké,
          Zyeuté, FloGuru &amp; Hell Yeah Games
        </p>
      </footer>
    </div>
  );
}
