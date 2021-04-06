import PropTypes from 'prop-types';

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

export function slideSize(totalSlides, visibleSlides) {
  return ((100 / totalSlides) * visibleSlides) / visibleSlides;
}

export function slideTraySize(totalSlides, visibleSlides) {
  return (100 * totalSlides) / visibleSlides;
}

export function pct(num) {
  return `${num}%`;
}

export const LOADING = 'loading';
export const SUCCESS = 'success';
export const ERROR = 'error';

export const CarouselPropTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
  direction: PropTypes.oneOf(['forward', 'backward']),
  orientation: PropTypes.oneOf(['horizontal', 'vertical']),
  isBgImage: (props, propName) => {
    const value = props[propName];
    if (value === true && props.tag === 'img') {
      return new Error(`HTML img elements should not have a backgroundImage.  Please use ${propName} for other block-level HTML tags, like div, a, section, etc...`);
    }
    return null;
  },
  slideSize: (props, propName, componentName, ...rest) => {
    if (props.isIntrinsicHeight === true) {
      return PropTypes.number(props, propName, componentName, ...rest);
    }
    return PropTypes.number.isRequired(props, propName, componentName, ...rest);
  },
};

/**
 * Cap a value at a minimum value and a maximum value.
 * @param  {number} min The smallest allowed value.
 * @param  {number} max The largest allowed value.
 * @param  {number} x   A value.
 * @return {number}     Either the original value, the minimum value, or the maximum value.
 */
export const boundedRange = ({ min, max, x }) => Math.min(
  max,
  Math.max(min, x),
);
