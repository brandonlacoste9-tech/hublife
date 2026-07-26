import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import Root from "./Root";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Root />
  </StrictMode>
);

// Don't register SW in dev — it caches and fights local previews
if (
  import.meta.env.PROD &&
  "serviceWorker" in navigator
) {
  window.addEventListener("load", () => {
    void navigator.serviceWorker.register("/sw.js").catch(() => {
      /* optional */
    });
  });
}
