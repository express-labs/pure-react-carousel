import React from "react";
import { render } from "@testing-library/react";
import { describe, it, expect } from "vite-plus/test";
import { createComponentConfig } from "./component-config";

const components = createComponentConfig();
type ComponentKey = keyof typeof components;

describe("All visual components should pass through props that are not consumed by that component.", () => {
  (Object.keys(components) as ComponentKey[]).forEach((conf) => {
    it(`The ${conf} component should pass through property "data-foo"`, () => {
      const freshConfig = createComponentConfig();
      const { props, component } = freshConfig[conf];
      const Component = component as React.ComponentType<Record<string, unknown>>;
      const { container } = render(<Component data-foo="bar" {...props} />);
      expect(container.firstElementChild).toHaveAttribute("data-foo", "bar");
    });
  });
});

describe("All visual components should append any supplied className value to the end of className string", () => {
  (Object.keys(components) as ComponentKey[]).forEach((conf) => {
    it(`The ${conf} component should append class "foo" to the end of the className string`, () => {
      const freshConfig = createComponentConfig();
      const { props, component } = freshConfig[conf];
      const Component = component as React.ComponentType<Record<string, unknown>>;
      const { container } = render(<Component className="foo" {...props} />);
      const classes = container.firstElementChild?.className.split(" ") || [];
      expect(classes.pop()).toBe("foo");
    });
  });
});
