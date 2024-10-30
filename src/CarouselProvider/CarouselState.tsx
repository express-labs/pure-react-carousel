import React from 'react';
import { ActionDispatch, ActionTypes, CarouselStore } from './CarouselContext';
import {
  computeCurrentSlideWhileScrolling,
  computeCurrentVisibleSlides,
  computeSlidesRemaining,
  updateSlidePosition,
} from '../helpers';

export function reducer(
  state: CarouselStore,
  action: ActionDispatch
): CarouselStore {
  Object.freeze(state);
  const { type, payload = {}, log = '' } = action;
  console.log(`${log}${log && ' '}${type}:`, payload);

  switch (type) {
    case ActionTypes.FIRST_RENDER: {
      return {
        ...state,
        ...payload,
      };
    }
    case ActionTypes.BTN_ONCLICK: {
      const [
        slidesRemainingBackward,
        slidesRemainingForward,
        currentVisibleSlides,
      ] = updateSlidePosition(
        state.totalSlides,
        state.visibleSlides,
        payload.currentSlide
      );
      return {
        ...state,
        currentSlide: payload.currentSlide,
        currentVisibleSlides,
        isPlaying: false,
        slidesRemainingForward,
        slidesRemainingBackward,
      };
    }
    case ActionTypes.BTN_PLAY: {
      return {
        ...state,
        isPlaying: true,
      };
    }
    case ActionTypes.SCROLL_START: {
      return {
        ...state,
        isPlaying: false,
        isScrolling: true,
      };
    }
    case ActionTypes.SCROLL_END: {
      const { scrollLeft, scrollTop } = payload;
      const { orientation, slideSize, totalSlides, visibleSlides } = state;

      const currentSlide = computeCurrentSlideWhileScrolling({
        orientation,
        scrollLeft,
        scrollTop,
        slideSize,
      });

      const [slidesRemainingBackward, slidesRemainingForward] =
        computeSlidesRemaining({ currentSlide, totalSlides, visibleSlides });

      const currentVisibleSlides = computeCurrentVisibleSlides({
        currentSlide,
        visibleSlides,
        totalSlides,
      });

      console.log(
        'currentSlide',
        currentSlide,
        'currentVisibleSlides',
        currentVisibleSlides
      );

      return {
        ...state,
        currentSlide,
        slidesRemainingBackward,
        slidesRemainingForward,
        currentVisibleSlides,
        isScrolling: false,
      };
    }
    case ActionTypes.UPDATE_SIZES: {
      return {
        ...state,
        slideSize: payload.slideSize,
        slideTraySize: payload.slideTraySize,
        orientation: payload.orientation,
      };
    }
    default:
      return { ...state };
  }
}
