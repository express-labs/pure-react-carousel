# `dev` Folder (Interactive Demo & Compatibility SPA)

This directory contains the local development environment and the interactive demo SPA published to GitHub Pages. It is completely separate from the published library source in `src/` and is excluded from the npm package.

## Contents

- `index.html` / `app.tsx` — Main entry point for the interactive carousel demo application.
- `App/` — Demo showcase components and example slides importing directly from `../../src`.
- `compatibility.html` / `compatibility.tsx` / `compatibility-data.json` — React peer-dependency compatibility report page (React 16.8, 17, 18, and 19).

## Commands

- `npm start` (`vp dev`) — Starts the local Vite Plus development server rooted at `dev/`.
- `npm run build:demo` (`vp build`) — Builds the static multi-page demo app into `demo-dist/`.
- `npm run test:compat:demo` — Runs the multi-version React compatibility suite and refreshes `dev/compatibility-data.json`.
