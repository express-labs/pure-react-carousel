import React, { useCallback, useContext } from 'react';
import { cn } from '../helpers';
import s from './ButtonNext.scss';
import {
  ActionTypes,
  CarouselActionContext,
  CarouselStoreContext,
} from '../CarouselProvider/CarouselContext';

export type ButtonNextProps = React.ComponentPropsWithRef<'button'>;

const ButtonNext = React.forwardRef<HTMLButtonElement, ButtonNextProps>(
  ({ className, children, disabled, onClick, ...props }, btnRef) => {
    const {
      currentSlide = 0,
      totalSlides = 0,
      visibleSlides = 0,
      step = 1,
      isInfinite,
    } = useContext(CarouselStoreContext);

    const { dispatch } = useContext(CarouselActionContext);

    const handleOnClick = useCallback(
      (ev: React.MouseEvent<HTMLButtonElement>) => {
        const maxSlide = totalSlides - visibleSlides;
        const nextSlide = step + currentSlide;
        let newCurrentSlide = Math.min(nextSlide, maxSlide);

        if (isInfinite) {
          const isOnLastSlide = maxSlide === currentSlide;
          newCurrentSlide = isOnLastSlide ? 0 : newCurrentSlide;
        }

        dispatch({
          type: ActionTypes.BTN_ONCLICK,
          payload: {
            currentSlide: newCurrentSlide,
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
        className={cn([s.buttonNext, 'carousel__next-button', className])}
        onClick={handleOnClick}
        disabled={
          disabled ||
          (currentSlide >= totalSlides - visibleSlides && !isInfinite)
        }
        {...props}
      >
        {children}
      </button>
    );
  }
);

ButtonNext.displayName = 'ButtonNext';

export default ButtonNext;
