import React from 'react';
import {
  ButtonBack,
  ButtonFirst,
  ButtonLast,
  ButtonNext,
  CarouselProvider,
  DotGroup,
  ImageWithZoom,
  Slide,
  Slider,
} from '../../..';

import s from '../../style.scss';

export default () => (
  <CarouselProvider
    visibleSlides={2}
    totalSlides={6}
    step={2}
    naturalSlideWidth={400}
    naturalSlideHeight={500}
  >
    <h2 className={s.headline}>Carousel (With Individual Spinners)</h2>
    <p>
      Each ImageWithZoom component has it&apos;s own spinner. You might want to use Chrome
      dev tools to throttle the network connection so you can see the spinners.
    </p>
    <p>
      Also,
      we added the boolean prop dotNumbers to the DotGroup for displaying slide
      numbers.
    </p>
    <Slider className={s.slider}>
      <Slide index={0}>
        <ImageWithZoom src="./media/img01.jpeg" />
      </Slide>
      <Slide index={1}>
        <ImageWithZoom src="./media/img02.jpeg" />
      </Slide>
      <Slide index={2}>
        <ImageWithZoom src="./media/img03.jpeg" />
      </Slide>
      <Slide index={3}>
        <ImageWithZoom src="./media/img04.jpeg" />
      </Slide>
      <Slide index={4}>
        <ImageWithZoom src="./media/img05.jpeg" />
      </Slide>
      <Slide index={5}>
        <ImageWithZoom src="./media/img06.jpeg" />
      </Slide>
    </Slider>
    <ButtonFirst>First</ButtonFirst>
    <ButtonBack>Back</ButtonBack>
    <ButtonNext>Next</ButtonNext>
    <ButtonLast>Last</ButtonLast>
    <DotGroup dotNumbers />
  </CarouselProvider>
);
