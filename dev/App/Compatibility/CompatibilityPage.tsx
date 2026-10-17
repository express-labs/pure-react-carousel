import * as React from "react";
import pkg from "../../../package.json";
import rawCompatibilityData from "./compatibilityData.json";
import s from "./CompatibilityPage.scss";

export interface VersionCompatibilityEntry {
  version: string;
  trackId: string;
  trackName: string;
  ssr: string;
  clientRender: string;
  hydration: string;
  runtime: string;
  vitestStatus: string;
  vitestSummary: string;
  note: string;
}

export interface CompatibilityTrack {
  id: string;
  name: string;
  peerRange: string;
  versions: VersionCompatibilityEntry[];
}

export interface TypesCompatibilityEntry {
  id: string;
  trackId: string;
  label: string;
  typesReact: string;
  expectedStatus?: string;
  note: string;
  status: string;
  errorSummary: string | null;
}

export interface CompatibilityReportData {
  generatedAt: string;
  packageVersion: string;
  nodeVersion: string;
  peerDependencies: {
    react: string;
    "react-dom": string;
  };
  summary: {
    totalRuntimeVersions: number;
    passedRuntimeVersions: number;
    totalVitestVersions: number;
    passedVitestFullSuite: number;
    totalTypesTracks: number;
    passedTypesTracks: number;
  };
  tracks: CompatibilityTrack[];
  typesCompatibility: TypesCompatibilityEntry[];
}

export interface CompatibilityPageProps {
  onBack?: () => void;
  data?: CompatibilityReportData;
}

const getBadgeClassName = (status: string): string => {
  if (status === "PASS") {
    return s.badgePass;
  }
  if (status === "FAIL") {
    return s.badgeFail;
  }
  return s.badgeWarn;
};

const defaultCompatibilityData: CompatibilityReportData = {
  ...(rawCompatibilityData as CompatibilityReportData),
  packageVersion: pkg.version,
  peerDependencies: pkg.peerDependencies,
};

