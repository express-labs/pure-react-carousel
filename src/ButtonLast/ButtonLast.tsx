import React, { useCallback, useContext } from 'react';
import { cn } from '../helpers';
import s from './Dot.scss';
import {
  ActionTypes,
  CarouselActionContext,
  CarouselStoreContext,
} from '../CarouselProvider/CarouselContext';

export type ButtonLastProps = React.ComponentPropsWithRef<'button'>;

const ButtonLast = React.forwardRef<HTMLButtonElement, ButtonLastProps>(
  ({ className, disabled, children, onClick, ...props }, btnRef) => {
    const {
      currentSlide = 0,
      totalSlides = 0,
      visibleSlides = 0,
    } = useContext(CarouselStoreContext);
    const { dispatch } = useContext(CarouselActionContext);

    const handleOnClick = useCallback(
      (ev: React.MouseEvent<HTMLButtonElement>) => {
        dispatch({
          type: ActionTypes.BTN_ONCLICK,
          payload: {
            currentSlide: totalSlides - visibleSlides,
            isPlaying: false,
          },
        });
        if (onClick) {
          ev.persist();
          onClick(ev);
        }
      },
      [onClick, dispatch]
    );

    return (
      <button
        ref={btnRef}
        type="button"
        className={cn([s.ButtonLast, 'carousel__first-button', className])}
        onClick={handleOnClick}
        disabled={disabled || currentSlide >= totalSlides - visibleSlides}
        {...props}
      >
        {children}
      </button>
    );
  }
);

ButtonLast.displayName = 'ButtonLast';

export default ButtonLast;
