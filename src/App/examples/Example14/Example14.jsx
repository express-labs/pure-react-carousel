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
    visibleSlides={2}
    totalSlides={8}
    step={1}
    naturalSlideWidth={400}
    naturalSlideHeight={500}
  >
    <h2 className={s.headline}>RTL</h2>
    <p>
      A carousel wrapped in an element with
      {' '}
      <code>dir=&quot;rtl&quot;</code>
, demonstrating support for use with right-to-left languages.
    </p>
    <div dir="rtl">
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
        <Slide index={6}>
          <ImageWithZoom src="./media/img07.jpeg" />
        </Slide>
        <Slide index={7}>
          <ImageWithZoom src="./media/img08.jpeg" />
        </Slide>
      </Slider>
      <ButtonFirst>First</ButtonFirst>
      <ButtonBack>Back</ButtonBack>
      <ButtonNext>Next</ButtonNext>
      <ButtonLast>Last</ButtonLast>
      <DotGroup dotNumbers />
    </div>
  </CarouselProvider>
);
