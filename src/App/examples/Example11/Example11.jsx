import React from 'react';
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
} from '../../..';

import s from '../../style.scss';

function eventLogger(ev) {
  // eslint-disable-next-line no-console
  console.log(ev.type, ev.target);
}

export default () => (
  <CarouselProvider
    visibleSlides={2}
    totalSlides={6}
    naturalSlideWidth={400}
    naturalSlideHeight={500}
  >
    <h2 className={s.headline}>Carousel with custom event handlers.</h2>
    <p>
      Simple carousel with custom event handlers attachet to the
      {' '}
      <code>&lt;Slider /&gt;</code>
      {' '}
      component&apos;s
      {' '}
      <code>trayProps</code>
      {' '}
property. Open your browser devloper tools and look at
      the console log, then manipulate the carousel.
    </p>
    <Slider
      className={s.slider}
      trayProps={{
        // clipboard events? Sure why not.
        onCopy: eventLogger,
        onCut: eventLogger,
        onPaste: eventLogger,

        // composition events
        onCompositionEnd: eventLogger,
        onCompositionStart: eventLogger,
        onCompositionUpdate: eventLogger,

        // keyboard events
        onKeyDown: eventLogger,
        onKeyPress: eventLogger,
        onKeyUp: eventLogger,

        // focus events,
        onFocus: eventLogger,
        onBlur: eventLogger,

        // form events,
        onChange: eventLogger,
        onInput: eventLogger,
        onInvalid: eventLogger,
        onSubmit: eventLogger,

        // mouse events
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
        // onMouseMove: eventLogger,
        onMouseOut: eventLogger,
        onMouseOver: eventLogger,
        onMouseUp: eventLogger,

        // touch events
        onTouchCancel: eventLogger,
        onTouchEnd: eventLogger,
        // onTouchMove: eventLogger,
        onTouchStart: eventLogger,

        // pointer events
        onPointerDown: eventLogger,
        // onPointerMove: eventLogger,
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
