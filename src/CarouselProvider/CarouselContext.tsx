import { createContext } from 'react';

export interface CarouselStore {
  readonly currentSlide?: number;
  readonly currentVisibleSlides?: number[];
  readonly dragStep?: number;
  readonly interval?: number;
  readonly isInfinite?: boolean;
  readonly isPlaying?: boolean;
  readonly isScrolling?: boolean;
  readonly isScrollLockParent?: boolean;
  readonly isScrollLockWindow?: boolean;
  readonly orientation?: 'horizontal' | 'vertical';
  readonly playDirection?: 'right' | 'left' | 'up' | 'down';
  readonly slideSize?: number;
  readonly slidesRemainingBackward?: number;
  readonly slidesRemainingForward?: number;
  readonly slideTraySize?: number;
  readonly step?: number;
  readonly totalSlides?: number;
  readonly visibleSlides?: number;
}

export const CarouselStoreContext = createContext<CarouselStore>({});

export enum ActionTypes {
  FIRST_RENDER = 'first::render',
  BTN_ONCLICK = 'dot::onclick',
  BTN_PLAY = 'buttonPlay::play',
  SCROLL_END = 'scrollEnd',
  SCROLL_START = 'scrollStart',
  INIT_STATIC_WIDTHS = 'init::static',
  INIT_RESPONSIVE_WIDTHS = 'init::responsive',
  UPDATE_SIZES = 'update:sizes',
}

type ActionPayload = {
  [key: string]: any;
};

export interface ActionDispatch {
  type: ActionTypes;
  payload?: ActionPayload;
  log?: string;
}

export interface CarouselActionContextProps {
  readonly dispatch: React.Dispatch<ActionDispatch>;
}

export const CarouselActionContext = createContext<CarouselActionContextProps>({
  dispatch: () => {
    console.error(
      'Hello. You are seeing this error because one of your Pure React Carousel components is not a descendant of the CarouselProvider component.'
    );
  },
});
