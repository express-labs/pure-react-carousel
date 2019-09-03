import React, { useState } from 'react';
import {
  ButtonBack,
  ButtonFirst,
  ButtonLast,
  ButtonNext,
  ButtonPlay,
  CarouselProvider,
  DotGroup,
  ImageWithZoom,
  Slide,
  Slider,
} from '../../..';

import s from '../../style.scss';

export default () => {
  const [slide, setSlide] = useState(0);

  return (
    <React.Fragment>
      <div>
        <label htmlFor="currentSlideEx9">
          Test switching the default starting slide (currentSlide prop).
        </label>
        <select id="currentSlideEx9" onChange={ev => setSlide(Number(ev.target.value))}>
          <option value="0" defaultValue={slide === 0}>
            0
          </option>
          <option value="1" defaultValue={slide === 1}>
            1
          </option>
          <option value="2" defaultValue={slide === 2}>
            2
          </option>
          <option value="3" defaultValue={slide === 3}>
            3
          </option>
          <option value="4" defaultValue={slide === 4}>
            4
          </option>
          <option value="5" defaultValue={slide === 5}>
            5
          </option>
        </select>
      </div>
      <CarouselProvider
        visibleSlides={2}
        totalSlides={6}
        step={2}
        naturalSlideWidth={400}
        naturalSlideHeight={500}
        hasMasterSpinner
        currentSlide={slide}
        isPlaying
      >
        <h2 className={s.headline}>Horizontal Carousel Auto Play</h2>
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
        <ButtonPlay childrenPlaying="Pause" childrenPaused="Play" />
        <ButtonFirst>First</ButtonFirst>
        <ButtonBack>Back</ButtonBack>
        <ButtonNext>Next</ButtonNext>
        <ButtonLast>Last</ButtonLast>
        <DotGroup />
      </CarouselProvider>
    </React.Fragment>
  );
};
