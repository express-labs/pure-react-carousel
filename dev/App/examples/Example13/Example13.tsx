import React from "react";
import {
  ButtonBack,
  ButtonFirst,
  ButtonLast,
  ButtonNext,
  CarouselProvider,
  Slide,
  Slider,
} from "../../../../src";

import ChainLink from "../ChainLink";
import s from "../../style.scss";

const Example13 = (): React.ReactElement => (
  <CarouselProvider
    visibleSlides={2}
    totalSlides={4}
    step={1}
    naturalSlideWidth={400}
    naturalSlideHeight={500}
    isIntrinsicHeight
  >
    <h2 id="example13" className={s.headline}>
      With intrinsic axis dimension
      <a href="#example13" aria-label="Jump to example13">
        <ChainLink />
      </a>
    </h2>
    <p />
    <Slider className={s.slider}>
      <Slide index={0} className={s.bordered}>
        <p>
          <strong>
            This is a test slide to demonstrate, how content affects the height of the slide.
          </strong>
        </p>
        <p>
          Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor
          invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et
          accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata
          sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing
          elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed
          diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd
          gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.
        </p>
      </Slide>
      <Slide index={1} className={s.bordered}>
        <p>
          <strong>
            This is a test slide to demonstrate, how content affects the height of the slide.
          </strong>
        </p>
        <p>
          Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor
          invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et
          accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata
          sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing
          elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed
          diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd
          gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.
        </p>
        <p>
          lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor
          invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. at vero eos et
          accusam et justo duo dolores et ea rebum. stet clita kasd gubergren, no sea takimata
          sanctus est lorem ipsum dolor sit amet. lorem ipsum dolor sit amet, consetetur sadipscing
          elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed
          diam voluptua. at vero eos et accusam et justo duo dolores et ea rebum. stet clita kasd
          gubergren, no sea takimata sanctus est lorem ipsum dolor sit amet.
        </p>
      </Slide>
      <Slide index={2} className={s.bordered}>
        <p>
          <strong>
            This is a test slide to demonstrate, how content affects the height of the slide.
          </strong>
        </p>
        <p>
          lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor
          invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. at vero eos et
          accusam et justo duo dolores et ea rebum. stet clita kasd gubergren, no sea takimata
          sanctus est lorem ipsum dolor sit amet. lorem ipsum dolor sit amet, consetetur sadipscing
          elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed
          diam voluptua. at vero eos et accusam et justo duo dolores et ea rebum. stet clita kasd
          gubergren, no sea takimata sanctus est lorem ipsum dolor sit amet.
        </p>
      </Slide>
      <Slide index={3} className={s.bordered}>
        <p>This is a test slide to demonstrate, how content affects the height of the slide.</p>
        <p>
          lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor
          invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. at vero eos et
          accusam et justo duo dolores et ea rebum. stet clita kasd gubergren, no sea takimata
          sanctus est lorem ipsum dolor sit amet. lorem ipsum dolor sit amet, consetetur sadipscing
          elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed
          diam voluptua. at vero eos et accusam et justo duo dolores et ea rebum. stet clita kasd
          gubergren, no sea takimata sanctus est lorem ipsum dolor sit amet.
        </p>
      </Slide>
    </Slider>
    <ButtonFirst>First</ButtonFirst>
    <ButtonBack>Back</ButtonBack>
    <ButtonNext>Next</ButtonNext>
    <ButtonLast>Last</ButtonLast>
  </CarouselProvider>
);

export default Example13;
