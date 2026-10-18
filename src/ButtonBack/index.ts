import type * as React from "react";
import ButtonBack from "./ButtonBack";
import WithStore from "../Store/WithStore";
import type { ButtonBackProps, ButtonBackViewProps, CarouselState } from "../types";

const ConnectedButtonBack: React.ComponentType<ButtonBackProps> = WithStore<
  ButtonBackViewProps,
  Pick<
    CarouselState,
    "currentSlide" | "step" | "totalSlides" | "visibleSlides" | "infinite" | "pauseOnInteract"
  >
>(ButtonBack, (state) => ({
  currentSlide: state.currentSlide,
  step: state.step,
  totalSlides: state.totalSlides,
  visibleSlides: state.visibleSlides,
  infinite: state.infinite,
  pauseOnInteract: state.pauseOnInteract,
}));

export default ConnectedButtonBack;
