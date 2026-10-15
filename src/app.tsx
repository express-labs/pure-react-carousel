// This is a development app for local dev work on react-carousel
import React from "react";
import { createRoot } from "react-dom/client";
import DevelopmentApp from "./App/App";

const container = document.getElementById("app");
if (container) {
  const root = createRoot(container);
  root.render(
    <React.StrictMode>
      <DevelopmentApp />
    </React.StrictMode>,
  );
}
