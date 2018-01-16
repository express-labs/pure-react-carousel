import React from 'react';
import { shallow, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import components from '../helpers/component-config';

configure({ adapter: new Adapter() });


describe('All visual components should pass through props that are not consumed by that component.', () => {
  Object.keys(components).forEach((conf) => {
    it(`The ${conf} component should pass through propery "data-foo"`, () => {
      const { props, component: Component } = components[conf];
      const wrapper = shallow(<Component data-foo="bar" {...props} />);
      expect(wrapper.at(0).prop('data-foo')).toBe('bar');
    });
  });
});
describe('All visual components should append any supplied className value to the end of className string', () => {
  Object.keys(components).forEach((conf) => {
    it(`The ${conf} component should append class "foo" to the end of the className string`, () => {
      const { props, component: Component } = components[conf];
      const wrapper = shallow(<Component className="foo" {...props} />);
      expect(wrapper.at(0).prop('className').split(' ').pop()).toBe('foo');
    });
  });
});
