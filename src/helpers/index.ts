import { CarouselStore } from '../CarouselProvider/CarouselContext';

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
): number {
  return ((100 / totalSlides) * visibleSlides) / visibleSlides;
}

export function responsiveSlideTraySize(
  totalSlides: number,
  visibleSlides: number
): number {
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

type AfterScrollArgs =
  // common args
  { slideSize?: number } & (
    | {
        // required
        orientation?: 'horizontal';
        scrollLeft?: number;

        // illegal
        scrollTop?: never;
      }
    | {
        // required
        orientation?: 'vertical';
        scrollTop?: number;

        // illegal
        scrollLeft?: never;
      }
  );

export function updateSlidePosition(
  totalSlides = 0,
  visibleSlides = 0,
  currentSlide = 0
): [number, number, number[]] {
  const [slidesRemainingBackward, slidesRemainingForward] =
    computeSlidesRemaining({ currentSlide, totalSlides, visibleSlides });

  const currentVisibleSlides = computeCurrentVisibleSlides({
    currentSlide,
    visibleSlides,
    totalSlides,
  });

  return [
    slidesRemainingBackward,
    slidesRemainingForward,
    currentVisibleSlides,
  ];
}

/**
 * Compute and return the current slide while scrolling (or whenever).
 * The current slide is ALWAYS the leftmost fully-visible slide in the viewport,
 * even when the carousel is right-to-left
 */
export function computeCurrentSlideWhileScrolling({
  orientation = 'horizontal',
  scrollLeft = 0,
  scrollTop = 0,
  slideSize = 0,
}: AfterScrollArgs): number {
  const currentVisibleSlides: number[] = [];
  let remainder = 0;
  let currentSlide = 0;

  if (orientation === 'horizontal') {
    remainder = scrollLeft % slideSize;
    currentSlide = (scrollLeft - remainder) / slideSize;
  } else {
    remainder = scrollTop % slideSize;
    currentSlide = (scrollTop - remainder) / slideSize;
  }

  return currentSlide;
}

/**
 * Return an array containing the index numbers of slides currently visible in
 * the viewport.
 */
export function computeCurrentVisibleSlides({
  currentSlide = 0,
  totalSlides = 0,
  visibleSlides = 0,
}): number[] {
  let retVal: number[] = [];
  const firstVisibleSlide = Math.max(0, currentSlide);
  const lastVisibleSlide = Math.min(currentSlide + visibleSlides, totalSlides);
  for (let i = firstVisibleSlide; i < lastVisibleSlide; i += 1) {
    retVal.push(i);
  }

  return retVal;
}

/**
 * Compute the number of slides currently out of view to the left/top and
 * right/bottom of the viewport in a horizontal/vertical carousel.
 */
export const computeSlidesRemaining = ({
  currentSlide = 0,
  totalSlides = 0,
  visibleSlides = 0,
}): [number, number] => {
  // forward = playDirection right or down (moving towards the end of an array)
  const remainderForward = Math.max(
    currentSlide + visibleSlides - totalSlides,
    0
  );
  // backward = playDirection left or up (moving towards the start of an array)
  const remainderBackward = currentSlide;

  return [remainderBackward, remainderForward];
};
