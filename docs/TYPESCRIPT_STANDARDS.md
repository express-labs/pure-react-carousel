# TypeScript Standards

This document serves as the repository's authoritative reference for TypeScript coding conventions, component and store/context typing patterns, runtime type narrowing, and ambient declaration files (`.d.ts`).

---

## 1. Direct Function Parameter Typing (No `React.FC`)

Do **NOT** use `React.FC` or `React.FunctionComponent`. `React.FC` obscures function signatures and historically injected implicit props. Always type props directly on the function parameter arguments:

**Bad — using `React.FC`:**

```tsx
// ❌ WRONG: Never use React.FC or React.FunctionComponent
const ButtonBack: React.FC<ButtonBackViewProps> = ({
  className = '',
  disabled = false,
}) => {
  return <button className={className} disabled={disabled} />;
};
```

**Good — direct parameter typing:**

```tsx
// ✅ CORRECT: Type props directly on the parameter argument
const Spinner = ({ className = null, ...restProps }: SpinnerProps) => {
  return <div className={cn([s.spinner, 'carousel__spinner', className])} {...restProps} />;
};

const ButtonBack = (props: ButtonBackViewProps) => {
  // ...
};
```

---

## 2. Centralized Type Definitions (`src/types.ts`) & `import type`

Never define shared component, store, or context interfaces directly inside `src/[ComponentName]/index.ts` or `src/[ComponentName]/[ComponentName].tsx`.

- [`src/types.ts`](../src/types.ts) is the single source of truth for all library types:
  - Public context-connected component props (`[ComponentName]Props`, e.g., `SliderProps`, `ButtonBackProps`)
  - Unconnected presentational view props (`[ComponentName]ViewProps`, e.g., `SliderViewProps`, `ButtonBackViewProps`)
  - Store state, context, and HOC contracts (`CarouselState`, `MutableCarouselStatePatch`, `CarouselStoreInterface`, `CarouselInjectedProps`, `WithStoreProps`, `WithStoreInterface`)
  - Component-specific helper interfaces and union types (`Orientation`, `PlayDirection`, `ScrollSnapType`, `TouchCoordinates`, `SliderDragState`, etc.)
- Centralizing types in [`src/types.ts`](../src/types.ts) prevents circular dependency cycles between views, `WithStore` containers, helpers, and unit tests.
- Public types are re-exported from the package root [`src/index.ts`](../src/index.ts) (`export type { ... } from './types'`) so `npm run build` (`tsc -p tsconfig.build.json`) emits complete declarations at `dist/types/index.d.ts`, verified by [`typings/index.test-d.tsx`](../typings/index.test-d.tsx).
- Never re-export types from individual component folders (`src/[ComponentName]/index.ts` or `src/[ComponentName]/[ComponentName].tsx`). Internal modules and tests must import types directly from `src/types.ts` (and external consumers from `pure-react-carousel`) using `import type`:

```ts
// ✅ CORRECT: Import types from ../types using `import type`
import ButtonBack from './ButtonBack';
import WithStore from '../Store/WithStore';
import type { ButtonBackProps, ButtonBackViewProps, CarouselState } from '../types';
```

---

## 3. Avoid `any`

Code must avoid TypeScript's `any` keyword (`"typescript/no-explicit-any": "error"` in [`vite.config.ts`](../vite.config.ts)).

- When handling values of unknown shape (such as `catch` block errors, custom DOM event properties, or structural equality checks like `equal(a: unknown, b: unknown)`), type the value as `unknown` and narrow it with runtime type guards (`typeof`, `instanceof`, `"in"`, or custom type predicates) before accessing properties.

---

## 4. Avoid `as` Type Assertions

Do **NOT** use `as` type assertions to force types. `as` bypasses type checking and disables excess property validation without offering runtime guarantees.

Prefer runtime narrowing (`instanceof`, `"in"`, custom type guards), explicit type annotations (`: Type`), or `satisfies`.

**Exception:** `as const` is safe and encouraged for creating immutable literal types (e.g., `const syncedProps = { ... } as const;`).

### 1. Object Declarations & Polymorphic `Tag` Elements

```tsx
// ❌ Bad — silences missing or mistyped properties
const config = { currentSlide: 0 } as DefaultCarouselConfig;

// ✅ Good — validates all required properties and rejects unknown keys
const config: DefaultCarouselConfig = { currentSlide: 0, /* ...all required keys */ };

// ❌ Bad — casting polymorphic JSX tag with `as`
const ElementTag = Tag as React.ElementType;

// ✅ Good — use `React.createElement` for dynamic intrinsic tag strings without `as` assertions
return React.createElement(Tag, { className: newClassName, ...filteredProps }, children);
```

