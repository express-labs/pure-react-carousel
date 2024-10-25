/**
 * Create a className string.  Pass this function strings, arrays, or multi-dimensional
 * arrays.  You can even pass in an IIFE that returns a string or array.
 *
 * Example:
 * const c = 'cool';
 * const d = 'dude';
 * cn(false, undefined, null, 'wow', ['this', 'is'], (c => c)(c), (d => [d])(d));
 *
 * Output:
 * "wow this is cool dude"
 *
 * @returns string
 */
export const cn = (...args: unknown[]): string => {
  const flatten = (arr: unknown[]): unknown[] =>
    arr.reduce(
      (acc: unknown[], val) =>
        acc.concat(Array.isArray(val) ? flatten(val) : val),
      []
    );

  return flatten(Array.from(args))
    .filter((c) => c)
    .join(' ');
};

export function randomHexColor() {
  return `#${((Math.random() * 0xffffff) << 0).toString(16)}`;
}

export function slideUnit(visibleSlides = 1) {
  return 100 / visibleSlides;
}

export function responsiveSlideSize(
  totalSlides: number,
  visibleSlides: number
) {
  return ((100 / totalSlides) * visibleSlides) / visibleSlides;
}

export function responsiveSlideTraySize(
  totalSlides: number,
  visibleSlides: number
) {
  return (100 * totalSlides) / visibleSlides;
}

export function pct(num: number) {
  return `${num}%`;
}

/**
 * Cap a value at a minimum value and a maximum value.
 */
export const boundedRange = ({
  min,
  max,
  x,
}: {
  min: number;
  max: number;
  x: number;
}) => Math.min(max, Math.max(min, x));
