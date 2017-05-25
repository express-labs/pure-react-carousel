import React from 'react';
import { ButtonBack, ButtonNext, CarouselProvider, Slider, Slide, DotGroup, Image } from '../';
import s from './style.css';
import { cn } from '../helpers';

const DevelopmentApp = () => (
  <CarouselProvider
    visibleSlides={2}
    totalSlides={6}
    step={2}
  >
    <h1 className={cn(['headline', s.headline])}>Carousel Dev App</h1>
    <Slider className={cn(['slider', s.slider])}>
      <Slide>
        <Image responsive src="./media/img01.jpeg" />
      </Slide>
      <Slide>
        <Image responsive src="./media/img02.jpeg" />
      </Slide>
      <Slide>
        <Image responsive src="./media/img03.jpeg" />
      </Slide>
      <Slide>
        <Image responsive src="./media/img04.jpeg" />
      </Slide>
      <Slide>
        <Image responsive src="./media/img05.jpeg" />
      </Slide>
      <Slide>
        <Image responsive src="./media/img06.jpeg" />
      </Slide>
    </Slider>
    <ButtonBack>Back</ButtonBack>
    <ButtonNext>Next</ButtonNext>
    <DotGroup />
  </CarouselProvider>
);

export default DevelopmentApp;
