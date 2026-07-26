import { useEffect, useState } from "react";
import App from "./App";
import AppV2 from "./AppV2";

type Version = "v1" | "v2";

/**
 * Classic cognac HubLife is always the default.
 * Alt skin only when URL has ?v=2 (or you click "Alt skin").
 * We no longer sticky-restore v2 from localStorage — that kept people
 * stuck on the blue aurora preview.
 */
function readInitialVersion(): Version {
  try {
    const q = new URLSearchParams(window.location.search).get("v");
    if (q === "2" || q === "v2") return "v2";
  } catch {
    /* ignore */
  }
  return "v1";
}

export default function Root() {
  const [version, setVersion] = useState<Version>(() => readInitialVersion());

  useEffect(() => {
    try {
      // Clear any old sticky preference so refresh lands on cognac v1
      localStorage.removeItem("hublife_ui_version");
      const url = new URL(window.location.href);
      if (version === "v2") {
        url.searchParams.set("v", "2");
      } else {
        url.searchParams.delete("v");
      }
      window.history.replaceState({}, "", url.pathname + url.search + url.hash);
    } catch {
      /* ignore */
    }
  }, [version]);

  if (version === "v2") {
    return <AppV2 onSwitchVersion={() => setVersion("v1")} />;
  }

  // Classic cognac shell + line icons (v2 flavour, v1 layout)
  return <App onSwitchVersion={() => setVersion("v2")} />;
}
