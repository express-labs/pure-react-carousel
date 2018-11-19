import React from 'react';
import {
  ButtonBack, ButtonFirst, ButtonLast, ButtonNext, ButtonPlay,
  CarouselProvider, DotGroup, ImageWithZoom, Slide, Slider,
} from '../../..';

import s from '../../style.scss';

export default () => (
  <CarouselProvider
    visibleSlides={2}
    totalSlides={6}
    step={2}
    naturalSlideWidth={400}
    naturalSlideHeight={500}
    hasMasterSpinner
    currentSlide={0}
    isPlaying
  >
    <h2 className={s.headline}>Horizontal Carousel Auto Play</h2>
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
    <ButtonPlay
      childrenPlaying="Pause"
      childrenPaused="Play"
    />
    <ButtonFirst>First</ButtonFirst>
    <ButtonBack>Back</ButtonBack>
    <ButtonNext>Next</ButtonNext>
    <ButtonLast>Last</ButtonLast>
    <DotGroup />
  </CarouselProvider>
);
