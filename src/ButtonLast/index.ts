import ButtonLast from "./ButtonLast";
import WithStore from "../Store/WithStore";
import type { ButtonLastProps as PublicButtonLastProps } from "../../typings";
import type { ButtonLastProps, CarouselState } from "../types";

export default WithStore<
  ButtonLastProps,
  Pick<CarouselState, "currentSlide" | "totalSlides" | "visibleSlides">
>(ButtonLast, (state) => ({
  currentSlide: state.currentSlide,
  totalSlides: state.totalSlides,
  visibleSlides: state.visibleSlides,
})) as React.ComponentType<PublicButtonLastProps>;