### 2. DOM Elements & Browser Events

```ts
// ❌ Bad — forces HTMLElement without verification
const target = ev.target as HTMLElement;

// ✅ Good — use React's pre-typed `ev.currentTarget` on the handler element, or narrow with a guard
const target = ev.currentTarget;

// ✅ Good — when checking DOM instances in helpers that may run during SSR, guard the global first
static isNodeValid(node: unknown): node is HTMLElement | SVGElement {
  const isHTMLElement = typeof HTMLElement !== 'undefined' && node instanceof HTMLElement;
  const isSVGElement = typeof SVGElement !== 'undefined' && node instanceof SVGElement;
  return isHTMLElement || isSVGElement;
}
```

### 3. Unknown Values & Custom Type Predicates

```ts
// ❌ Bad — casting `unknown` to Record<string, unknown> with `as`
const keysA = Object.keys(a as Record<string, unknown>);

// ✅ Good — narrow `unknown` with a reusable type predicate
export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

if (!isRecord(a) || !isRecord(b)) {
  return false;
}
const keysA = Object.keys(a); // Safely narrowed to Record<string, unknown>
```

### 4. React Context (`CarouselContext`)

```ts
// ❌ Bad — force-casting context value with `as`
const store = useContext(CarouselContext) as CarouselStoreInterface;

// ✅ Good — `CarouselContext` is created with a typed default Store instance (`createContext<CarouselStoreInterface>(new Store())`)
const contextStore = useContext(CarouselContext);
```

---

## 5. Strictly Typed Store State & `WithStore` HOC

### Store State & `MutableCarouselStatePatch`

[`CarouselState`](../src/types.ts) properties are marked `readonly` and deep-frozen at runtime via `deepFreeze`. Never cast state objects to `Record<string, unknown>` to mutate fields. When building a state update object before calling `carouselStore.setStoreState(newState)`, type the patch object as [`MutableCarouselStatePatch`](../src/types.ts) (or `Partial<CarouselState>`):

```ts
import type { MutableCarouselStatePatch } from '../types';

const newStoreState: MutableCarouselStatePatch = {};
if (keyCode === backKey) {
  newStoreState.currentSlide = Math.max(0, currentSlide - 1);
  if (pauseOnInteract) {
    newStoreState.isPlaying = false;
  }
}
carouselStore.setStoreState(newStoreState);
```

### Connected Components (`WithStore`)

Always type `WithStore`-connected components in `src/[ComponentName]/index.ts` with explicit `React.ComponentType<[ComponentName]Props>` and `WithStore<[ComponentName]ViewProps, Pick<CarouselState, ...>>` generics so `state` in `mapStateToProps` is strictly typed as `CarouselState`:

```ts
import type * as React from 'react';
import ButtonBack from './ButtonBack';
import WithStore from '../Store/WithStore';
import type { ButtonBackProps, ButtonBackViewProps, CarouselState } from '../types';

const ConnectedButtonBack: React.ComponentType<ButtonBackProps> = WithStore<
  ButtonBackViewProps,
  Pick<
    CarouselState,
    'currentSlide' | 'infinite' | 'pauseOnInteract' | 'step' | 'totalSlides' | 'visibleSlides'
  >
>(ButtonBack, (state: CarouselState) => ({
  currentSlide: state.currentSlide,
  infinite: state.infinite,
  pauseOnInteract: state.pauseOnInteract,
  step: state.step,
  totalSlides: state.totalSlides,
  visibleSlides: state.visibleSlides,
}));

export default ConnectedButtonBack;
```

---

## 6. Ambient Declaration Files (`.d.ts`) and Type Imports

Ambient declaration files (such as [`src/scss.d.ts`](../src/scss.d.ts)) are used to declare asset/style module types (`.scss`, `.css`, `.svg`, `.jpg`, `.jpeg`, `.png`) or augment global declarations.

Never use standard top-level `import ... from '...'` statements in hand-authored ambient declaration files. Adding a top-level import converts the `.d.ts` file from an ambient script into an ES module, causing TypeScript to strip global/module declarations and trigger type errors across the project. Similarly, avoid nesting `import` statements inside `declare module` blocks.

