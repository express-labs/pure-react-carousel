import React from 'react';
import {
  Slide,
  StaticViewport,
  CarouselProvider,
  ButtonFirst,
  Dot,
  ButtonLast,
  ButtonBack,
  ButtonNext,
} from '../../..';
import { randomHexColor } from '../../../helpers';

const StaticCarousel = ({
  totalSlides = 5,
  visibleSlides = 2,
  infinite = false,
  step = 1,
}) => {
  const Slides: React.ReactNode[] = [];
  const Dots: React.ReactNode[] = [];

  for (let i = 0; i < totalSlides; i += 1) {
    Slides.push(
      <Slide key={i} index={i}>
        <div
          style={{
            width: '200px',
            height: '200px',
            backgroundColor: randomHexColor(),
          }}
        >
          Slide {i}
        </div>
      </Slide>
    );
    Dots.push(
      <Dot key={i} slideIndex={i}>
        {i}
      </Dot>
    );
  }

  return (
    <div>
      <CarouselProvider
        totalSlides={totalSlides}
        visibleSlides={visibleSlides}
        infinite={infinite}
        step={step}
      >
        <StaticViewport orientation="horizontal" slideWidth={200}>
          {Slides}
        </StaticViewport>
        <center>
          <ButtonFirst>First</ButtonFirst>
          <ButtonBack>&lt;</ButtonBack>
          {Dots}
          <ButtonNext>&gt;</ButtonNext>
          <ButtonLast>Last</ButtonLast>
        </center>
      </CarouselProvider>
    </div>
  );
};

export default StaticCarousel;
