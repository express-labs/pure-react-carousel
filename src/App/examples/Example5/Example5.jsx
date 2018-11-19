import React from 'react';
import {
  ButtonBack,
  ButtonFirst,
  ButtonLast,
  ButtonNext,
  CarouselProvider,
  DotGroup,
  Image,
  Slide,
  Slider,
} from '../../..';

import s from '../../style.scss';

export default () => (
  <CarouselProvider
    visibleSlides={2}
    totalSlides={6}
    naturalSlideWidth={400}
    naturalSlideHeight={500}
  >
    <h2 className={s.headline}>Horizontal Carousel (With Master Loading Spinner)</h2>
    <p>
      Horizontal Carouisel with regular, non-zooming images and dotNumbers on the Dot
      Group.
    </p>
    <Slider className={s.slider}>
      <Slide tag="a" index={0}>
        <Image src="./media/img01.jpeg" />
      </Slide>
      <Slide tag="a" index={1}>
        <Image src="./media/img02.jpeg" />
      </Slide>
      <Slide tag="a" index={2}>
        <Image src="./media/img03.jpeg" />
      </Slide>
      <Slide tag="a" index={3}>
        <Image src="./media/img04.jpeg" />
      </Slide>
      <Slide tag="a" index={4}>
        <Image src="./media/img05.jpeg" />
      </Slide>
      <Slide tag="a" index={5}>
        <Image src="./media/img06.jpeg" />
      </Slide>
    </Slider>
    <ButtonFirst>First</ButtonFirst>
    <ButtonBack>Back</ButtonBack>
    <ButtonNext>Next</ButtonNext>
    <ButtonLast>Last</ButtonLast>
    <DotGroup dotNumbers />
  </CarouselProvider>
);
