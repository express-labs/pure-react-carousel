import React from 'react';
import {
  ButtonBack, ButtonFirst, ButtonLast, ButtonNext,
  CarouselProvider, DotGroup, Image, Slide, Slider,
} from '../../../';

import s from '../../style.css';

export default () => (
  <CarouselProvider
    visibleSlides={2}
    totalSlides={6}
    step={2}
    naturalSlideWidth={400}
    naturalSlideHeight={500}
    hasMasterSpinner
  >
    <h1 className={s.headline}>Carousel (With linked images)</h1>
    <p>
      - This spinner will go away after all the images have loaded.<br />
    </p>
    <p>
      - The linked images should be clickable when not dragging.<br />
    </p>
    <Slider className={s.slider}>
      <Slide index={0}>
        <a href="https://github.com/express-labs/pure-react-carousel" target="_blank" rel="noopener noreferrer">
          <Image src="./media/img01.jpeg" />
        </a>
      </Slide>
      <Slide index={1}>
        <a href="https://github.com/express-labs/pure-react-carousel" target="_blank" rel="noopener noreferrer">
          <Image src="./media/img02.jpeg" />
        </a>
      </Slide>
      <Slide index={2}>
        <a href="https://github.com/express-labs/pure-react-carousel" target="_blank" rel="noopener noreferrer">
          <Image src="./media/img03.jpeg" />
        </a>
      </Slide>
      <Slide index={3}>
        <a href="https://github.com/express-labs/pure-react-carousel" target="_blank" rel="noopener noreferrer">
          <Image src="./media/img04.jpeg" />
        </a>
      </Slide>
      <Slide index={4}>
        <a href="https://github.com/express-labs/pure-react-carousel" target="_blank" rel="noopener noreferrer">
          <Image src="./media/img05.jpeg" />
        </a>
      </Slide>
      <Slide index={5}>
        <a href="https://github.com/express-labs/pure-react-carousel" target="_blank" rel="noopener noreferrer">
          <Image src="./media/img06.jpeg" />
        </a>
      </Slide>
    </Slider>
    <ButtonFirst>First</ButtonFirst>
    <ButtonBack>Back</ButtonBack>
    <ButtonNext>Next</ButtonNext>
    <ButtonLast>Last</ButtonLast>
    <DotGroup />
  </CarouselProvider>
);
