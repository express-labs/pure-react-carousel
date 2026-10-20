/**
 * GetScrollParent
 *
 * Finds the first ancestor element (aka parent) with scroll.
 * Code is based off of a snippet created by Ola Holmström
 * Original Source: https://github.com/olahol/scrollparent.js/blob/master/scrollparent.js#L13
 */
export default class GetScrollParent {
  static style(node: Element, prop: string): string {
    if (typeof window === "undefined" || typeof window.getComputedStyle !== "function") {
      return "";
    }
    return window.getComputedStyle(node, null).getPropertyValue(prop);
  }

  static overflow(node: Element): string {
    return (
      GetScrollParent.style(node, "overflow") +
      GetScrollParent.style(node, "overflow-y") +
      GetScrollParent.style(node, "overflow-x")
    );
  }

  static scroll(node: Element): boolean {
    return /(auto|scroll)/.test(GetScrollParent.overflow(node));
  }

  static isNodeValid(node: unknown): node is HTMLElement | SVGElement {
    const isHTMLElement = typeof HTMLElement !== "undefined" && node instanceof HTMLElement;
    const isSVGElement = typeof SVGElement !== "undefined" && node instanceof SVGElement;
    return isHTMLElement || isSVGElement;
  }

  parents(node: Node | null, ps: Element[]): Element[] {
    if (node == null || node.parentNode == null) return ps;
    return this.parents(
      node.parentNode,
      typeof Element !== "undefined" && node instanceof Element ? ps.concat([node]) : ps,
    );
  }

  scrollParent(node: HTMLElement | SVGElement): HTMLElement | Element | null {
    const ps = this.parents(node.parentNode, []);
    for (let i = 0; i < ps.length; i += 1) {
      if (GetScrollParent.scroll(ps[i])) {
        return ps[i];
      }
    }

    if (typeof document === "undefined") return null;
    return document.scrollingElement || document.documentElement;
  }

  getScrollParent(node: unknown): HTMLElement | Element | null {
    if (!GetScrollParent.isNodeValid(node)) return null;
    return this.scrollParent(node);
  }
}
