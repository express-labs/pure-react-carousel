import React, { useState } from "react";
import {
  ButtonBack,
  ButtonFirst,
  ButtonLast,
  ButtonNext,
  CarouselProvider,
  DotGroup,
  Image,
  NativeSlider,
  Slide,
  type ScrollSnapAlign,
  type ScrollSnapStop,
  type ScrollSnapType,
} from "../../../../src";

import ChainLink from "../ChainLink";
import s from "../../style.scss";

const SLIDES = [
  { index: 0, image: "./media/img01.jpeg" },
  { index: 1, image: "./media/img02.jpeg" },
  { index: 2, image: "./media/img03.jpeg" },
  { index: 3, image: "./media/img04.jpeg" },
  { index: 4, image: "./media/img05.jpeg" },
  { index: 5, image: "./media/img06.jpeg" },
];

const Example17 = () => {
  const [snapType, setSnapType] = useState<ScrollSnapType>("mandatory");
  const [snapAlign, setSnapAlign] = useState<ScrollSnapAlign>("start");
  const [snapStop, setSnapStop] = useState<ScrollSnapStop>("normal");
  const [hideScrollbar, setHideScrollbar] = useState<boolean>(true);
  const [visibleSlides, setVisibleSlides] = useState<number>(2);

  return (
    <CarouselProvider
      visibleSlides={visibleSlides}
      totalSlides={SLIDES.length}
      step={1}
      naturalSlideWidth={400}
      naturalSlideHeight={500}
      snapType={snapType}
      snapAlign={snapAlign}
      snapStop={snapStop}
      hasMasterSpinner
    >
      <h2 id="example17" className={s.headline}>
        Native CSS Scroll &amp; Scroll-Snap Carousel (<code>&lt;NativeSlider /&gt;</code>)
        <a href="#example17" aria-label="Jump to example17">
          <ChainLink />
        </a>
      </h2>
      <p>
        <code>&lt;NativeSlider /&gt;</code> uses native browser CSS overflow scrolling and CSS
        Scroll Snap while staying synchronized with <code>&lt;CarouselProvider /&gt;</code>,{" "}
        <code>&lt;ButtonBack /&gt;</code>, <code>&lt;ButtonNext /&gt;</code>, and{" "}
        <code>&lt;DotGroup /&gt;</code> via <code>IntersectionObserver</code>,{" "}
        <code>scrollsnapchange</code>, and <code>scrollend</code> events (without timers). Set{" "}
        <code>snapType=&quot;none&quot;</code> for free-momentum scrolling without snapping.
      </p>
      <p>
        <div className={s.controlGrid}>
          <div className={s.controlGridItem}>
            <label htmlFor="native-slider-snap-type">
              <code>snapType</code>:&nbsp;
              <select
                id="native-slider-snap-type"
                className={s.select}
                value={snapType}
                onChange={(ev) => setSnapType(ev.target.value as ScrollSnapType)}
              >
                <option value="mandatory">mandatory</option>
                <option value="proximity">proximity</option>
                <option value="none">none (free scroll)</option>
              </select>
            </label>
          </div>
          <div className={s.controlGridItem}>
            <label htmlFor="native-slider-snap-align">
              <code>snapAlign</code>:&nbsp;
              <select
                id="native-slider-snap-align"
                className={s.select}
                value={snapAlign}
                onChange={(ev) => setSnapAlign(ev.target.value as ScrollSnapAlign)}
              >
                <option value="start">start</option>
                <option value="center">center</option>
                <option value="end">end</option>
                <option value="none">none</option>
              </select>
            </label>
          </div>
          <div className={s.controlGridItem}>
            <label htmlFor="native-slider-snap-stop">
              <code>snapStop</code>:&nbsp;
              <select
                id="native-slider-snap-stop"
                className={s.select}
                value={snapStop}
                onChange={(ev) => setSnapStop(ev.target.value as ScrollSnapStop)}
              >
                <option value="normal">normal</option>
                <option value="always">always</option>
              </select>
            </label>
          </div>
          <div className={s.controlGridItem}>
            <label htmlFor="native-slider-visible-slides">
              <code>visibleSlides</code>:&nbsp;
              <select
                id="native-slider-visible-slides"
                className={s.select}
                value={visibleSlides}
                onChange={(ev) => setVisibleSlides(Number(ev.target.value))}
              >
                <option value={1}>1</option>
                <option value={2}>2</option>
                <option value={3}>3</option>
              </select>
            </label>
          </div>
          <div className={s.controlGridItem}>
            <label htmlFor="native-slider-hide-scrollbar">
              <input
                id="native-slider-hide-scrollbar"
                type="checkbox"
                checked={hideScrollbar}
                onChange={(ev) => setHideScrollbar(ev.target.checked)}
              />
              &nbsp;<code>hideScrollbar</code>
            </label>
          </div>
        </div>
      </p>
      <NativeSlider className={s.slider} hideScrollbar={hideScrollbar}>
        {SLIDES.map((slide) => (
          <Slide key={slide.index} index={slide.index}>
            <Image src={slide.image} alt={`Example slide ${slide.index + 1}`} hasMasterSpinner />
          </Slide>
        ))}
      </NativeSlider>
      <ButtonFirst>First</ButtonFirst>
      <ButtonBack>Back</ButtonBack>
      <ButtonNext>Next</ButtonNext>
      <ButtonLast>Last</ButtonLast>
      <DotGroup dotNumbers />
    </CarouselProvider>
  );
};

export default Example17;
