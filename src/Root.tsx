import { useEffect, useState } from "react";
import App from "./App";
import AppV2 from "./AppV2";

type Version = "v1" | "v2";

/**
 * Classic cognac HubLife is the product.
 * Alt skin (v2) is hidden from the main UI — only ?v=2 for experiments.
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

  // No alt-skin button on the product home
  return <App />;
}
