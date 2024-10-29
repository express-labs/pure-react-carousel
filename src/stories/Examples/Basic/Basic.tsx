import React from 'react';
import {
  Slide,
  StaticViewport,
  CarouselProvider,
  ButtonFirst,
  Dot,
  ButtonLast,
} from '../../..';
import { randomHexColor } from '../../../helpers';

const Basic = ({ totalSlides = 5, visibleSlides = 2 }) => {
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
          {' '}
          Slide {i + 1}{' '}
        </div>
      </Slide>
    );
    Dots.push(
      <Dot key={i} slideIndex={i}>
        {i + 1}
      </Dot>
    );
  }

  return (
    <div>
      <CarouselProvider totalSlides={totalSlides} visibleSlides={visibleSlides}>
        <StaticViewport orientation="horizontal" slideWidth={200}>
          {Slides}
        </StaticViewport>
        <center>
          <ButtonFirst>First</ButtonFirst>
          {Dots}
          <ButtonLast>Last</ButtonLast>
        </center>
      </CarouselProvider>
    </div>
  );
};

export default Basic;
