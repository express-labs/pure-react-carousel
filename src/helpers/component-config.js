/* eslint {'import/no-named-as-default': 0, 'import/no-named-as-default-member': 0} */

import ButtonBack from '../ButtonBack/ButtonBack';
import ButtonFirst from '../ButtonFirst/ButtonFirst';
import ButtonLast from '../ButtonLast/ButtonLast';
import ButtonNext from '../ButtonNext/ButtonNext';
import CarouselProvider from '../CarouselProvider/CarouselProvider';
import Dot from '../Dot/Dot';
import DotGroup from '../DotGroup/DotGroup';
import Image from '../Image/Image';
import ImageWithZoom from '../ImageWithZoom/ImageWithZoom';
import Slide from '../Slide/Slide';
import Slider from '../Slider/Slider';
import Spinner from '../Spinner/Spinner';
import Store from '../Store/Store';

export default {
  ButtonBack: {
    component: ButtonBack,
    props: {
      children: 'hello',
      currentSlide: 1,
      step: 1,
      carouselStore: new Store({}),
    },
  },
  ButtonFirst: {
    component: ButtonFirst,
    props: {
      children: 'hello',
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
      children: 'hello',
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
      children: 'hello',
      currentSlide: 1,
      step: 1,
      carouselStore: new Store({}),
      totalSlides: 3,
      visibleSlides: 2,
    },
  },
  CarouselProvider: {
    component: CarouselProvider,
    props: {
      children: 'hello',
      naturalSlideHeight: 125,
      naturalSlideWidth: 100,
      totalSlides: 1,
    },
  },
  Dot: {
    component: Dot,
    props: {
      children: 'hello',
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
      orientation: 'horizontal',
      src: 'bob.jpg',
      carouselStore: new Store({}),
    },
  },
  ImageWithZoom: {
    component: ImageWithZoom,
    props: {
      src: 'bob.jpg',
    },
  },
  Slide: {
    component: Slide,
    props: {
      currentSlide: 1,
      index: 1,
      naturalSlideHeight: 400,
      naturalSlideWidth: 300,
      orientation: 'horizontal',
      slideSize: 25,
      totalSlides: 4,
      visibleSlides: 2,
    },
  },
  Slider: {
    component: Slider,
    props: {
      children: 'hello',
      currentSlide: 0,
      hasMasterSpinner: false,
      masterSpinnerFinished: false,
      naturalSlideHeight: 100,
      naturalSlideWidth: 100,
      orientation: 'horizontal',
      slideTraySize: 250,
      slideSize: 50,
      carouselStore: new Store({
        currentSlide: 0,
      }),
      totalSlides: 5,
      touchEnabled: true,
      visibleSlides: 2,
      lockOnWindowScroll: false,
    },
  },
  Spinner: {
    component: Spinner,
    props: {},
  },
};
