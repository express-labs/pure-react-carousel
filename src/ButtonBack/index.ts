import ButtonBack from "./ButtonBack";
import WithStore from "../Store/WithStore";
import type { ButtonBackProps as PublicButtonBackProps } from "../../typings";
import type { ButtonBackProps, CarouselState } from "../types";

export default WithStore<
  ButtonBackProps,
  Pick<CarouselState, "currentSlide" | "step" | "totalSlides" | "visibleSlides" | "infinite">
>(ButtonBack, (state) => ({
  currentSlide: state.currentSlide,
  step: state.step,
  totalSlides: state.totalSlides,
  visibleSlides: state.visibleSlides,
  infinite: state.infinite,
})) as React.ComponentType<PublicButtonBackProps>;
