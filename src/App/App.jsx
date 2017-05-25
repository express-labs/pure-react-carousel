import React from 'react';
import { ButtonBack, ButtonNext, CarouselProvider, Slider, Slide, DotGroup } from '../';
import s from './style.css';
import { cn } from '../helpers';

const DevelopmentApp = () => (
  <CarouselProvider
    visibleSlides={2}
    totalSlides={9}
    step={2}
  >
    <h1 className={cn(['headline', s.headline])}>Carousel Dev App</h1>
    <Slider className={cn(['slider', s.slider])}>
      <Slide />
      <Slide />
      <Slide />
      <Slide />
      <Slide />
      <Slide />
      <Slide />
      <Slide />
      <Slide />
    </Slider>
    <ButtonBack>Back</ButtonBack>
    <ButtonNext>Next</ButtonNext>
    <DotGroup />
  </CarouselProvider>
);

export default DevelopmentApp;
