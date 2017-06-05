import React from 'react';
import {
  ButtonBack, ButtonFirst, ButtonLast, ButtonNext,
  CarouselProvider, DotGroup, ImageWithZoom, Slide, Slider,
} from '../';
import s from './style.css';
import { cn } from '../helpers';

// function demoClick(ev) {
//   console.log('ev', Object.assign({}, ev));
// }

const DevelopmentApp = () => (
  <CarouselProvider
    visibleSlides={2}
    totalSlides={6}
    step={2}
  >
    <h1 className={cn(['headline', s.headline])}>Carousel Dev App</h1>
    <Slider className={cn(['slider', s.slider])}>
      <Slide tag="a" index={0}>
        <ImageWithZoom isResponsive src="./media/img01.jpeg" />
      </Slide>
      <Slide tag="a" index={1}>
        <ImageWithZoom isResponsive src="./media/img02.jpeg" />
      </Slide>
      <Slide tag="a" index={2}>
        <ImageWithZoom isResponsive src="./media/img03.jpeg" />
      </Slide>
      <Slide tag="a" index={3}>
        <ImageWithZoom isResponsive src="./media/img04.jpeg" />
      </Slide>
      <Slide tag="a" index={4}>
        <ImageWithZoom isResponsive src="./media/img05.jpeg" />
      </Slide>
      <Slide tag="a" index={5}>
        <ImageWithZoom isResponsive src="./media/img06.jpeg" />
      </Slide>
    </Slider>
    <ButtonFirst>First</ButtonFirst>
    <ButtonBack>Back</ButtonBack>
    <ButtonNext>Next</ButtonNext>
    <ButtonLast>Last</ButtonLast>
    <DotGroup />
  </CarouselProvider>
);

export default DevelopmentApp;
