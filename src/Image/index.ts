import type * as React from "react";
import Image from "./Image";
import WithStore from "../Store/WithStore";
import type { CarouselState, ImageProps, ImageViewProps } from "../types";

const ConnectedImage: React.ComponentType<ImageProps> = WithStore<
  ImageViewProps,
  Pick<CarouselState, "hasMasterSpinner">
>(Image, (state) => ({
  hasMasterSpinner: state.hasMasterSpinner,
}));

export default ConnectedImage;
