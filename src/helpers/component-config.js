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
      store: new Store({}),
    },
  },
  ButtonFirst: {
    component: ButtonFirst,
    props: {
      children: 'hello',
      currentSlide: 1,
      store: new Store({}),
      totalSlides: 3,
    },
  },
  ButtonLast: {
    component: ButtonLast,
    props: {
      children: 'hello',
      currentSlide: 1,
      store: new Store({}),
      totalSlides: 3,
      visibleSlides: 2,
    },
  },
  ButtonNext: {
    component: ButtonNext,
    props: {
      children: 'hello',
      currentSlide: 1,
      step: 1,
      store: new Store({}),
      totalSlides: 3,
      visibleSlides: 2,
    },
  },
  CarouselProvider: {
    component: CarouselProvider,
    props: {
      children: 'hello',
    },
  },
  Dot: {
    component: Dot,
    props: {
      children: 'hello',
      slide: 1,
      store: new Store({}),
    },
  },
  DotGroup: {
    component: DotGroup,
    props: {
      currentSlide: 1,
      store: new Store({}),
      totalSlides: 3,
      visibleSlides: 2,
    },
  },
  Image: {
    component: Image,
    props: {
      hasMasterSpinner: false,
      naturalSlideHeight: 400,
      naturalSlideWidth: 300,
      orientation: 'horizontal',
      src: 'bob.jpg',
      store: new Store({}),
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
      currentSlide: 1,
      hasMasterSpinner: false,
      masterSpinnerErrorCount: 0,
      masterSpinnerSuccessCount: 0,
      masterSpinnerSubscriptionCount: 0,
      naturalSlideHeight: 400,
      naturalSlideWidth: 300,
      orientation: 'horizontal',
      slideTraySize: 200,
      slideSize: 25,
      store: new Store({}),
      totalSlides: 4,
      touchEnabled: false,
      visibleSlides: 1,
    },
  },
  Spinner: {
    component: Spinner,
    props: {},
  },
};
