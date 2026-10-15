import ImageWithZoom from "./ImageWithZoom";
import WithStore from "../Store/WithStore";
import type { ImageWithZoomProps as PublicImageWithZoomProps } from "../../typings";
import type { CarouselState, ImageWithZoomProps } from "../types";

export default WithStore<ImageWithZoomProps, Pick<CarouselState, "hasMasterSpinner">>(
  ImageWithZoom,
  (state) => ({
    hasMasterSpinner: state.hasMasterSpinner,
  }),
) as React.ComponentType<PublicImageWithZoomProps>;
