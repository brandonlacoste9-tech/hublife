import { useEffect, useState } from "react";
import App from "./App";
import AppV2 from "./AppV2";

type Version = "v1" | "v2";

function readInitialVersion(): Version {
  try {
    const q = new URLSearchParams(window.location.search).get("v");
    if (q === "2" || q === "v2") return "v2";
    if (q === "1" || q === "v1") return "v1";
    const saved = localStorage.getItem("hublife_ui_version");
    if (saved === "v2" || saved === "v1") return saved;
  } catch {
    /* ignore */
  }
  return "v1";
}

export default function Root() {
  const [version, setVersion] = useState<Version>(() => readInitialVersion());

  useEffect(() => {
    try {
      localStorage.setItem("hublife_ui_version", version);
      const url = new URL(window.location.href);
      if (version === "v2") url.searchParams.set("v", "2");
      else url.searchParams.delete("v");
      window.history.replaceState({}, "", url.pathname + url.search + url.hash);
    } catch {
      /* ignore */
    }
  }, [version]);

  if (version === "v2") {
    return <AppV2 onSwitchVersion={() => setVersion("v1")} />;
  }

  return <App onSwitchVersion={() => setVersion("v2")} />;
}
