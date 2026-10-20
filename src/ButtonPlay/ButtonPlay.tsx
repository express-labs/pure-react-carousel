import * as React from "react";
import { cn } from "../helpers";
import type { ButtonPlayViewProps } from "../types";
import s from "./ButtonPlay.scss";

const ButtonPlay = React.forwardRef<HTMLButtonElement, ButtonPlayViewProps>((props, ref) => {
  const {
    carouselStore,
    children = null,
    childrenPaused = null,
    childrenPlaying = null,
    className = undefined,
    isPlaying,
    onClick = null,
    ...restProps
  } = props;

  const handleOnClick = (ev: React.MouseEvent<HTMLButtonElement>) => {
    carouselStore.setStoreState(
      {
        isPlaying: !isPlaying,
      },
      onClick !== null ? () => onClick(ev) : undefined,
    );
  };

  const newClassName = cn([s.buttonNext, "carousel__play-button", className]);

  return (
    <button
      ref={ref}
      type="button"
      aria-label="play"
      className={newClassName}
      onClick={handleOnClick}
      {...restProps}
    >
      {isPlaying && childrenPlaying}
      {!isPlaying && childrenPaused}
      {children}
    </button>
  );
});

export default ButtonPlay;
