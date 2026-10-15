import * as React from "react";

export type CarouselElement<T extends keyof React.JSX.IntrinsicElements = "div"> = Omit<
  React.JSX.IntrinsicElements[T],
  "ref"
>;
