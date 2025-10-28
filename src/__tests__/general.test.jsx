import React from 'react';
import { render } from '@testing-library/react';
import components from '../helpers/component-config';
import CarouselProvider from '../CarouselProvider/CarouselProvider';



describe('All visual components should pass through props that are not consumed by that component.', () => {
  Object.keys(components).forEach((conf) => {
    it(`The ${conf} component should pass through propery "data-foo"`, () => {
      const { props, component: Component } = components[conf];
      
      // Components that need CarouselProvider context
      const needsProvider = ['Dot', 'DotGroup', 'Image', 'ImageWithZoom', 'Slide', 'Slider'];
      
      const TestComponent = needsProvider.includes(conf) ? (
        <CarouselProvider naturalSlideHeight={100} naturalSlideWidth={100} totalSlides={3}>
          <Component data-foo="bar" {...props} />
        </CarouselProvider>
      ) : (
        <Component data-foo="bar" {...props} />
      );
      
      const { container } = render(TestComponent);
      const element = container.querySelector('[data-foo="bar"]');
      expect(element).toBeTruthy();
      expect(element.getAttribute('data-foo')).toBe('bar');
    });
  });
});
describe('All visual components should append any supplied className value to the end of className string', () => {
  Object.keys(components).forEach((conf) => {
    it(`The ${conf} component should append class "foo" to the end of the className string`, () => {
      const { props, component: Component } = components[conf];
      
      // Components that need CarouselProvider context
      const needsProvider = ['Dot', 'DotGroup', 'Image', 'ImageWithZoom', 'Slide', 'Slider'];
      
      const TestComponent = needsProvider.includes(conf) ? (
        <CarouselProvider naturalSlideHeight={100} naturalSlideWidth={100} totalSlides={3}>
          <Component className="foo" {...props} />
        </CarouselProvider>
      ) : (
        <Component className="foo" {...props} />
      );
      
      const { container } = render(TestComponent);
      const element = container.querySelector('.foo');
      expect(element).toBeTruthy();
      expect(element.classList.contains('foo')).toBe(true);
    });
  });
});
