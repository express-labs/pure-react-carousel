import * as React from "react";
import { memo, useContext } from "react";
import { CarouselContext } from "../CarouselProvider/context";
import { equal } from "../helpers";
import type {
  CarouselInjectedProps,
  CarouselState,
  CarouselStoreInterface,
  MapStateToProps,
  MemoizedPresenterProps,
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

export default function WithStore<P extends object, T = Record<never, never>>(
  WrappedComponent: React.ComponentType<P>,
  mapStateToProps?: MapStateToProps<T>,
): React.ComponentType<WithStoreProps<P, T>>;
export default function WithStore<CustomProps, CustomStateProps = Record<never, never>>(
  WrappedComponent: React.ComponentType<CustomProps & CustomStateProps & CarouselInjectedProps>,
  mapStateToProps?: MapStateToProps<CustomStateProps>,
): React.ComponentType<CustomProps>;
export default function WithStore<
  P extends Record<string, unknown> = Record<string, unknown>,
  T = Record<never, never>,
>(WrappedComponent: React.ElementType, mapStateToProps?: (state: CarouselState) => T) {
  const MemoizedComponent = memo(
    ({ ownProps, stateProps, carouselStore }: MemoizedPresenterProps<T | undefined>) => (
      <WrappedComponent {...stateProps} {...ownProps} carouselStore={carouselStore} />
    ),
    (prev, next) =>
      prev.carouselStore === next.carouselStore &&
      shallowEqual(prev.ownProps, next.ownProps) &&
      equal(prev.stateProps, next.stateProps),
  );

  function Wrapper(props: P & { carouselStore?: CarouselStoreInterface }) {
    const contextStore = useContext(CarouselContext);
    const propStore = props.carouselStore;
    const activeStore = propStore || contextStore;
    const carouselStore = activeStore.masterStore || activeStore;
    const rawState = activeStore.state || contextStore.state;
    const stateProps = mapStateToProps ? mapStateToProps({ ...rawState }) : undefined;

    return (
      <MemoizedComponent ownProps={props} stateProps={stateProps} carouselStore={carouselStore} />
    );
  }

  const componentName =
    typeof WrappedComponent === "string"
      ? WrappedComponent
      : WrappedComponent.displayName || WrappedComponent.name || "Component";
  Wrapper.displayName = `WithStore(${componentName})`;

  return Wrapper;
}
