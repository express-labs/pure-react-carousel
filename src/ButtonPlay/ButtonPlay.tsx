import React, { useCallback, useContext } from 'react';
import { cn } from '../helpers';
import s from './ButtonPlay.scss';
import {
  ActionTypes,
  CarouselActionContext,
  CarouselStoreContext,
} from '../CarouselProvider/CarouselContext';

export type ButtonPlayProps = React.ComponentPropsWithRef<'button'>;

const ButtonPlay = React.forwardRef<HTMLButtonElement, ButtonPlayProps>(
  ({ className, children, onClick, ...props }, btnRef) => {
    const { isPlaying } = useContext(CarouselStoreContext);
    const { dispatch } = useContext(CarouselActionContext);

    const handleOnClick = useCallback(
      (ev: React.MouseEvent<HTMLButtonElement>) => {
        dispatch({
          type: ActionTypes.BTN_PLAY,
          payload: {
            isPlaying: !isPlaying,
          },
        });
        if (onClick) {
          ev.persist();
          onClick(ev);
        }
      },
      [onClick, dispatch, isPlaying]
    );

    return (
      <button
        ref={btnRef}
        type="button"
        className={cn([s.buttonNext, 'carousel__play-button', className])}
        onClick={handleOnClick}
        {...props}
      >
        {children}
      </button>
    );
  }
);

ButtonPlay.displayName = 'ButtonPlay';

export default ButtonPlay;
