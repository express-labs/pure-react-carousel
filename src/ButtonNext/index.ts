import type * as React from "react";
import ButtonNext from "./ButtonNext";
import WithStore from "../Store/WithStore";
import type { ButtonNextProps, ButtonNextViewProps, CarouselState } from "../types";

const ConnectedButtonNext: React.ComponentType<ButtonNextProps> = WithStore<
  ButtonNextViewProps,
  Pick<
    CarouselState,
    "currentSlide" | "step" | "totalSlides" | "visibleSlides" | "infinite" | "pauseOnInteract"
  >
>(ButtonNext, (state) => ({
  currentSlide: state.currentSlide,
  step: state.step,
  totalSlides: state.totalSlides,
  visibleSlides: state.visibleSlides,
  infinite: state.infinite,
  pauseOnInteract: state.pauseOnInteract,
}));

export default ConnectedButtonNext;
