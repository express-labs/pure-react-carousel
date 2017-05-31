export function cn(a) {
  return a.map((b) => {
    if (b === false) return null;
    return b;
  }).join(' ').replace(/\s+/g, ' ').trim();
}

export function randomHexColor() {
  // eslint-disable-next-line no-bitwise
  return `#${(Math.random() * 0xFFFFFF << 0).toString(16)}`;
}

export function slideUnit(visibleSlides = 1) {
  return 100 / visibleSlides;
}

export function slideWidth(totalSlides) {
  return (1 / totalSlides) * 100;
}

export function slideTrayWidth(totalSlides, visibleSlides) {
  return (100 * totalSlides) / visibleSlides;
}

export function pct(num) {
  return `${num}%`;
}

export const LOADING = 'loading';
export const SUCCESS = 'success';
export const ERROR = 'error';
