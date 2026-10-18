import type * as React from "react";
import ButtonLast from "./ButtonLast";
import WithStore from "../Store/WithStore";
import type { ButtonLastProps, ButtonLastViewProps, CarouselState } from "../types";

const ConnectedButtonLast: React.ComponentType<ButtonLastProps> = WithStore<
  ButtonLastViewProps,
  Pick<CarouselState, "currentSlide" | "totalSlides" | "visibleSlides" | "pauseOnInteract">
>(ButtonLast, (state) => ({
  currentSlide: state.currentSlide,
  totalSlides: state.totalSlides,
  visibleSlides: state.visibleSlides,
  pauseOnInteract: state.pauseOnInteract,
}));

export default ConnectedButtonLast;
