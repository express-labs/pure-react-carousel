import React, { useCallback, useContext } from 'react';
import { cn } from '../helpers';
import s from './Dot.scss';
import {
  ActionTypes,
  CarouselActionContext,
  CarouselStoreContext,
} from '../CarouselProvider/CarouselContext';

export type DotProps = React.ComponentPropsWithoutRef<'button'> & {
  slide: number;
};

const Dot = React.forwardRef<HTMLButtonElement, DotProps>((props, btnRef) => {
  const { onClick, disabled, slide, children, className, ...restProps } = props;
  const { currentVisibleSlides = [], currentSlide = 0 } =
    useContext(CarouselStoreContext);
  const { dispatch } = useContext(CarouselActionContext);

  const handleOnClick = useCallback(
    (ev: React.MouseEvent<HTMLButtonElement>) => {
      dispatch({
        type: ActionTypes.BTN_ONCLICK,
        payload: {
          currentSlide: slide,
          isPlaying: false,
        },
      });
      if (onClick) {
        ev.persist();
        onClick(ev);
      }
    },
    [onClick, dispatch, slide]
  );

  return (
    <button
      type="button"
      onClick={handleOnClick}
      className={cn([
        s.dot,
        currentVisibleSlides?.[slide] && s.dotSelected,
        'carousel__dot',
        `carousel__dot--${slide}`,
        className,
      ])}
      ref={btnRef}
      disabled={disabled || !!currentVisibleSlides?.[slide]}
      {...restProps}
    >
      {children}
    </button>
  );
});

Dot.displayName = 'Dot';

export default Dot;