Instead, use TypeScript's inline dynamic type import syntax (`import('package').TypeName`) or built-in types.

**Bad — top-level import converts the ambient declaration file into an ES module:**

```ts
// ❌ WRONG: Top-level import converts the file into an ES module, breaking ambient declarations
import type { CSSProperties } from 'react';

declare module '*.scss' {
  const classes: { readonly [key: string]: string };
  export default classes;
}
```

**Bad — nested import statement inside `declare module` block:**

```ts
// ❌ WRONG: Avoid using import statements inside declare module blocks
declare module 'some-external-library' {
  import { Component } from 'react';

  export class Widget extends Component<WidgetProps> {}
}
```

**Good — pure ambient module declarations or inline dynamic type imports:**

```ts
// ✅ CORRECT: Pure ambient module declaration (see src/scss.d.ts)
declare module '*.scss' {
  const classes: { readonly [key: string]: string };
  export default classes;
}

// ✅ CORRECT: Use inline type imports (import('...').Type) when external types are needed
declare module 'some-external-library' {
  export interface WidgetProps {
    id: string;
    onComplete?: () => void;
  }

  export class Widget extends import('react').Component<WidgetProps> {
    reset(): void;
  }
}
```

---

## 7. JSDoc / TSDoc Docblocks on Types & Interfaces

Place `/** ... */` docblock comments (following the JSDoc/TSDoc standard) directly above exported types, interfaces, and non-obvious members in [`src/types.ts`](../src/types.ts).

The TypeScript Language Server and VS Code treat `/** ... */` docblocks as first-class AST metadata—emitting them into `dist/types/index.d.ts` and surfacing them directly in consumer hover tooltips, autocomplete popups, and quick-info widgets.

```ts
export interface SliderProps extends CarouselElement<'div'> {
  /**
   * Maximum pointer movement in pixels before a press is treated as a drag gesture
   * and child click events are suppressed. Pass `0` to disable click suppression.
   *
   * @default 5
   */
  dragClickThreshold?: number;

  /**
   * Fraction of a single slide's width/height (`0` to `1`) that a drag must exceed
   * to advance to the next or previous slide on release.
   *
   * @default 0.1
   */
  moveThreshold?: number;

  /**
   * Additional HTML attributes forwarded to the inner slide tray element.
   * Note: `ref` is intentionally excluded because `Slider` manages the tray ref internally.
   */
  trayProps?: CarouselElement<'div'> & { ref?: never };
}
```

### Why It Is Effective

- **`/** ... */` vs `//`:** Single-line comments (`//`) and standard multi-line comments (`/* ... */`) are ignored by the TypeScript Language Server and will not appear in hover tooltips. Only docblocks starting with `/**` are parsed into IntelliSense.
- **Full Markdown Support:** Editors render CommonMark inside docblocks, including backtick code spans, bullet lists, external links, and fenced code blocks.
- **Special Tag Handling:**
  - `@default`: Explicitly documents default/fallback values without requiring consumers to inspect runtime implementation files.
  - `@internal`: Marks internal store/synchronization fields (such as `privateUnDisableAnimation`) that are not intended for direct consumer use.
  - `@deprecated`: Causes editors to visually strike through deprecated symbols (`~~propName~~`). Only add `@deprecated` when a symbol is formally scheduled for removal.
  - `@see` / `{@link ...}`: Provides navigable symbol links and references directly inside hover tooltips.
- **Doc Tooling Integration:** Emitted `.d.ts` files (`dist/types/index.d.ts`), TypeDoc, API Extractor, and Storybook automatically consume these docblocks.

### Practical Guidelines

- **Document the "Why" and Non-Obvious Constraints:**
  - **Units & Ranges:** Specify units for numeric properties (e.g., milliseconds for `interval`, pixels for `dragClickThreshold` / `horizontalPixelThreshold`, `0`–`1` fraction for `moveThreshold`, percentage `0`–`100` for `slideSize`, 0-based slide indices for `currentSlide` / `index`, or `KeyboardEvent.keyCode` integers for `backwardKeyCode` / `forwardKeyCode`).
  - **Defaults:** Annotate optional props with `@default` matching `defaultProps` in `src/helpers/component-config.ts` or component parameter defaults.
  - **Indexed-Access Props (`CarouselState["..."]`):** Because TypeScript does not forward member JSDoc through indexed-access types (`interval?: CarouselState["interval"]`), include concise docblocks (with `@default`) directly on `CarouselProviderProps` and `*Props` members where consumer IDE hover occurs.