const CompatibilityPage = ({
  onBack,
  data = defaultCompatibilityData,
}: CompatibilityPageProps): React.ReactElement => {
  const [selectedTrack, setSelectedTrack] = React.useState<string>("all");
  const [searchQuery, setSearchQuery] = React.useState<string>("");

  const allVersions = React.useMemo<VersionCompatibilityEntry[]>(
    () => data.tracks.flatMap((track) => track.versions),
    [data.tracks],
  );

  const runtimePercentage =
    data.summary.totalRuntimeVersions > 0
      ? Math.round((data.summary.passedRuntimeVersions / data.summary.totalRuntimeVersions) * 100)
      : 0;

  const vitestBreakdown = React.useMemo(() => {
    let warn = 0;
    let ssrOnly = 0;
    let fail = 0;
    let skipped = 0;
    for (const entry of allVersions) {
      if (entry.vitestStatus === "WARN") warn += 1;
      else if (entry.vitestStatus === "SSR_ONLY") ssrOnly += 1;
      else if (entry.vitestStatus === "FAIL") fail += 1;
      else if (entry.vitestStatus === "SKIPPED") skipped += 1;
    }
    return { warn, ssrOnly, fail, skipped };
  }, [allVersions]);

  const filteredVersions = React.useMemo<VersionCompatibilityEntry[]>(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();
    return allVersions.filter((entry) => {
      const matchesTrack = selectedTrack === "all" || entry.trackId === selectedTrack;
      const matchesQuery =
        normalizedQuery.length === 0 ||
        entry.version.toLowerCase().includes(normalizedQuery) ||
        entry.trackName.toLowerCase().includes(normalizedQuery) ||
        entry.note.toLowerCase().includes(normalizedQuery);
      return matchesTrack && matchesQuery;
    });
  }, [allVersions, searchQuery, selectedTrack]);

  const handleBackClick = (ev: React.MouseEvent<HTMLAnchorElement>): void => {
    if (onBack) {
      ev.preventDefault();
      onBack();
    }
  };

  return (
    <div className={s.page}>
      <header className={s.hero}>
        <div className={s.heroInner}>
          <nav className={s.topNav} aria-label="Compatibility page navigation">
            <a href="./index.html" className={s.backLink} onClick={handleBackClick}>
              &larr; Back to Carousel Demo
            </a>
            <a
              href="https://github.com/express-labs/pure-react-carousel"
              className={s.repoLink}
              target="_blank"
              rel="noreferrer"
            >
              GitHub Repository &rarr;
            </a>
          </nav>
          <h1 className={s.heroTitle}>React Version Compatibility Matrix</h1>
          <p className={s.heroSubtitle}>
            Automated verification of Pure React Carousel&apos;s production bundles (ESM &amp; CJS),
            Server-Side Rendering, client hydration, interactive store state, Vitest unit suite, and
            TypeScript declarations across React 19, 18, 17, and 16.8+.
          </p>
          <div className={s.metaBar}>
            <span className={s.metaPill}>
              <span className={s.metaLabel}>Package:</span> v{data.packageVersion}
            </span>
            <span className={s.metaPill}>
              <span className={s.metaLabel}>Peer Dep:</span> {data.peerDependencies.react}
            </span>
            <span className={s.metaPill}>
              <span className={s.metaLabel}>Node:</span> {data.nodeVersion}
            </span>
            <span className={s.metaPill}>
              <span className={s.metaLabel}>Last Verified:</span> {data.generatedAt}
            </span>
          </div>
        </div>
      </header>

      <main className={s.mainContent}>
        <section className={s.summaryGrid} aria-label="Compatibility summary metrics">
          <div className={s.summaryCard}>
            <h2 className={s.summaryCardTitle}>Runtime, SSR &amp; Hydration</h2>
            <p className={s.summaryCardValue}>
              {data.summary.passedRuntimeVersions} / {data.summary.totalRuntimeVersions}
            </p>
            <p className={s.summaryCardDesc}>
              {data.summary.passedRuntimeVersions} of {data.summary.totalRuntimeVersions} tested
              React releases ({runtimePercentage}%) pass SSR, client mount, hydration, and
              interactive slide navigation checks. See the per-version statuses below for details.
            </p>
          </div>

          <div className={s.summaryCard}>
            <h2 className={s.summaryCardTitle}>Vitest Unit Test Suite</h2>
            <p className={s.summaryCardValue}>
              {data.summary.passedVitestFullSuite} / {data.summary.totalVitestVersions}
            </p>
            <p className={s.summaryCardDesc}>
              {data.summary.passedVitestFullSuite} of {data.summary.totalVitestVersions} versions
              pass the full repository Vitest suite ({vitestBreakdown.warn} with upstream React.act
              warnings, {vitestBreakdown.ssrOnly} SSR-only on legacy React 17/16
              {vitestBreakdown.fail > 0 ? `, ${vitestBreakdown.fail} failed` : ""}
              {vitestBreakdown.skipped > 0 ? `, ${vitestBreakdown.skipped} skipped` : ""}). Refer to
              per-version statuses below.
            </p>
          </div>

          <div className={s.summaryCard}>
            <h2 className={s.summaryCardTitle}>TypeScript Declarations</h2>
            <p className={s.summaryCardValue}>
              {data.summary.passedTypesTracks} / {data.summary.totalTypesTracks}
            </p>
            <p className={s.summaryCardDesc}>
              {data.summary.passedTypesTracks} of {data.summary.totalTypesTracks} tested
              @types/react tracks pass tsc --noEmit where the React.JSX namespace is available
              (19.x, 18.3+, 17.0.62+, and 16.14.43+).
            </p>
          </div>
        </section>

        <section className={s.section} aria-labelledby="runtime-matrix-heading">
          <div className={s.sectionHeader}>
            <div>
              <h2 id="runtime-matrix-heading" className={s.sectionTitle}>
                Runtime, SSR &amp; Unit Test Compatibility ({filteredVersions.length} versions)
              </h2>
              <p className={s.sectionDescription}>
                Filter by major React track or search for a specific semantic version below.
              </p>
            </div>
          </div>

          <div className={s.controlsBar}>
            <div className={s.trackTabs} role="group" aria-label="Filter by React track">
              <button
                type="button"
                className={`${s.trackTab} ${selectedTrack === "all" ? s.trackTabActive : ""}`}
                aria-pressed={selectedTrack === "all"}
                onClick={() => setSelectedTrack("all")}
              >
                All Tracks ({allVersions.length})
              </button>
              {data.tracks.map((track) => (
                <button
                  key={track.id}
                  type="button"
                  className={`${s.trackTab} ${selectedTrack === track.id ? s.trackTabActive : ""}`}
                  aria-pressed={selectedTrack === track.id}
                  onClick={() => setSelectedTrack(track.id)}
                >
                  {track.name} ({track.versions.length})
                </button>
              ))}
            </div>

            <div className={s.searchField}>
              <label htmlFor="compat-version-search" className={s.searchLabel}>
                Filter Version:
              </label>
              <input
                id="compat-version-search"
                type="search"
                className={s.searchInput}
                placeholder="e.g. 19.3.1 or 18.2.0"
                value={searchQuery}
                onChange={(ev) => setSearchQuery(ev.target.value)}
              />
            </div>
          </div>

          <div
            className={s.tableWrapper}
            role="region"
            aria-labelledby="runtime-matrix-heading"
            tabIndex={0}
          >
            {filteredVersions.length === 0 ? (
              <p className={s.emptyState}>No React versions match your current filter.</p>
            ) : (
              <table className={s.compatTable}>
                <thead className={s.tableHead}>
                  <tr className={s.tableRow}>
                    <th scope="col" className={s.cornerHeaderCell}>
                      Version
                    </th>
                    <th scope="col" className={s.tableHeaderCell}>
                      Track
                    </th>
                    <th scope="col" className={s.tableHeaderCell}>
                      SSR
                    </th>
                    <th scope="col" className={s.tableHeaderCell}>
                      Client Mount
                    </th>
                    <th scope="col" className={s.tableHeaderCell}>
                      Hydration
                    </th>
                    <th scope="col" className={s.tableHeaderCell}>
                      Interactive Runtime
                    </th>
                    <th scope="col" className={s.tableHeaderCell}>
                      Vitest Suite
                    </th>
                    <th scope="col" className={s.tableHeaderCell}>
                      Notes
                    </th>
                  </tr>
                </thead>
                <tbody className={s.tableBody}>
                  {filteredVersions.map((entry) => (
                    <tr key={entry.version} className={s.tableRow}>
                      <th scope="row" className={s.rowHeaderCell}>
                        {entry.version}
                      </th>
                      <td className={`${s.tableCell} ${s.cellCol2}`}>
                        <span className={s.trackBadge}>{entry.trackName}</span>
                      </td>
                      <td className={`${s.tableCell} ${s.cellCol3}`}>
                        <span className={getBadgeClassName(entry.ssr)}>{entry.ssr}</span>
                      </td>
                      <td className={`${s.tableCell} ${s.cellCol4}`}>
                        <span className={getBadgeClassName(entry.clientRender)}>
                          {entry.clientRender}
                        </span>
                      </td>
                      <td className={`${s.tableCell} ${s.cellCol5}`}>
                        <span className={getBadgeClassName(entry.hydration)}>
                          {entry.hydration}
                        </span>
                      </td>
                      <td className={`${s.tableCell} ${s.cellCol6}`}>
                        <span className={getBadgeClassName(entry.runtime)}>{entry.runtime}</span>
                      </td>
                      <td className={`${s.tableCell} ${s.cellCol7}`}>
                        <span className={getBadgeClassName(entry.vitestStatus)}>
                          {entry.vitestSummary}
                        </span>
                      </td>
                      <td className={`${s.tableCell} ${s.cellCol8}`}>
                        <span className={s.noteText}>{entry.note}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </section>

        <section className={s.section} aria-labelledby="types-matrix-heading">
          <div className={s.sectionHeader}>
            <div>
              <h2 id="types-matrix-heading" className={s.sectionTitle}>
                TypeScript (@types/react) Consumer Compatibility
              </h2>
              <p className={s.sectionDescription}>
                Results of compiling a strict TypeScript consumer against dist/types/index.d.ts
                across major and pinned @types/react releases.
              </p>
            </div>
          </div>

          <div
            className={s.tableWrapper}
            role="region"
            aria-labelledby="types-matrix-heading"
            tabIndex={0}
          >
            <table className={s.typesTable}>
              <thead className={s.tableHead}>
                <tr className={s.tableRow}>
                  <th scope="col" className={s.cornerHeaderCell}>
                    Track / Label
                  </th>
                  <th scope="col" className={s.tableHeaderCell}>
                    @types/react
                  </th>
                  <th scope="col" className={s.tableHeaderCell}>
                    Status
                  </th>
                  <th scope="col" className={s.tableHeaderCell}>
                    Details &amp; Notes
                  </th>
                </tr>
              </thead>
              <tbody className={s.tableBody}>
                {data.typesCompatibility.map((item) => (
                  <tr key={item.id} className={s.tableRow}>
                    <th scope="row" className={s.rowHeaderCell}>
                      {item.label}
                    </th>
                    <td className={`${s.tableCell} ${s.cellCol2}`}>
                      <span className={s.trackBadge}>{item.typesReact}</span>
                    </td>
                    <td className={`${s.tableCell} ${s.cellCol3}`}>
                      <span className={getBadgeClassName(item.status)}>{item.status}</span>
                    </td>
                    <td className={`${s.tableCell} ${s.cellCol4}`}>
                      <span className={s.noteText}>{item.note}</span>
                      {item.errorSummary && (
                        <code className={s.errorCode}>{item.errorSummary}</code>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className={s.section} aria-labelledby="cli-usage-heading">
          <div className={s.sectionHeader}>
            <div>
              <h2 id="cli-usage-heading" className={s.sectionTitle}>
                Running the Compatibility Suite Locally
              </h2>
              <p className={s.sectionDescription}>
                Use the built-in npm scripts to verify React compatibility in your terminal or
                regenerate the chart data for this demo page.
              </p>
            </div>
          </div>

          <div className={s.cliGrid}>
            <div className={s.cliCard}>
              <h3 className={s.cliTitle}>Full Terminal Suite</h3>
              <code className={s.cliCommand}>npm run test:compat</code>
              <p className={s.cliDesc}>
                Runs SSR, client mount, hydration, interactive runtime, Vitest, and TypeScript
                checks across all 43 React versions and prints a report to the terminal.
              </p>
            </div>

            <div className={s.cliCard}>
              <h3 className={s.cliTitle}>Update Demo Chart Data</h3>
              <code className={s.cliCommand}>npm run test:compat:demo</code>
              <p className={s.cliDesc}>
                Executes the full compatibility suite and writes updated results to
                dev/App/Compatibility/compatibilityData.json for this demo page.
              </p>
            </div>

            <div className={s.cliCard}>
              <h3 className={s.cliTitle}>Fast Runtime &amp; Types Check</h3>
              <code className={s.cliCommand}>npm run test:compat:fast</code>
              <p className={s.cliDesc}>
                Verifies SSR, client mount, hydration, interactive runtime, and @types/react in
                seconds by skipping per-version Vitest runs.
              </p>
            </div>

            <div className={s.cliCard}>
              <h3 className={s.cliTitle}>Print Cached Terminal Report</h3>
              <code className={s.cliCommand}>npm run test:compat:report</code>
              <p className={s.cliDesc}>
                Renders the formatted terminal compatibility table immediately from the saved JSON
                data without re-running tests.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default CompatibilityPage;
