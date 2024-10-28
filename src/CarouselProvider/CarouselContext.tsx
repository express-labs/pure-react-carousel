import { createContext } from 'react';

export type CarouselStore = {
  readonly currentSlide?: number;
  readonly dragStep?: number;
  readonly interval?: number;
  readonly isAnimationEnabled?: boolean;
  readonly isInfinite?: boolean;
  readonly isKeyboardEnabled?: boolean;
  readonly isPlaying?: boolean;
  readonly isResponsive?: boolean;
  readonly isScrollLockParent?: boolean;
  readonly isScrollLockWindow?: boolean;
  readonly orientation?: 'horizontal' | 'vertical';
  readonly playDirection?: 'right' | 'left' | 'up' | 'down';
  readonly slidesRemainingForward?: number;
  readonly slidesRemainingBackward?: number;
  readonly slideSize?: number;
  readonly slideTraySize?: number;
  readonly step?: number;
  readonly totalSlides?: number;
  readonly visibleSlides?: number;
  readonly currentVisibleSlides?: number[];
};

export const CarouselStoreContext = createContext<CarouselStore>({});

export enum ActionTypes {
  BTN_ONCLICK = 'dot::onclick',
  BTN_PLAY = 'buttonPlay::play',
  SCROLL_END = 'scrollEnd',
  SCROLL_START = 'scrollStart',
  INIT_STATIC_WIDTHS = 'init::static',
  INIT_RESPONSIVE_WIDTHS = 'init::responsive',
}

export interface ActionDispatch {
  type: ActionTypes;
  payload?: Partial<CarouselStore>;
}

export interface CarouselActionContextProps {
  readonly dispatch: React.Dispatch<ActionDispatch>;
}

export const CarouselActionContext = createContext<CarouselActionContextProps>({
  dispatch: () => {},
});
