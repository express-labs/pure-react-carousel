export function cn(a) {
  return a.join(' ').trim();
}

export function randomHexColor() {
  // eslint-disable-next-line no-bitwise
  return `#${(Math.random() * 0xFFFFFF << 0).toString(16)}`;
}

export function computeSlideWidthPercent(totalSlides, visibleSlides) {
  const sliderInnerWidth = (100 / visibleSlides) * totalSlides;
  const slideWidth = sliderInnerWidth / totalSlides;
  return `${slideWidth / (sliderInnerWidth / 100)}%`;
}

export function computeSliderInnerWidth(totalSlides, visibleSlides) {
  return `${(100 / visibleSlides) * totalSlides}%`;
}
