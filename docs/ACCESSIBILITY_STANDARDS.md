# Accessibility Standards

Consult this document whenever creating, modifying, or reviewing JSX or HTML in `src/` or `dev/`.

---

## 1. WCAG 2.2 AA & Semantic HTML Review

When authoring or reviewing JSX/HTML changes:

- **Review the JSX/HTML changes for WCAG 2.2 AA compliance and suggest fixes for any missing semantic elements.**

### What to Check in JSX/HTML Diffs

1. **Semantic Elements Over Generic Containers**:
   - Prefer native semantic HTML elements (`<button>`, `<nav>`, `<section>`, `<main>`, `<header>`, `<footer>`, `<ul>`/`<li>`, `<figure>`, `<h1>`–`<h6>`) over generic `<div>` or `<span>` elements whenever they carry structural or interactive meaning.
   - When a component supports a polymorphic `tag` prop (e.g., `CarouselProvider`, `Slider`, `Slide`, `DotGroup`), verify that the default `tag` and consumer/demo usage in `dev/` preserve valid semantic hierarchy and landmark structure.
2. **Interactive Controls & Keyboard Operability (WCAG 2.1.1, 2.4.7, 2.5.8)**:
   - Interactive controls (`ButtonBack`, `ButtonNext`, `ButtonFirst`, `ButtonLast`, `ButtonPlay`, `Dot`) must use native `<button>` elements (with explicit `type="button"` where appropriate) rather than clickable `<div>`/`<span>` elements, ensuring built-in keyboard activation (`Enter`/`Space`) and focusability.
   - Ensure visible `:focus` / `:focus-visible` indicators and adequate target sizing are preserved.
3. **Accessible Names, Roles, and States (WCAG 4.1.2, 1.3.1)**:
   - Verify that interactive controls, regions, and slides expose accurate ARIA attributes and accessible labels (`aria-label`, `aria-live`, `aria-selected`, `aria-disabled`, `aria-roledescription`, `role`).
   - Confirm that images (`Image`, `ImageWithZoom`, and `<img>` elements in `dev/`) provide meaningful `alt` attributes (or `alt=""` / `role="presentation"` when strictly decorative).
