import React from 'react';
import {
  ButtonBack,
  ButtonFirst,
  ButtonLast,
  ButtonNext,
  CarouselProvider,
  Slide,
  Slider,
  ImageWithZoom,
  DotGroup,
} from '../../..';

import s from '../../style.scss';

export default () => (
  <CarouselProvider
    visibleSlides={1}
    totalSlides={8}
    step={1}
    naturalSlideWidth={400}
    naturalSlideHeight={500}
    interval={3000}
    intervalList={[10000, 9000, 8000, 7000, 6000, 5000, 4000, 3000]}
    isPlaying="true"
    infinite="true"
  >
    <h2 className={s.headline}>Custom Slide Timings</h2>
    <p>
      A carousel with custom slide timing.
      {' '}
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
      <Slide index={6}>
        <ImageWithZoom src="./media/img07.jpeg" />
      </Slide>
      <Slide index={7}>
        <ImageWithZoom src="./media/img08.jpeg" />
      </Slide>
    </Slider>
    <ButtonFirst>First</ButtonFirst>
    <ButtonBack>Back</ButtonBack>
    <ButtonNext>Next</ButtonNext>
    <ButtonLast>Last</ButtonLast>
    <DotGroup dotNumbers />
  </CarouselProvider>
);
