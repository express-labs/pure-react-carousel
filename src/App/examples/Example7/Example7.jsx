import React from 'react';
import {
  ButtonBack,
  ButtonNext,
  CarouselProvider,
  DotGroup,
  Slide,
  Slider,
} from '../../../';
import SlideComponent from './SlideComponent';
import s from './Example7.css';

export default () => (
  <CarouselProvider
    visibleSlides={3}
    totalSlides={6}
    step={3}
    naturalSlideWidth={400}
    naturalSlideHeight={500}
    hasMasterSpinner
  >
    <h1 className={s.headline}>Simple Carousel with vertically alligned nav buttons</h1>
    <p>
      Wrap the &lt;Slider /&gt;, &lt;ButtonBack /&gt;, &lt;ButonNext /&gt; components in a div with
      relative positioning.  Add absolute positioning to the buttons.
    </p>
    <div className={s.container}>
      <Slider className={s.slider}>
        <Slide index={0}>
          <SlideComponent />
        </Slide>
        <Slide index={1}>
          <SlideComponent />
        </Slide>
        <Slide index={2}>
          <SlideComponent />
        </Slide>
        <Slide index={3}>
          <SlideComponent />
        </Slide>
        <Slide index={4}>
          <SlideComponent />
        </Slide>
        <Slide index={5}>
          <SlideComponent />
        </Slide>
      </Slider>
      <ButtonBack className={s.buttonBack}>Back</ButtonBack>
      <ButtonNext className={s.buttonNext}>Next</ButtonNext>
    </div>
    <DotGroup className={s.dotGroup} />
  </CarouselProvider>
);
