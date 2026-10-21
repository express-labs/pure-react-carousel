import React, { useState } from "react";
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

const SLIDES = [
  { index: 0, image: "./media/img01.jpeg", title: "Slide 1" },
  { index: 1, image: "./media/img02.jpeg", title: "Slide 2" },
  { index: 2, image: "./media/img03.jpeg", title: "Slide 3" },
  { index: 3, image: "./media/img04.jpeg", title: "Slide 4" },
  { index: 4, image: "./media/img05.jpeg", title: "Slide 5" },
  { index: 5, image: "./media/img06.jpeg", title: "Slide 6" },
];

const Example15 = () => {
  const [threshold, setThreshold] = useState<number>(5);
  const [clickCount, setClickCount] = useState<number>(0);
  const [lastAction, setLastAction] = useState<string>("No slide buttons or links clicked yet.");

  const handleThresholdChange = (ev: React.ChangeEvent<HTMLInputElement>): void => {
    const parsed = Number(ev.target.value);
    setThreshold(Number.isNaN(parsed) || parsed < 0 ? 0 : parsed);
  };

  const recordClick = (label: string): void => {
    setClickCount((prev) => {
      const next = prev + 1;
      setLastAction(`${label} (total clicks: ${next})`);
      return next;
    });
  };

  const handleReset = (): void => {
    setClickCount(0);
    setLastAction("No slide buttons or links clicked yet.");
  };

  return (
    <CarouselProvider
      visibleSlides={2}
      totalSlides={SLIDES.length}
      step={1}
      naturalSlideWidth={400}
      naturalSlideHeight={500}
    >
      <h2 id="example15" className={s.headline}>
        Interactive Slide Elements (<code>dragClickThreshold</code>)
        <a href="#example15" aria-label="Jump to example15">
          <ChainLink />
        </a>
      </h2>
      <p>
        Each slide below contains a <code>&lt;button&gt;</code> and an <code>&lt;a&gt;</code> link.
        Clicking an element fires its <code>onClick</code> handler, whereas pressing on a button or
        link and dragging the slider beyond <code>dragClickThreshold</code> pixels suppresses the
        click so you can drag the carousel without accidentally triggering slide actions.
      </p>
      <p>
        <label htmlFor="drag-click-threshold-input">
          <code>dragClickThreshold</code> (px):&nbsp;
          <input
            id="drag-click-threshold-input"
            data-testid="drag-click-threshold-input"
            type="number"
            min={0}
            max={200}
            value={threshold}
            onChange={handleThresholdChange}
          />
        </label>
        &nbsp;&nbsp;
        <button type="button" data-testid="reset-click-log" onClick={handleReset}>
          Reset Log
        </button>
      </p>
      <p data-testid="interactive-click-log">
        <strong>Last Action ({clickCount}):</strong> {lastAction}
      </p>
      <Slider className={s.slider} dragClickThreshold={threshold}>
        {SLIDES.map((slide) => (
          <Slide key={slide.index} index={slide.index}>
            <div style={{ position: "relative", width: "100%", height: "100%" }}>
              <Image src={slide.image} alt={slide.title} />
              <div
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  right: 0,
                  padding: "12px",
                  background: "rgba(55, 55, 55, 0.85)",
                  display: "flex",
                  gap: "8px",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <button
                  type="button"
                  data-testid={`slide-action-btn-${slide.index}`}
                  onClick={() => recordClick(`Clicked button on ${slide.title}`)}
                  style={{
                    padding: "0.8rem 1.2rem",
                    minBlockSize: "3.6rem",
                    fontSize: "1.5rem",
                    cursor: "pointer",
                  }}
                >
                  Action: {slide.title}
                </button>
                <a
                  href="#example--15"
                  data-testid={`slide-action-link-${slide.index}`}
                  onClick={(ev) => {
                    ev.preventDefault();
                    recordClick(`Clicked link on ${slide.title}`);
                  }}
                  style={{
                    color: "#ffffff",
                    padding: "0.8rem 1.2rem",
                    minBlockSize: "3.6rem",
                    display: "inline-flex",
                    alignItems: "center",
                    fontSize: "1.5rem",
                    fontWeight: 700,
                    textDecoration: "underline",
                  }}
                >
                  Link: {slide.title}
                </a>
              </div>
            </div>
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

export default Example15;
