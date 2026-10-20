import type { ClassValue } from "../types";

export type { ClassValue } from "../types";

export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
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
