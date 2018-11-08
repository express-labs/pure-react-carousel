/**
 * GetScrollParent
 *
 * Finds the first anscestor element (aka parent) with scroll.
 * Code is Based off of a snippet created by Ola Holmström
 * Original Source: https://github.com/olahol/scrollparent.js/blob/master/scrollparent.js#L13
 *
 * Usage:
 * const parent = new GetScrollParent(element);
 */
export default class GetScrollParent {
  static style(_node, prop) {
    return getComputedStyle(_node, null).getPropertyValue(prop);
  }

  static overflow(_node) {
    return (
      GetScrollParent.style(_node, 'overflow')
      + GetScrollParent.style(_node, 'overflow-y')
      + GetScrollParent.style(_node, 'overflow-x')
    );
  }

  static scroll(_node) {
    return /(auto|scroll)/.test(GetScrollParent.overflow(_node));
  }

  static isNodeValid(_node) {
    return _node instanceof HTMLElement || _node instanceof SVGElement;
  }

  parents(_node, ps) {
    if (_node.parentNode === null) return ps;
    return this.parents(_node.parentNode, ps.concat([_node]));
  }


  scrollParent(_node) {
    const ps = this.parents(_node.parentNode, []);
    for (let i = 0; i < ps.length; i += 1) {
      if (GetScrollParent.scroll(ps[i])) {
        return ps[i];
      }
    }

    return document.scrollingElement || document.documentElement;
  }

  getScrollParent(_node) {
    if (!GetScrollParent.isNodeValid(_node)) return null;
    return this.scrollParent(_node);
  }
}
