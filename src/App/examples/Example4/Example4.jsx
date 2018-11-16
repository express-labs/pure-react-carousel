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
    orientation="vertical"
    naturalSlideWidth={400}
    naturalSlideHeight={500}
    step={2}
  >
    <h2 className={s.headline}>Vertical Carousel (With Master Loading Spinner)</h2>
    <p>
      This is a vertical carousel.
    </p>
    <p>
      TODO: make vertical carousels responsive based on image.  It can be done but
      it&apos;s not part of the requirements for now.
    </p>
    <Slider className={s.verticalSlider}>
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
    <DotGroup />
  </CarouselProvider>

);
