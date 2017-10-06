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
} from '../../../';

import s from '../../style.css';

export default () => (
  <CarouselProvider
    visibleSlides={2}
    totalSlides={1}
    step={2}
    naturalSlideWidth={400}
    naturalSlideHeight={500}
  >
    <h1 className={s.headline}>Carousel (Just One Image)</h1>
    <p>Single image</p>
    <Slider className={s.slider}>
      <Slide tag="a" index={0}>
        <ImageWithZoom src="./media/img01.jpeg" />
      </Slide>
    </Slider>
    <ButtonFirst>First</ButtonFirst>
    <ButtonBack>Back</ButtonBack>
    <ButtonNext>Next</ButtonNext>
    <ButtonLast>Last</ButtonLast>
    <DotGroup />
  </CarouselProvider>
);
