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
      isInfinite = true,
    } = useContext(CarouselStoreContext);

    const { dispatch } = useContext(CarouselActionContext);

    const handleOnClick = useCallback(
      (ev: React.MouseEvent<HTMLButtonElement>) => {
        const maxSlideLeft = totalSlides - visibleSlides;
        const maxSlideRight = totalSlides;
        const nextSlide = currentSlide + step;
        let newCurrentSlide = nextSlide;

        if (isInfinite && maxSlideRight > totalSlides) {
          newCurrentSlide = totalSlides - visibleSlides;
        } else if (isInfinite && nextSlide > maxSlideLeft) {
          newCurrentSlide = 0;
        }

        dispatch({
          log: 'ButtonNext',
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
      [totalSlides, visibleSlides, currentSlide, step, isInfinite, dispatch]
    );

    const newDisabled =
      disabled ||
      (isInfinite === false && currentSlide >= totalSlides - visibleSlides);

    return (
      <button
        ref={btnRef}
        type="button"
        className={cn([s.buttonNext, 'carousel__next-button', className])}
        onClick={handleOnClick}
        disabled={newDisabled}
        {...props}
      >
        {children}
      </button>
    );
  }
);

ButtonNext.displayName = 'ButtonNext';

export default ButtonNext;
