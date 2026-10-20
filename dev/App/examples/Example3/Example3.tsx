import React from "react";
import {
  ButtonBack,
  ButtonFirst,
  ButtonLast,
  ButtonNext,
  CarouselProvider,
  DotGroup,
  ImageWithZoom,
  Slide,
  Slider,
} from "../../../../src";

import ChainLink from "../ChainLink";
import s from "../../style.scss";

const Example3 = (): React.ReactElement => (
  <CarouselProvider
    visibleSlides={2}
    totalSlides={1}
    step={2}
    naturalSlideWidth={400}
    naturalSlideHeight={500}
  >
    <h2 id="example3" className={s.headline}>
      Carousel (Just One Image)
      <a href="#example3" aria-label="Jump to example3">
        <ChainLink />
      </a>
    </h2>
    <p>Single image</p>
    <Slider className={s.slider}>
      <Slide tag="a" index={0}>
        <ImageWithZoom src="./media/img01.jpeg" />
      </Slide>
    </Slider>
    <ButtonFirst>First</ButtonFirst>
    <ButtonBack>Back</ButtonBack>
    <ButtonNext>Next</ButtonNext>
    <ButtonLast>Last</ButtonLast>
    <DotGroup />
  </CarouselProvider>
);

export default Example3;
