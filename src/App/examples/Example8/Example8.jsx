import React from 'react';
import {
  ButtonBack, ButtonFirst, ButtonLast, ButtonNext,
  CarouselProvider, DotGroup, ImageWithZoom, Slide, Slider,
} from '../../..';

import s from '../../style.scss';

export default () => (
  <CarouselProvider
    visibleSlides={1}
    totalSlides={6}
    step={1}
    naturalSlideWidth={400}
    naturalSlideHeight={500}
    hasMasterSpinner
    lockOnWindowScroll
  >
    <h2 className={s.headline}>Carousel (lockOnWindowScroll set to TRUE)</h2>
    <p>
      - When scrolling the browser, up and down, horizontal scrollers will not scroll horizontally.
    </p>
    <p>
      - When scrolling the browser, left and right, vertical scrollers will not scroll vertically.
    </p>
    <p>
      - This spinner will go away after all the images have loaded.
      <br />
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
    <DotGroup />
  </CarouselProvider>
);
