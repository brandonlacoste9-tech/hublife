import { useEffect, useState, type FormEvent } from "react";
import {
  APPS,
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

type Props = {
  onSwitchVersion?: () => void;
};

export default function App({ onSwitchVersion }: Props) {
  const [query, setQuery] = useState("");
  const [hint, setHint] = useState<string | null>(null);
  const [lastAppId, setLastAppId] = useState<NetworkAppId | null>(null);

  useEffect(() => {
    try {
      const id = localStorage.getItem("hublife_last_app") as NetworkAppId | null;
      if (id && getApp(id)) setLastAppId(id);
    } catch {
      /* ignore */
    }
  }, []);

  const launch = (app: NetworkApp, intent?: NetworkIntent) => {
    if (!app.url) {
      setHint(`${app.name} coming soon.`);
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
      campaign: "hublife_brief",
    });
    if (url) window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="shell">
      {/* Full-bleed suede stage — same as the promo still */}
      <div className="suede-world">
        <div className="leather-board">
          {/* Brand strip */}
          <header className="leather-header">
            <div className="logo" aria-hidden title="HubLife">
              <AppIcon id="hublife" size={26} />
            </div>
            <h1>HubLife</h1>
          </header>

          {/* Six solid suede cards — 3×2 like the picture */}
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
                  title={app.job}
                >
                  <span className="tile-icon" aria-hidden>
                    <AppIcon id={app.id} size={32} />
                  </span>
                  <span className="tile-name">{app.name}</span>
                </button>
              );
            })}
          </section>
        </div>

        {/* Utility strip under the board — keeps power features without breaking the look */}
        <div className="utility">
          <button type="button" className="cta-brief" onClick={openBriefing}>
            Morning briefing
          </button>
          <form className="intent-form" onSubmit={onSubmit}>
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
            <button type="submit" className="go-btn">
              Go
            </button>
          </form>
          {hint ? <p className="hint">{hint}</p> : null}
          {onSwitchVersion ? (
            <button
              type="button"
              className="version-switch"
              onClick={onSwitchVersion}
            >
              Alt skin
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
