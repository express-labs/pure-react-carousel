import type React from "react";
import ButtonPlay from "./ButtonPlay";
import WithStore from "../Store/WithStore";
import type { ButtonPlayProps, ButtonPlayViewProps, CarouselState } from "../types";

const ConnectedButtonPlay: React.ComponentType<ButtonPlayProps> = WithStore<
  ButtonPlayViewProps,
  Pick<CarouselState, "isPlaying">
>(ButtonPlay, (state) => ({
  isPlaying: state.isPlaying,
}));

export default ConnectedButtonPlay;
