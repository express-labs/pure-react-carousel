import React from "react";
import {
  ButtonBack,
  ButtonFirst,
  ButtonLast,
  ButtonNext,
  CarouselProvider,
  DotGroup,
  Image,
  Slide,
  Slider,
} from "../../../../src";

import ChainLink from "../ChainLink";
import s from "../../style.scss";

function eventLogger(ev: React.SyntheticEvent): void {
  // eslint-disable-next-line no-console
  console.log(ev.type, ev.target);
}

const Example11 = (): React.ReactElement => (
  <CarouselProvider
    visibleSlides={2}
    totalSlides={6}
    naturalSlideWidth={400}
    naturalSlideHeight={500}
  >
    <h2 id="example11" className={s.headline}>
      Carousel with custom event handlers.
      <a href="#example11" aria-label="Jump to example11">
        <ChainLink />
      </a>
    </h2>
    <p>
      Simple carousel with custom event handlers attached to the <code>&lt;Slider /&gt;</code>{" "}
      component&apos;s <code>trayProps</code> property. Open your browser developer tools and look
      at the console log, then manipulate the carousel.
    </p>
    <Slider
      className={s.slider}
      trayProps={{
        onCopy: eventLogger,
        onCut: eventLogger,
        onPaste: eventLogger,
        onCompositionEnd: eventLogger,
        onCompositionStart: eventLogger,
        onCompositionUpdate: eventLogger,
        onKeyDown: eventLogger,
        onKeyPress: eventLogger,
        onKeyUp: eventLogger,
        onFocus: eventLogger,
        onBlur: eventLogger,
        onChange: eventLogger,
        onInput: eventLogger,
        onInvalid: eventLogger,
        onSubmit: eventLogger,
        onClick: eventLogger,
        onContextMenu: eventLogger,
        onDoubleClick: eventLogger,
        onDrag: eventLogger,
        onDragEnd: eventLogger,
        onDragEnter: eventLogger,
        onDragExit: eventLogger,
        onDragLeave: eventLogger,
        onDragOver: eventLogger,
        onDragStart: eventLogger,
        onDrop: eventLogger,
        onMouseDown: eventLogger,
        onMouseEnter: eventLogger,
        onMouseLeave: eventLogger,
        onMouseOut: eventLogger,
        onMouseOver: eventLogger,
        onMouseUp: eventLogger,
        onTouchCancel: eventLogger,
        onTouchEnd: eventLogger,
        onTouchStart: eventLogger,
        onPointerDown: eventLogger,
        onPointerUp: eventLogger,
        onPointerCancel: eventLogger,
        onGotPointerCapture: eventLogger,
        onLostPointerCapture: eventLogger,
        onPointerEnter: eventLogger,
        onPointerLeave: eventLogger,
        onPointerOver: eventLogger,
        onPointerOut: eventLogger,
        draggable: true,
      }}
    >
      <Slide tag="a" index={0}>
        <Image src="./media/img01.jpeg" />
      </Slide>
      <Slide tag="a" index={1}>
        <Image src="./media/img02.jpeg" />
      </Slide>
      <Slide tag="a" index={2}>
        <Image src="./media/img03.jpeg" />
      </Slide>
      <Slide tag="a" index={3}>
        <Image src="./media/img04.jpeg" />
      </Slide>
      <Slide tag="a" index={4}>
        <Image src="./media/img05.jpeg" />
      </Slide>
      <Slide tag="a" index={5}>
        <Image src="./media/img06.jpeg" />
      </Slide>
    </Slider>
    <ButtonFirst>First</ButtonFirst>
    <ButtonBack>Back</ButtonBack>
    <ButtonNext>Next</ButtonNext>
    <ButtonLast>Last</ButtonLast>
    <DotGroup dotNumbers />
  </CarouselProvider>
);

export default Example11;
