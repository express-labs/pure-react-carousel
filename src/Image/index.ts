import Image from "./Image";
import WithStore from "../Store/WithStore";
import type { ImageProps as PublicImageProps } from "../../typings";
import type { CarouselState, ImageProps } from "../types";

export default WithStore<ImageProps, Pick<CarouselState, "hasMasterSpinner">>(Image, (state) => ({
  hasMasterSpinner: state.hasMasterSpinner,
})) as React.ComponentType<PublicImageProps>;
