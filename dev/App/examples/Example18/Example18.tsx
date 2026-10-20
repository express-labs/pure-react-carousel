import React, { useContext, useEffect, useRef, useState } from "react";
import {
  ButtonBack,
  ButtonFirst,
  ButtonLast,
  ButtonNext,
  ButtonPlay,
  CarouselContext,
  CarouselProvider,
  DotGroup,
  Image,
  Slide,
  Slider,
} from "../../../../src";
import ChainLink from "../ChainLink";
import s from "../../style.scss";
import customStyles from "./Example18.scss";

interface SlideData {
  index: number;
  image: string;
}

const SLIDES: SlideData[] = [
  { index: 0, image: "./media/img01.jpeg" },
  { index: 1, image: "./media/img02.jpeg" },
  { index: 2, image: "./media/img03.jpeg" },
  { index: 3, image: "./media/img04.jpeg" },
  { index: 4, image: "./media/img05.jpeg" },
  { index: 5, image: "./media/img06.jpeg" },
  { index: 6, image: "./media/img07.jpeg" },
  { index: 7, image: "./media/img08.jpeg" },
];

interface BreakpointRule {
  name: string;
  minWidth: number;
  visibleSlides: number;
}

const BREAKPOINTS: BreakpointRule[] = [
  { name: "Desktop (Wide)", minWidth: 900, visibleSlides: 4 },
  { name: "Tablet (Landscape)", minWidth: 680, visibleSlides: 3 },
  { name: "Tablet (Portrait)", minWidth: 460, visibleSlides: 2 },
  { name: "Mobile", minWidth: 0, visibleSlides: 1 },
];

function getBreakpointForWidth(width: number): BreakpointRule {
  for (let i = 0; i < BREAKPOINTS.length; i += 1) {
    if (width >= BREAKPOINTS[i].minWidth) {
      return BREAKPOINTS[i];
    }
  }
  return BREAKPOINTS[BREAKPOINTS.length - 1];
}

interface SlideStateSubscriberProps {
  onSlideChange: (slide: number) => void;
  onPlayingChange: (playing: boolean) => void;
  visibleSlides: number;
  totalSlides: number;
}

const SlideStateSubscriber = ({
  onSlideChange,
  onPlayingChange,
  visibleSlides,
  totalSlides,
}: SlideStateSubscriberProps) => {
  const store = useContext(CarouselContext);
  const prevVisibleSlidesRef = useRef(visibleSlides);

  useEffect(() => {
    if (!store) return undefined;

    // When visibleSlides changes across breakpoints, snap currentSlide to nearest page boundary
    if (prevVisibleSlidesRef.current !== visibleSlides) {
      prevVisibleSlidesRef.current = visibleSlides;
      const current = store.state.currentSlide;
      const snapped = Math.floor(current / visibleSlides) * visibleSlides;
      const maxSlide = Math.max(totalSlides - visibleSlides, 0);
      const targetSlide = Math.min(snapped, maxSlide);

      if (targetSlide !== current) {
        store.setStoreState({
          currentSlide: targetSlide,
          disableAnimation: true,
          privateUnDisableAnimation: true,
        });
      }
    }

    const onStateChange = (): void => {
      onSlideChange(store.state.currentSlide);
      onPlayingChange(store.state.isPlaying);
    };

    onStateChange();
    store.subscribe(onStateChange);
    return () => {
      store.unsubscribe(onStateChange);
    };
  }, [store, visibleSlides, totalSlides, onSlideChange, onPlayingChange]);

  return null;
};

