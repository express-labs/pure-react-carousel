import { execSync } from "node:child_process";
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { join } from "node:path";
import { ALL_REACT_VERSIONS, TYPES_REACT_VERSIONS } from "./versions.mjs";

export function areCompatEnvsInstalled(cacheDir) {
  for (const { version } of ALL_REACT_VERSIONS) {
    const pkgPath = join(cacheDir, "envs", `v-${version}`, "package.json");
    if (!existsSync(pkgPath)) {
      return false;
    }
    try {
      const envRequire = createRequire(pkgPath);
      const reactPkg = envRequire("react/package.json");
      const reactDomPkg = envRequire("react-dom/package.json");
      if (reactPkg.version !== version || reactDomPkg.version !== version) {
        return false;
      }
    } catch {
      return false;
    }
  }

  for (const t of TYPES_REACT_VERSIONS) {
    const pkgPath = join(cacheDir, "envs", t.id, "package.json");
    if (!existsSync(pkgPath)) {
      return false;
    }
    try {
      const envRequire = createRequire(pkgPath);
      const typesPkg = envRequire("@types/react/package.json");
      if (typesPkg.version !== t.typesReact) {
        return false;
      }
    } catch {
      return false;
    }
  }

  return true;
}

export function ensureCompatEnvs({ cacheDir, reinstall = false }) {
  if (!reinstall && areCompatEnvsInstalled(cacheDir)) {
    return;
  }

  mkdirSync(join(cacheDir, "envs"), { recursive: true });

  for (const { version } of ALL_REACT_VERSIONS) {
    const dir = join(cacheDir, "envs", `v-${version}`);
    mkdirSync(dir, { recursive: true });
    writeFileSync(
      join(dir, "package.json"),
      JSON.stringify(
        {
          name: `v-${version}`,
          version: "1.0.0",
          private: true,
          dependencies: {
            react: version,
            "react-dom": version,
          },
        },
        null,
        2,
      ),
    );
  }

  for (const t of TYPES_REACT_VERSIONS) {
    const dir = join(cacheDir, "envs", t.id);
    mkdirSync(dir, { recursive: true });
    writeFileSync(
      join(dir, "package.json"),
      JSON.stringify(
        {
          name: t.id,
          version: "1.0.0",
          private: true,
          dependencies: {
            "@types/react": t.typesReact,
          },
        },
        null,
        2,
      ),
    );
  }

  writeFileSync(
    join(cacheDir, "package.json"),
    JSON.stringify(
      {
        name: "react-compat-harness",
        private: true,
        workspaces: ["envs/*"],
      },
      null,
      2,
    ),
  );

  console.log(
    `Installing ${ALL_REACT_VERSIONS.length} React runtime environments and ${TYPES_REACT_VERSIONS.length} @types/react environments in ${cacheDir}...`,
  );
  execSync("npm install --no-audit --no-fund --legacy-peer-deps", {
    cwd: cacheDir,
    stdio: "inherit",
  });
}
