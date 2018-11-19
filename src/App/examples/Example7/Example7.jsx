import React from 'react';
import {
  ButtonBack,
  ButtonNext,
  CarouselProvider,
  DotGroup,
  Slide,
  Slider,
} from '../../..';
import SlideComponent from './SlideComponent';
import s from './Example7.scss';

export default () => (
  <CarouselProvider
    visibleSlides={3}
    totalSlides={6}
    step={3}
    naturalSlideWidth={400}
    naturalSlideHeight={500}
  >
    <h2 className={s.headline}>Simple Carousel With React Redux</h2>
    <p>
      The slides in this example use components that utilize React-Redux to track a counter value.
      This example demonstraits that the context used by Pure React Carousel won&apos;t interfere
      with components connected to React-Redux.
    </p>
    <div className={s.container}>
      <Slider className={s.slider}>
        <Slide className={s.slide} index={0}>
          <SlideComponent />
        </Slide>
        <Slide className={s.slide} index={1}>
          <SlideComponent />
        </Slide>
        <Slide className={s.slide} index={2}>
          <SlideComponent />
        </Slide>
        <Slide className={s.slide} index={3}>
          <SlideComponent />
        </Slide>
        <Slide className={s.slide} index={4}>
          <SlideComponent />
        </Slide>
        <Slide className={s.slide} index={5}>
          <SlideComponent />
        </Slide>
      </Slider>
      <ButtonBack className={s.buttonBack}>Back</ButtonBack>
      <ButtonNext className={s.buttonNext}>Next</ButtonNext>
    </div>
    <DotGroup className={s.dotGroup} />
  </CarouselProvider>
);
