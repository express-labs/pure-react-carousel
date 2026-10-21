import * as React from "react";
import type { ClassValue } from "../types";

export type { ClassValue } from "../types";

export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

export function hasAccessibleContent(node: unknown): boolean {
  if (node === null || node === undefined || typeof node === "boolean") {
    return false;
  }
  if (typeof node === "string") {
    return node.trim().length > 0;
  }
  if (typeof node === "number") {
    return true;
  }
  if (Array.isArray(node)) {
    return node.some((item) => hasAccessibleContent(item));
  }
  if (React.isValidElement(node) && isRecord(node.props)) {
    if (node.props["aria-hidden"] === true || node.props["aria-hidden"] === "true") {
      return false;
    }
    if (
      (typeof node.props["aria-label"] === "string" &&
        node.props["aria-label"].trim().length > 0) ||
      (typeof node.props["aria-labelledby"] === "string" &&
        node.props["aria-labelledby"].trim().length > 0) ||
      (typeof node.props.alt === "string" && node.props.alt.trim().length > 0) ||
      (typeof node.props.title === "string" && node.props.title.trim().length > 0)
    ) {
      return true;
    }
    return hasAccessibleContent(node.props.children);
  }
  return false;
}

export function cn(...inputs: ClassValue[]): string {
  const classes: string[] = [];
  for (const input of inputs) {
    if (!input) continue;
    if (typeof input === "string" || typeof input === "number") {
      classes.push(String(input).trim());
    } else if (Array.isArray(input)) {
      const inner = cn(...input);
      if (inner) classes.push(inner);
    } else if (typeof input === "object") {
      for (const [key, value] of Object.entries(input)) {
        if (value) classes.push(key.trim());
      }
    }
  }
  return classes.filter(Boolean).join(" ").replace(/\s+/g, " ").trim();
}

export function randomHexColor(): string {
  return `#${Math.trunc(Math.random() * 0xffffff).toString(16)}`;
}

export function slideUnit(visibleSlides = 1): number {
  return 100 / visibleSlides;
}

export function slideSize(totalSlides: number, visibleSlides = 1): number {
  return ((100 / totalSlides) * visibleSlides) / visibleSlides;
}

export function slideTraySize(totalSlides: number, visibleSlides: number): number {
  return (100 * totalSlides) / visibleSlides;
}

export const pct = (num: number): string => `${num}%`;

export const LOADING = "loading";
export const SUCCESS = "success";
export const ERROR = "error";

export const boundedRange = ({ min, max, x }: { min: number; max: number; x: number }): number =>
  Math.min(max, Math.max(min, x));

export function deepFreeze<T>(obj: T): T {
  if (!isRecord(obj)) {
    return obj;
  }
  Object.freeze(obj);
  for (const value of Object.values(obj)) {
    if (isRecord(value) && !Object.isFrozen(value)) {
      deepFreeze(value);
    }
  }
  return obj;
}

export function equal(a: unknown, b: unknown): boolean {
  if (Object.is(a, b)) return true;
  if (!isRecord(a) || !isRecord(b)) {
    return false;
  }
  if (Array.isArray(a) !== Array.isArray(b)) return false;
  const keysA = Object.keys(a);
  const keysB = Object.keys(b);
  if (keysA.length !== keysB.length) return false;
  for (const key of keysA) {
    if (!Object.prototype.hasOwnProperty.call(b, key) || !equal(a[key], b[key])) {
      return false;
    }
  }
  return true;
}

export function cleanProps<T extends Record<string, unknown>>(props: T): Omit<T, "carouselStore"> {
  const { carouselStore: _carouselStore, ...rest } = props;
  return rest;
}

const NON_DRAGGABLE_INTERACTIVE_DESCENDANT_SELECTOR =
  'input, textarea, select, option, audio, video, [contenteditable]:not([contenteditable="false"]), [role="slider"], [role="spinbutton"], [role="textbox"], [role="searchbox"], [role="combobox"], [role="listbox"], [role="option"]:not(.carousel__slide), [role="menu"], [role="menubar"], [role="menuitem"], [role="menuitemcheckbox"], [role="menuitemradio"], [role="tablist"], [role="tab"]:not(.carousel__slide), [role="radiogroup"], [role="radio"], [role="checkbox"], [role="switch"], [role="tree"], [role="treeitem"]:not(.carousel__slide), [role="treegrid"], [role="grid"], [role="gridcell"]:not(.carousel__slide)';

const INTERACTIVE_DESCENDANT_SELECTOR = `${NON_DRAGGABLE_INTERACTIVE_DESCENDANT_SELECTOR}, button, a[href], [role="button"], [role="link"]`;

function matchesDescendantSelector(
  target: EventTarget | null,
  currentTarget: EventTarget | null,
  selector: string,
): boolean {
  if (!target || target === currentTarget) {
    return false;
  }
  if (
    typeof Element !== "undefined" &&
    target instanceof Element &&
    currentTarget instanceof Element
  ) {
    const matched = target.closest(selector);
    return matched !== null && matched !== currentTarget && currentTarget.contains(matched);
  }
  return false;
}

export function isInteractiveDescendant(
  target: EventTarget | null,
  currentTarget: EventTarget | null,
): boolean {
  return matchesDescendantSelector(target, currentTarget, INTERACTIVE_DESCENDANT_SELECTOR);
}

export function isNonDraggableInteractiveDescendant(
  target: EventTarget | null,
  currentTarget: EventTarget | null,
): boolean {
  return matchesDescendantSelector(
    target,
    currentTarget,
    NON_DRAGGABLE_INTERACTIVE_DESCENDANT_SELECTOR,
  );
}

export function getInertValue(version: string = React.version): boolean | "" {
  return parseInt(version, 10) >= 19 ? true : "";
}
