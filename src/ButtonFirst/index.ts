import ButtonFirst from "./ButtonFirst";
import WithStore from "../Store/WithStore";
import type { ButtonFirstProps as PublicButtonFirstProps } from "../../typings";
import type { ButtonFirstProps, CarouselState } from "../types";

export default WithStore<ButtonFirstProps, Pick<CarouselState, "currentSlide" | "totalSlides">>(
  ButtonFirst,
  (state) => ({
    currentSlide: state.currentSlide,
    totalSlides: state.totalSlides,
  }),
) as React.ComponentType<PublicButtonFirstProps>;
