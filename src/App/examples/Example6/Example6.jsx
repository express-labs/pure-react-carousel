import React from 'react';
import {
  ButtonBack,
  ButtonNext,
  CarouselProvider,
  DotGroup,
  ImageWithZoom,
  Slide,
  Slider,
} from '../../../';

import s from './Example6.css';

export default () => (
  <CarouselProvider
    visibleSlides={3}
    totalSlides={6}
    step={3}
    naturalSlideWidth={400}
    naturalSlideHeight={500}
    hasMasterSpinner
  >
    <h1 className={s.headline}>Carousel (With Master Loading Spinner)</h1>
    <p>
      This spinner will go away after all the images have loaded. You might want to use
      Chrome dev tools to throttle the network connection so you can see the spinner.
    </p>
    <div className={s.container}>
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
      <ButtonBack className={s.buttonBack}>Back</ButtonBack>
      <ButtonNext className={s.buttonNext}>Next</ButtonNext>
    </div>
    <DotGroup className={s.dotGroup} />
  </CarouselProvider>
);
