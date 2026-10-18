import type * as React from "react";
import ButtonFirst from "./ButtonFirst";
import WithStore from "../Store/WithStore";
import type { ButtonFirstProps, ButtonFirstViewProps, CarouselState } from "../types";

const ConnectedButtonFirst: React.ComponentType<ButtonFirstProps> = WithStore<
  ButtonFirstViewProps,
  Pick<CarouselState, "currentSlide" | "totalSlides" | "pauseOnInteract">
>(ButtonFirst, (state) => ({
  currentSlide: state.currentSlide,
  totalSlides: state.totalSlides,
  pauseOnInteract: state.pauseOnInteract,
}));

export default ConnectedButtonFirst;
