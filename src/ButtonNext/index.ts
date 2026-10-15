import ButtonNext from "./ButtonNext";
import WithStore from "../Store/WithStore";
import type { ButtonNextProps as PublicButtonNextProps } from "../../typings";
import type { ButtonNextProps, CarouselState } from "../types";

export default WithStore<
  ButtonNextProps,
  Pick<CarouselState, "currentSlide" | "step" | "totalSlides" | "visibleSlides" | "infinite">
>(ButtonNext, (state) => ({
  currentSlide: state.currentSlide,
  step: state.step,
  totalSlides: state.totalSlides,
  visibleSlides: state.visibleSlides,
  infinite: state.infinite,
})) as React.ComponentType<PublicButtonNextProps>;
