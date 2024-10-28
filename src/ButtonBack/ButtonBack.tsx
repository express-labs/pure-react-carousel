import React, { useCallback, useContext } from 'react';
import { cn } from '../helpers';
import s from './ButtonBack.scss';
import {
  ActionTypes,
  CarouselActionContext,
  CarouselStoreContext,
} from '../CarouselProvider/CarouselContext';

export type ButtonBackProps = React.ComponentPropsWithRef<'button'>;

const ButtonBack = React.forwardRef<HTMLButtonElement, ButtonBackProps>(
  ({ className, children, disabled, onClick, ...props }, btnRef) => {
    const {
      currentSlide = 0,
      isInfinite,
      step = 1,
      totalSlides = 0,
      visibleSlides = 0,
    } = useContext(CarouselStoreContext);

    const { dispatch } = useContext(CarouselActionContext);

    const handleOnClick = useCallback(
      (ev: React.MouseEvent<HTMLButtonElement>) => {
        const maxSlide = totalSlides - visibleSlides;
        const nextSlide = step + currentSlide;
        let newCurrentSlide = Math.max(currentSlide - step, 0);

        if (isInfinite) {
          const isOnFirstSlide = currentSlide === 0;
          newCurrentSlide = isOnFirstSlide ? maxSlide : newCurrentSlide;
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
        className={cn([s.ButtonBack, 'carousel__next-button', className])}
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

ButtonBack.displayName = 'ButtonBack';

export default ButtonBack;
