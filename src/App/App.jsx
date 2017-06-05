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
  <div>
    <section>
      <CarouselProvider
        visibleSlides={2}
        totalSlides={6}
        step={2}
        hasMasterSpinner
      >
        <h1 className={cn(['headline', s.headline])}>Carousel (With Master Loading Spinner)</h1>
        <p>This spinner will go away after all the images have loaded.</p>
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
    </section>
    <section>
      <CarouselProvider
        visibleSlides={2}
        totalSlides={6}
        step={2}
      >
        <h1 className={cn(['headline', s.headline])}>Carousel (With Individual Spinners)</h1>
        <p>Each ImageWithZoom component has it&apos;s own spinner</p>
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
    </section>

    <section>
      <CarouselProvider
        visibleSlides={2}
        totalSlides={1}
        step={2}
      >
        <h1 className={cn(['headline', s.headline])}>Carousel (Just One Image)</h1>
        <p>Single image</p>
        <Slider className={cn(['slider', s.slider])}>
          <Slide tag="a" index={0}>
            <ImageWithZoom isResponsive src="./media/img01.jpeg" />
          </Slide>
        </Slider>
        <ButtonFirst>First</ButtonFirst>
        <ButtonBack>Back</ButtonBack>
        <ButtonNext>Next</ButtonNext>
        <ButtonLast>Last</ButtonLast>
        <DotGroup />
      </CarouselProvider>
    </section>
  </div>
);

export default DevelopmentApp;
