import React from 'react';
import
{
  ButtonBack,
  ButtonFirst,
  ButtonLast,
  ButtonNext,
  CarouselProvider,
  Slide,
  Slider,
  ImageWithZoom,
  DotGroup,
} from '../../..';

import s from '../../style.scss';

export default () => (
  <CarouselProvider
    visibleSlides={1}
    totalSlides={2}
    step={1}
    naturalSlideWidth={400}
    naturalSlideHeight={500}
  >
    <h2 className={s.headline}>Zoom only on click</h2>
    <p>Two images: first will zoom on click, second will not.</p>
    <Slider className={s.slider}>
      <Slide tag="a" index={0}>
        <ImageWithZoom src="./media/img01.jpeg" onlyZoomOnClick />
      </Slide>
      <Slide tag="a" index={1}>
        <ImageWithZoom src="./media/img02.jpeg" />
      </Slide>
    </Slider>
    <ButtonFirst>First</ButtonFirst>
    <ButtonBack>Back</ButtonBack>
    <ButtonNext>Next</ButtonNext>
    <ButtonLast>Last</ButtonLast>
    <DotGroup dotNumbers />
  </CarouselProvider>
);
