import React from 'react';
import {
  ButtonBack, ButtonFirst, ButtonLast, ButtonNext,
  CarouselProvider, DotGroup, ImageWithZoom, Slide, Slider,
} from '../../..';

import s from '../../style.scss';

export default () => (
  <CarouselProvider
    visibleSlides={3}
    totalSlides={8}
    step={2}
    naturalSlideWidth={400}
    naturalSlideHeight={500}
    hasMasterSpinner
    infinite
  >
    <h2 className={s.headline}>Infinite Carousel</h2>
    <p>
      A carousel that returns to the first slide if the user clicks the Next button while on the
      last slide and returns to the last slide if the user clicks the Back
      button while on the first slide.
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
    <DotGroup />
  </CarouselProvider>
);