- **Avoid Restating the Type (High-Signal Only):** Do not write redundant comments that merely echo the property name and primitive type:

```ts
// ❌ Anti-pattern: High noise, zero new information
/** The class name */
className?: string;

/** Whether the button is disabled */
disabled?: boolean;
```

If a property name and type are self-explanatory (such as standard React/DOM attributes like `children`, `className`, `style`, `disabled`, `alt`, `src`, `width`, `height`, `role`, `tabIndex`), omit the member docblock so interfaces remain concise and scannable.

---

## 8. Tree-Shakeable Component & Module Exports

The published ESM library (`dist/index.es.js` and per-component modules in `dist/`) is packed with multiple entry points in [`vite.config.ts`](../vite.config.ts) (`pack.entry`) alongside `"sideEffects": ["*.css"]` in [`package.json`](../package.json). Because each component view (`src/<Component>/<Component>.tsx`), `WithStore` container (`src/<Component>/index.ts`), `CarouselContext` (`src/CarouselProvider/context.ts`), and `Store` (`src/Store/Store.ts`) is emitted as its own module, downstream consumer bundlers (Vite, Rollup, Rolldown, Webpack, esbuild) can dead-code-eliminate unused components at the module boundary without requiring manual `/*#__PURE__*/` annotations in component files.

1. **Preserve Multi-Entry Packing in [`vite.config.ts`](../vite.config.ts):**
   - Keep `pack.entry` configured so [`src/index.ts`](../src/index.ts), connected component barrels (`src/*/index.ts`), unconnected views (`src/*/*.tsx`), `src/CarouselProvider/context.ts`, and `src/Store/Store.ts` emit separate ESM/CJS chunks.
   - [`dist/index.es.js`](../dist/index.es.js) must remain a pure re-export barrel with no bare side-effect imports (`import "./..."`). When adding a new component or top-level export to [`src/index.ts`](../src/index.ts), ensure its source file is covered by `pack.entry`.
2. **Keep Module Top-Level Scope Free of Side Effects:**
   - Never execute runtime side effects (DOM queries, `window`/`document` listeners, global state mutations, or console/network calls) at module evaluation time.
   - Avoid circular or cross-component imports that pull unrelated components into the same module graph.
3. **Preserve `"sideEffects": ["*.css"]` in [`package.json`](../package.json) & Regression Coverage:**
   - [`package.json`](../package.json) must declare `"sideEffects": ["*.css"]` so bundlers treat all `.js` modules in `dist/` as side-effect-free while retaining stylesheet imports (`pure-react-carousel/dist/react-carousel.es.css`).
   - Any new component or export added to [`src/index.ts`](../src/index.ts) must remain covered by [`src/__tests__/treeshake.test.ts`](../src/__tests__/treeshake.test.ts).

---

## 🚦 Guidelines for AI and Humans

- **Direct Parameter Typing:** Type component props directly on function arguments (`(props: MyViewProps) => ...` or `({ prop }: MyProps) => ...`). Never use `React.FC`.
- **Single Source of Truth in `src/types.ts`:** Define all public (`*Props`), view (`*ViewProps`), store/context, and component helper interfaces in [`src/types.ts`](../src/types.ts) (re-exported via [`src/index.ts`](../src/index.ts)) and import them with `import type`.
- **Narrow, Don't Assert:** Avoid `any` and `as` type assertions (`as const` is encouraged for literal types). Use runtime narrowing (`instanceof`, `"in"`, custom type predicates), explicit variable annotations (`: Type`), `satisfies`, and `MutableCarouselStatePatch`.
- **Keep `.d.ts` Files Ambient:** Never add top-level or nested `import ... from` statements in hand-authored `.d.ts` files; use inline `import('pkg').Type` syntax instead.
- **High-Signal JSDoc (`/** ... */`):** Document exported types/interfaces and non-obvious properties (units, ranges, constraints, `@default`, `@internal`) using `/** ... */` docblocks in [`src/types.ts`](../src/types.ts); omit redundant comments on self-explanatory props.
- **Tree-Shakeable Module Exports:** Preserve multi-entry `pack.entry` in [`vite.config.ts`](../vite.config.ts) and `"sideEffects": ["*.css"]` in [`package.json`](../package.json), keep module top-level scope free of runtime side effects, and keep [`src/__tests__/treeshake.test.ts`](../src/__tests__/treeshake.test.ts) green.
