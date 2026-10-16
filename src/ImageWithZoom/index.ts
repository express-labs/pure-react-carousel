import type * as React from "react";
import ImageWithZoom from "./ImageWithZoom";
import WithStore from "../Store/WithStore";
import type { CarouselState, ImageWithZoomProps, ImageWithZoomViewProps } from "../types";

const ConnectedImageWithZoom: React.ComponentType<ImageWithZoomProps> = WithStore<
  ImageWithZoomViewProps,
  Pick<CarouselState, "hasMasterSpinner">
>(ImageWithZoom, (state) => ({
  hasMasterSpinner: state.hasMasterSpinner,
}));

export default ConnectedImageWithZoom;
