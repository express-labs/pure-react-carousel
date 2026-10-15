import ButtonPlay from "./ButtonPlay";
import WithStore from "../Store/WithStore";
import type { ButtonPlayProps as PublicButtonPlayProps } from "../../typings";
import type { ButtonPlayProps, CarouselState } from "../types";

export default WithStore<ButtonPlayProps, Pick<CarouselState, "isPlaying">>(
  ButtonPlay,
  (state) => ({
    isPlaying: state.isPlaying,
  }),
) as React.ComponentType<PublicButtonPlayProps>;
