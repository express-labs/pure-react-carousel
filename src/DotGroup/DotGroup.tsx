import React, { useContext } from 'react';
import { cn } from '../helpers';
import s from './DotGroup.scss';
import {
  CarouselActionContext,
  CarouselStoreContext,
} from '../CarouselProvider/CarouselContext';
import Dot from '../Dot/Dot';

export type DotGroupProps = Omit<
  React.ComponentPropsWithoutRef<'div'>,
  'children'
> & {
  dotNumbers?: boolean;
  classNameDot?: string;
  classNameDotSpan?: string;
};

/**
 * DotGroup is an opinionated React container component that wraps a bunch of Dot components.
 * If this configuration does not satisfy your needs, you can easily create your own DotGroup.
 * Developers, do not make PR's to add customizations to this component. Instead, make a new
 * type of DotGroup that suits your particular needs.  If you think it's worthy of sharing, then
 * submit your new component in a PR.
 */
const DotGroup = React.forwardRef<HTMLDivElement, DotGroupProps>(
  (props, divRef) => {
    const {
      className,
      classNameDot,
      classNameDotSpan,
      dotNumbers = false,
      ...restProps
    } = props;
    const { totalSlides = 0 } = useContext(CarouselStoreContext);

    const { dispatch } = useContext(CarouselActionContext);

    const dots: React.ReactElement[] = [];
    for (let i = 0; i < totalSlides; i += 1) {
      dots.push(
        <Dot
          key={i}
          slide={i}
          className={cn('carousel__dot-group-dot', classNameDot)}
        >
          <span className={cn('carousel__dot-group-span', classNameDotSpan)}>
            {dotNumbers && i + 1}
          </span>
        </Dot>
      );
    }

    return (
      <div
        ref={divRef}
        className={cn(s.DotGroup, 'carousel__dot-group', className)}
        {...restProps}
      >
        {dots}
      </div>
    );
  }
);

DotGroup.displayName = 'DotGroup';

export default DotGroup;
