import React, { useCallback, useContext } from 'react';
import { cn } from '../helpers';
import s from './ButtonFirst.scss';
import {
  ActionTypes,
  CarouselActionContext,
  CarouselStoreContext,
} from '../CarouselProvider/CarouselContext';

export type ButtonFirstProps = React.ComponentPropsWithoutRef<'button'>;

const ButtonFirst = React.forwardRef<HTMLButtonElement, ButtonFirstProps>(
  ({ className, disabled, children, onClick, ...props }, btnRef) => {
    const { currentSlide } = useContext(CarouselStoreContext);
    const { dispatch } = useContext(CarouselActionContext);

    const handleOnClick = useCallback(
      (ev: React.MouseEvent<HTMLButtonElement>) => {
        dispatch({
          log: 'ButtonFirst',
          type: ActionTypes.BTN_ONCLICK,
          payload: {
            currentSlide: 0,
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
        type="button"
        className={cn([s.buttonFirst, 'carousel__first-button', className])}
        onClick={handleOnClick}
        disabled={disabled || currentSlide === 0}
        {...props}
      >
        {children}
      </button>
    );
  }
);

ButtonFirst.displayName = 'ButtonFirst';

export default ButtonFirst;
