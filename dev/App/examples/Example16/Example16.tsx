import React, { useState } from "react";
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
import customStyles from "./Example16.scss";

const SLIDES = [
  { index: 0, image: "./media/img01.jpeg" },
  { index: 1, image: "./media/img02.jpeg" },
  { index: 2, image: "./media/img03.jpeg" },
  { index: 3, image: "./media/img04.jpeg" },
  { index: 4, image: "./media/img05.jpeg" },
  { index: 5, image: "./media/img06.jpeg" },
];

const Example16 = () => {
  const [disableAnimation, setDisableAnimation] = useState<boolean>(true);

  return (
    <CarouselProvider
      visibleSlides={1}
      totalSlides={SLIDES.length}
      step={1}
      naturalSlideWidth={400}
      naturalSlideHeight={500}
      disableAnimation={disableAnimation}
      touchEnabled
      dragEnabled
      hasMasterSpinner
    >
      <h2 id="example16" className={s.headline}>
        Carousel with Custom CSS Transitions (<code>disableAnimation</code>,{" "}
        <code>classNameAnimation</code>, <code>classNameVisible</code> /{" "}
        <code>classNameHidden</code>)
        <a href="#example16" aria-label="Jump to example16">
          <ChainLink />
        </a>
      </h2>
      <p>
        When <code>disableAnimation</code> is enabled on <code>&lt;CarouselProvider&gt;</code>, the
        built-in horizontal tray slide transition and live touch/mouse drag translation are both
        suppressed while swipe-to-advance remains active. Pairing this with{" "}
        <code>classNameVisible</code> and <code>classNameHidden</code> on <code>&lt;Slide&gt;</code>{" "}
        creates a smooth fade transition without the tray sliding left or right under your finger.
        Uncheck <code>disableAnimation</code> below to preview a custom tray transition via{" "}
        <code>&lt;Slider classNameAnimation=&quot;...&quot;&gt;</code>.
      </p>
      <p>
        <label htmlFor="disable-animation-toggle">
          <input
            id="disable-animation-toggle"
            data-testid="disable-animation-toggle"
            type="checkbox"
            checked={disableAnimation}
            onChange={(ev) => setDisableAnimation(ev.target.checked)}
          />
          &nbsp;Enable <code>disableAnimation</code> (suppress tray slide &amp; live drag
          translation for fade mode)
        </label>
      </p>
      <Slider className={s.slider} classNameAnimation={customStyles.customTrayAnimation}>
        {SLIDES.map((slide) => (
          <Slide
            key={slide.index}
            index={slide.index}
            classNameVisible={customStyles.slideVisible}
            classNameHidden={customStyles.slideHidden}
          >
            <ImageWithZoom src={slide.image} />
          </Slide>
        ))}
      </Slider>
      <ButtonFirst>First</ButtonFirst>
      <ButtonBack>Back</ButtonBack>
      <ButtonNext>Next</ButtonNext>
      <ButtonLast>Last</ButtonLast>
      <DotGroup dotNumbers />
    </CarouselProvider>
  );
};

export default Example16;
