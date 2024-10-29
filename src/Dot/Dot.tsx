import React, { useCallback, useContext } from 'react';
import { cn } from '../helpers';
import s from './Dot.scss';
import {
  ActionTypes,
  CarouselActionContext,
  CarouselStoreContext,
} from '../CarouselProvider/CarouselContext';

export type DotProps = React.ComponentPropsWithoutRef<'button'> & {
  slideIndex: number;
};

const Dot = React.forwardRef<HTMLButtonElement, DotProps>((props, btnRef) => {
  const { onClick, disabled, slideIndex, children, className, ...restProps } =
    props;
  const { currentVisibleSlides = [], currentSlide = 0 } =
    useContext(CarouselStoreContext);
  const { dispatch } = useContext(CarouselActionContext);

  const handleOnClick = useCallback(
    (ev: React.MouseEvent<HTMLButtonElement>) => {
      dispatch({
        type: ActionTypes.BTN_ONCLICK,
        payload: {
          currentSlide: slideIndex,
          isPlaying: false,
        },
      });
      if (onClick) {
        ev.persist();
        onClick(ev);
      }
    },
    [onClick, dispatch, slideIndex, ActionTypes]
  );

  const newDisabled = disabled || !!currentVisibleSlides?.[slideIndex];

  return (
    <button
      type="button"
      onClick={handleOnClick}
      className={cn([
        s.dot,
        currentVisibleSlides?.[slideIndex] && s.dotSelected,
        'carousel__dot',
        `carousel__dot--${slideIndex}`,
        className,
      ])}
      ref={btnRef}
      disabled={newDisabled}
      {...restProps}
    >
      {children}
    </button>
  );
});

Dot.displayName = 'Dot';

export default Dot;
