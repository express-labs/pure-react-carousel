import React from "react";
import ButtonBack from "../ButtonBack/ButtonBack";
import ButtonFirst from "../ButtonFirst/ButtonFirst";
import ButtonLast from "../ButtonLast/ButtonLast";
import ButtonNext from "../ButtonNext/ButtonNext";
import ButtonPlay from "../ButtonPlay/ButtonPlay";
import CarouselProvider from "../CarouselProvider/CarouselProvider";
import Dot from "../Dot/Dot";
import DotGroup from "../DotGroup/DotGroup";
import Image from "../Image/Image";
import ImageWithZoom from "../ImageWithZoom/ImageWithZoom";
import Slide from "../Slide/Slide";
import Slider from "../Slider/Slider";
import Spinner from "../Spinner/Spinner";
import Store from "../Store/Store";

export const createComponentConfig = () => ({
  ButtonBack: {
    component: ButtonBack,
    props: {
      children: "hello",
      currentSlide: 1,
      step: 1,
      carouselStore: new Store({}),
      totalSlides: 3,
      visibleSlides: 2,
    },
  },
  ButtonFirst: {
    component: ButtonFirst,
    props: {
      children: "hello",
      currentSlide: 1,
      carouselStore: new Store({
        currentSlide: 1,
        totalSlides: 7,
        visibleSlides: 1,
      }),
      totalSlides: 7,
    },
  },
  ButtonLast: {
    component: ButtonLast,
    props: {
      children: "hello",
      currentSlide: 1,
      carouselStore: new Store({
        currentSlide: 1,
        totalSlides: 7,
        visibleSlides: 1,
      }),
      totalSlides: 7,
      visibleSlides: 1,
    },
  },
  ButtonNext: {
    component: ButtonNext,
    props: {
      children: "hello",
      currentSlide: 1,
      step: 1,
      carouselStore: new Store({}),
      totalSlides: 3,
      visibleSlides: 2,
    },
  },
  ButtonPlay: {
    component: ButtonPlay,
    props: {
      carouselStore: new Store({
        isPlaying: false,
      }),
      children: <span className="children">Sup?</span>,
      childrenPaused: <span className="play">Play</span>,
      childrenPlaying: <span className="pause">Pause</span>,
      isPlaying: false,
    },
  },
  CarouselProvider: {
    component: CarouselProvider,
    props: {
      children: "hello",
      naturalSlideHeight: 125,
      naturalSlideWidth: 100,
      totalSlides: 1,
    },
  },
  Dot: {
    component: Dot,
    props: {
      children: "hello",
      currentSlide: 0,
      slide: 2,
      carouselStore: new Store({
        currentSlide: 0,
        totalSlides: 10,
        visibleSlides: 2,
      }),
      totalSlides: 10,
      visibleSlides: 2,
    },
  },
  DotGroup: {
    component: DotGroup,
    props: {
      currentSlide: 1,
      carouselStore: new Store({}),
      totalSlides: 3,
      visibleSlides: 2,
    },
  },
  Image: {
    component: Image,
    props: {
      hasMasterSpinner: false,
      orientation: "horizontal" as const,
      src: "bob.jpg",
      carouselStore: new Store({}),
    },
  },
  ImageWithZoom: {
    component: ImageWithZoom,
    props: {
      carouselStore: new Store({}),
      src: "bob.jpg",
    },
  },
  Slide: {
    component: Slide,
    props: {
      currentSlide: 1,
      index: 1,
      naturalSlideHeight: 400,
      naturalSlideWidth: 300,
      orientation: "horizontal" as const,
      slideSize: 25,
      totalSlides: 4,
      visibleSlides: 2,
    },
  },
  Slider: {
    component: Slider,
    props: {
      carouselStore: new Store({
        currentSlide: 0,
      }),
      children: "hello",
      currentSlide: 0,
      disableAnimation: false,
      disableKeyboard: false,
      dragEnabled: true,
      hasMasterSpinner: false,
      interval: 5000,
      infinite: false,
      isPageScrollLocked: false,
      isPlaying: false,
      lockOnWindowScroll: false,
      masterSpinnerFinished: false,
      naturalSlideHeight: 100,
      naturalSlideWidth: 100,
      orientation: "horizontal" as const,
      playDirection: "forward" as const,
      slideSize: 50,
      slideTraySize: 250,
      step: 2,
      totalSlides: 5,
      touchEnabled: true,
      visibleSlides: 2,
    },
  },
  Spinner: {
    component: Spinner,
    props: {},
  },
});

export default createComponentConfig();
