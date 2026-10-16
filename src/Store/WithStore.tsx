import React, { memo, useContext } from "react";
import { CarouselContext } from "../CarouselProvider/context";
import { equal } from "../helpers";
import type {
  CarouselInjectedProps,
  CarouselState,
  CarouselStoreInterface,
  MapStateToProps,
  WithStoreProps,
} from "../types";

export type { WithStoreProps } from "../types";

function shallowEqual(objA: Record<string, unknown>, objB: Record<string, unknown>): boolean {
  if (Object.is(objA, objB)) return true;
  const keysA = Object.keys(objA);
  const keysB = Object.keys(objB);
  if (keysA.length !== keysB.length) return false;
  for (let i = 0; i < keysA.length; i += 1) {
    const key = keysA[i];
    if (!Object.prototype.hasOwnProperty.call(objB, key) || !Object.is(objA[key], objB[key])) {
      return false;
    }
  }
  return true;
}

interface MemoizedPresenterProps<T> {
  ownProps: Record<string, unknown>;
  stateProps: T;
  carouselStore: CarouselStoreInterface;
}

export default function WithStore<P extends object, T = Record<never, never>>(
  WrappedComponent: React.ComponentType<P>,
  mapStateToProps?: MapStateToProps<T>,
): React.ComponentType<WithStoreProps<P, T>>;
export default function WithStore<CustomProps, CustomStateProps = Record<never, never>>(
  WrappedComponent: React.ComponentType<CustomProps & CustomStateProps & CarouselInjectedProps>,
  mapStateToProps?: MapStateToProps<CustomStateProps>,
): React.ComponentType<CustomProps>;
export default function WithStore<
  P extends object = Record<string, unknown>,
  T = Record<never, never>,
>(
  WrappedComponent: React.ComponentType<P>,
  mapStateToProps: (state: CarouselState) => T = () => ({}) as T,
): React.ComponentType<WithStoreProps<P, T>> {
  const MemoizedComponent = memo(
    ({ ownProps, stateProps, carouselStore }: MemoizedPresenterProps<T>) => {
      const mergedProps = {
        ...stateProps,
        ...ownProps,
        carouselStore,
      } as unknown as P;

      return <WrappedComponent {...mergedProps} />;
    },
    (prev, next) =>
      prev.carouselStore === next.carouselStore &&
      shallowEqual(prev.ownProps, next.ownProps) &&
      equal(prev.stateProps, next.stateProps),
  );

  function Wrapper(props: WithStoreProps<P, T>) {
    const contextStore = useContext(CarouselContext);
    const propStore = (props as Record<string, unknown>).carouselStore as
      | CarouselStoreInterface
      | undefined;
    const activeStore = propStore || contextStore;
    const carouselStore = activeStore.masterStore || activeStore;
    const rawState = activeStore.state || contextStore.state;
    const stateProps = mapStateToProps({ ...rawState });

    return (
      <MemoizedComponent
        ownProps={props as Record<string, unknown>}
        stateProps={stateProps}
        carouselStore={carouselStore}
      />
    );
  }

  Wrapper.displayName = `WithStore(${
    WrappedComponent.displayName || WrappedComponent.name || "Component"
  })`;

  return Wrapper;
}
