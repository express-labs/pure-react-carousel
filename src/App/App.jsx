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
        <p>
          This spinner will go away after all the images have loaded. You might want to use Chrome
          dev tools to throttle the network connection so you can see the spinner.
        </p>
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
        <p>
          Each ImageWithZoom component has it&apos;s own spinner. You might want to use Chrome
          dev tools to throttle the network connection so you can see the spinners.
        </p>
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

    <section>
      <CarouselProvider
        visibleSlides={1}
        totalSlides={6}
        orientation="vertical"
        height={400}
      >
        <h1 className={cn(['headline', s.headline])}>Vertical Carousel (With Master Loading Spinner)</h1>
        <p>
          This is a vertical carousel. You must specify a height.  Therefore, vertical carousels are
          not responsive by default. This spinner will go away after all the images have loaded.
        </p>
        <p>
          TODO: make vertical carousels responsive based on image.  It can be done but it&apos;s not
          part of the requirements for now.
        </p>
        <Slider className={cn(['verticalSlider', s.verticalSlider])}>
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

  </div>
);

export default DevelopmentApp;
