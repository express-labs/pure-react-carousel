import React from "react";
import {
  ButtonBack,
  ButtonNext,
  CarouselProvider,
  DotGroup,
  ImageWithZoom,
  Slide,
  Slider,
} from "../../../../src";

import ChainLink from "../ChainLink";
import s from "../../style.scss";
import customStyles from "./Example6.scss";

const Example6 = (): React.ReactElement => (
  <CarouselProvider
    visibleSlides={3}
    totalSlides={6}
    step={3}
    naturalSlideWidth={400}
    naturalSlideHeight={500}
    hasMasterSpinner
  >
    <h2 id="example6" className={s.headline}>
      Simple Carousel with vertically aligned nav buttons
      <a href="#example6" aria-label="Jump to example6">
        <ChainLink />
      </a>
    </h2>
    <p>
      Wrap the &lt;Slider /&gt;, &lt;ButtonBack /&gt;, &lt;ButtonNext /&gt; components in a div with
      relative positioning. Add absolute positioning to the buttons.
    </p>
    <div className={customStyles.container}>
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
      <ButtonBack className={customStyles.buttonBack}>Back</ButtonBack>
      <ButtonNext className={customStyles.buttonNext}>Next</ButtonNext>
    </div>
    <DotGroup className={customStyles.dotGroup} />
  </CarouselProvider>
);

export default Example6;