const Example18 = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState<number>(0);
  const [isResizing, setIsResizing] = useState<boolean>(false);
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [stepMode, setStepMode] = useState<"page" | "single">("page");
  const [manualWidthOverride, setManualWidthOverride] = useState<number | null>(null);

  const resizeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const element = containerRef.current;
    if (!element) return undefined;

    const handleWidthChange = (width: number): void => {
      setContainerWidth(Math.round(width));
      setIsResizing(true);

      if (resizeTimeoutRef.current !== null) {
        clearTimeout(resizeTimeoutRef.current);
      }
      resizeTimeoutRef.current = setTimeout(() => {
        setIsResizing(false);
      }, 160);
    };

    if (typeof ResizeObserver !== "undefined") {
      const observer = new ResizeObserver((entries) => {
        for (let i = 0; i < entries.length; i += 1) {
          const entry = entries[i];
          if (entry.contentBoxSize && entry.contentBoxSize.length > 0) {
            handleWidthChange(entry.contentBoxSize[0].inlineSize);
          } else {
            handleWidthChange(entry.contentRect.width);
          }
        }
      });
      observer.observe(element);
      return () => {
        observer.disconnect();
        if (resizeTimeoutRef.current !== null) {
          clearTimeout(resizeTimeoutRef.current);
        }
      };
    }

    const onWindowResize = (): void => {
      if (element) {
        handleWidthChange(element.getBoundingClientRect().width);
      }
    };
    window.addEventListener("resize", onWindowResize);
    onWindowResize();

    return () => {
      window.removeEventListener("resize", onWindowResize);
      if (resizeTimeoutRef.current !== null) {
        clearTimeout(resizeTimeoutRef.current);
      }
    };
  }, []);

  const effectiveWidth =
    manualWidthOverride !== null
      ? containerWidth > 0
        ? Math.min(manualWidthOverride, containerWidth)
        : manualWidthOverride
      : containerWidth > 0
        ? containerWidth
        : 1000;
  const currentBreakpoint = getBreakpointForWidth(effectiveWidth);
  const visibleSlides = currentBreakpoint.visibleSlides;
  const step = stepMode === "page" ? visibleSlides : 1;

  const triggerResizeTransient = (): void => {
    setIsResizing(true);
    if (resizeTimeoutRef.current !== null) {
      clearTimeout(resizeTimeoutRef.current);
    }
    resizeTimeoutRef.current = setTimeout(() => {
      setIsResizing(false);
    }, 160);
  };

  const handlePreset = (width: number | null): void => {
    setManualWidthOverride(width);
    triggerResizeTransient();
  };

  const handleSliderChange = (ev: React.ChangeEvent<HTMLInputElement>): void => {
    const val = Number(ev.target.value);
    setManualWidthOverride(val);
    triggerResizeTransient();
  };

  return (
    <div ref={containerRef} className={customStyles.responsiveExampleWrapper}>
      <h2 id="example18" className={s.headline}>
        Responsive Viewport-Adaptive Carousel (Dynamic <code>visibleSlides</code> &amp;{" "}
        <code>step</code>)
        <a href="#example18" aria-label="Jump to example18">
          <ChainLink />
        </a>
      </h2>
      <p>
        Demonstrates a fully supported responsive carousel where <code>visibleSlides</code> and{" "}
        <code>step</code> dynamically adapt as the viewport or container resizes.
      </p>

      <div className={customStyles.controlsPanel}>
        <div className={customStyles.controlsRow}>
          <span className={customStyles.controlsLabel}>Container Width:</span>
          <button
            type="button"
            className={`${customStyles.presetBtn} ${
              manualWidthOverride === null ? customStyles.presetBtnActive : ""
            }`}
            data-testid="preset-fluid"
            onClick={() => handlePreset(null)}
          >
            Fluid (100%)
          </button>
          <button
            type="button"
            className={`${customStyles.presetBtn} ${
              manualWidthOverride === 360 ? customStyles.presetBtnActive : ""
            }`}
            data-testid="preset-mobile"
            onClick={() => handlePreset(360)}
          >
            Mobile (360px)
          </button>
          <button
            type="button"
            className={`${customStyles.presetBtn} ${
              manualWidthOverride === 580 ? customStyles.presetBtnActive : ""
            }`}
            data-testid="preset-tablet-port"
            onClick={() => handlePreset(580)}
          >
            Tablet Portrait (580px)
          </button>
          <button
            type="button"
            className={`${customStyles.presetBtn} ${
              manualWidthOverride === 780 ? customStyles.presetBtnActive : ""
            }`}
            data-testid="preset-tablet-land"
            onClick={() => handlePreset(780)}
          >
            Tablet Landscape (780px)
          </button>
          <button
            type="button"
            className={`${customStyles.presetBtn} ${
              manualWidthOverride === 980 ? customStyles.presetBtnActive : ""
            }`}
            data-testid="preset-desktop"
            onClick={() => handlePreset(980)}
          >
            Desktop (980px)
          </button>
        </div>

        <div className={customStyles.controlsRow}>
          <label htmlFor="manual-width-slider" className={customStyles.controlsLabel}>
            Custom Slider:
          </label>
          <input
            id="manual-width-slider"
            data-testid="manual-width-slider"
            type="range"
            min={320}
            max={1000}
            step={10}
            value={manualWidthOverride ?? (containerWidth || 1000)}
            onChange={handleSliderChange}
            className={customStyles.sliderInput}
          />
          <span>{manualWidthOverride !== null ? `${manualWidthOverride}px` : "Auto"}</span>
        </div>

        <div className={customStyles.controlsRow}>
          <span className={customStyles.controlsLabel}>Stepping Mode:</span>
          <label htmlFor="step-mode-page">
            <input
              id="step-mode-page"
              data-testid="step-mode-page"
              type="radio"
              name="stepMode"
              value="page"
              checked={stepMode === "page"}
              onChange={() => setStepMode("page")}
            />
            &nbsp;Page-by-Page (<code>step = visibleSlides</code>)
          </label>
          &nbsp;&nbsp;
          <label htmlFor="step-mode-single">
            <input
              id="step-mode-single"
              data-testid="step-mode-single"
              type="radio"
              name="stepMode"
              value="single"
              checked={stepMode === "single"}
              onChange={() => setStepMode("single")}
            />
            &nbsp;Single Item (<code>step = 1</code>)
          </label>
        </div>

        <div className={customStyles.metricsGrid}>
          <div className={customStyles.metricCard}>
            <div className={customStyles.metricTitle}>Observed Width</div>
            <div className={customStyles.metricValue} data-testid="metric-width">
              {effectiveWidth}px
            </div>
          </div>
          <div className={customStyles.metricCard}>
            <div className={customStyles.metricTitle}>Active Breakpoint</div>
            <div className={customStyles.metricValue} data-testid="metric-breakpoint">
              {currentBreakpoint.name}
            </div>
          </div>
          <div className={customStyles.metricCard}>
            <div className={customStyles.metricTitle}>Visible Slides</div>
            <div className={customStyles.metricValue} data-testid="metric-visible-slides">
              {visibleSlides}
            </div>
          </div>
          <div className={customStyles.metricCard}>
            <div className={customStyles.metricTitle}>Step Value</div>
            <div className={customStyles.metricValue} data-testid="metric-step">
              {step}
            </div>
          </div>
          <div className={customStyles.metricCard}>
            <div className={customStyles.metricTitle}>Current Slide</div>
            <div className={customStyles.metricValue} data-testid="metric-current-slide">
              {currentSlide + 1} / {SLIDES.length}
            </div>
          </div>
          <div className={customStyles.metricCard}>
            <div className={customStyles.metricTitle}>Tray Animation</div>
            <div className={customStyles.metricValue} data-testid="metric-animation">
              {isResizing ? "Suppressed" : "Active"}
            </div>
          </div>
          <div className={customStyles.metricCard}>
            <div className={customStyles.metricTitle}>Autoplay</div>
            <div className={customStyles.metricValue} data-testid="metric-autoplay">
              {isPlaying ? "Playing" : "Stopped"}
            </div>
          </div>
        </div>
      </div>

      <div
        className={customStyles.carouselContainer}
        style={{
          width: manualWidthOverride !== null ? `${manualWidthOverride}px` : "100%",
          maxWidth: "100%",
          transition: manualWidthOverride !== null ? "width 180ms ease" : "none",
        }}
      >
        <CarouselProvider
          visibleSlides={visibleSlides}
          totalSlides={SLIDES.length}
          step={step}
          interval={3000}
          naturalSlideWidth={400}
          naturalSlideHeight={500}
          disableAnimation={isResizing}
          hasMasterSpinner
        >
          <SlideStateSubscriber
            onSlideChange={setCurrentSlide}
            onPlayingChange={setIsPlaying}
            visibleSlides={visibleSlides}
            totalSlides={SLIDES.length}
          />
          <Slider>
            {SLIDES.map((slide) => (
              <Slide key={slide.index} index={slide.index}>
                <div className={customStyles.slideContent}>
                  <div className={customStyles.slideBadge}>
                    Slide {slide.index + 1} of {SLIDES.length}
                  </div>
                  <Image hasMasterSpinner src={slide.image} alt={`Cat ${slide.index + 1}`} />
                </div>
              </Slide>
            ))}
          </Slider>
          <div className={customStyles.carouselControls}>
            <div className={customStyles.buttonGroup}>
              <ButtonFirst className={customStyles.navButton}>First</ButtonFirst>
              <ButtonBack className={customStyles.navButton}>Back</ButtonBack>
            </div>
            <div className={customStyles.dotGroupWrapper}>
              <DotGroup className={customStyles.dotGroup} dotNumbers />
            </div>
            <div className={customStyles.buttonGroup}>
              <ButtonNext className={customStyles.navButton}>Next</ButtonNext>
              <ButtonLast className={customStyles.navButton}>Last</ButtonLast>
            </div>
            <div className={customStyles.buttonGroup}>
              <ButtonPlay
                className={customStyles.navButton}
                data-testid="autoplay-start-btn"
                disabled={isPlaying}
              >
                Start Autoplay
              </ButtonPlay>
              <ButtonPlay
                className={customStyles.navButton}
                data-testid="autoplay-stop-btn"
                disabled={!isPlaying}
              >
                Stop Autoplay
              </ButtonPlay>
            </div>
          </div>
        </CarouselProvider>
      </div>
    </div>
  );
};

export default Example18;
