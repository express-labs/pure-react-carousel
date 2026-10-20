import * as React from "react";
import Dot from "../Dot";
import { cn } from "../helpers";
import type { DotGroupViewProps } from "../types";
import s from "./DotGroup.scss";

const DotGroup = React.forwardRef<HTMLDivElement, DotGroupViewProps>((props, ref) => {
  const {
    carouselStore: _carouselStore,
    children = null,
    className = undefined,
    currentSlide,
    dotNumbers = false,
    disableActiveDots = true,
    showAsSelectedForCurrentSlideOnly = false,
    totalSlides,
    visibleSlides,
    renderDots = null,
    ...restProps
  } = props;

  const renderDotsContent = () => {
    if (renderDots) {
      return renderDots({
        ...props,
        dotNumbers,
        disableActiveDots,
        showAsSelectedForCurrentSlideOnly,
      });
    }

    const dots: React.ReactNode[] = [];
    for (let i = 0; i < totalSlides; i += 1) {
      const multipleSelected = i >= currentSlide && i < currentSlide + visibleSlides;
      const singleSelected = i === currentSlide;
      const selected = showAsSelectedForCurrentSlideOnly ? singleSelected : multipleSelected;
      const slide = i >= totalSlides - visibleSlides ? totalSlides - visibleSlides : i;

      dots.push(
        <Dot
          key={i}
          slide={slide}
          selected={selected}
          disabled={disableActiveDots ? selected : false}
        >
          <span className={cn("carousel__dot-group-dot")}>{dotNumbers && i + 1}</span>
        </Dot>,
      );
    }
    return dots;
  };

  const newClassName = cn([s.DotGroup, "carousel__dot-group", className]);

  return (
    <div ref={ref} className={newClassName} {...restProps}>
      {renderDotsContent()}
      {children}
    </div>
  );
});

export default DotGroup;
