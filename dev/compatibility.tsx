import * as React from "react";
import { createRoot } from "react-dom/client";
import CompatibilityPage from "./App/Compatibility";
import "./App/style.scss";

const container = document.getElementById("app");
if (container) {
  const root = createRoot(container);
  root.render(
    <React.StrictMode>
      <CompatibilityPage />
    </React.StrictMode>,
  );
}
