import React from "react";
import { render, screen, act } from "@testing-library/react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import Store from "../Store";
import WithStore from "../WithStore";
import CarouselProvider from "../../CarouselProvider";
import Slide from "../../Slide";
import { createComponentConfig } from "../../__tests__/component-config";

const CustomView = ({
  currentSlide,
  carouselStore,
}: {
  currentSlide: number;
  carouselStore: Store;
}): React.ReactElement => (
  <button
    type="button"
    onClick={() => carouselStore.setStoreState({ currentSlide: currentSlide + 1 })}
  >
    Slide: {currentSlide}
  </button>
);

describe("Store", () => {
  let carouselStore: Store;
  beforeEach(() => {
    carouselStore = new Store({});
  });

  it("subscribe(func) should append a function to the list of subscriptions", () => {
    const func = vi.fn();
    expect(carouselStore.subscriptions.length).toBe(0);
    carouselStore.subscribe(func);
    expect(carouselStore.subscriptions.length).toBe(1);
    expect(carouselStore.subscriptions.indexOf(func)).toBe(0);
  });

  it("unsubscribe(func) should remove a function from the list of subscriptions", () => {
    const func = vi.fn();
    carouselStore.subscriptions = [func];
    carouselStore.unsubscribe(func);
    expect(carouselStore.subscriptions.length).toBe(0);
  });

  it("unsubscribe(func) should NOT remove any function from the list if func is not on the list", () => {
    const func = vi.fn();
    const notFunc = vi.fn();
    carouselStore.subscriptions = [func];
    carouselStore.unsubscribe(notFunc);
    expect(carouselStore.subscriptions.length).toBe(1);
    expect(carouselStore.subscriptions.indexOf(func)).toBe(0);
  });

  it("updateSubscribers() should call each function on the list", () => {
    const func1 = vi.fn();
    const func2 = vi.fn();
    carouselStore.subscribe(func1);
    carouselStore.subscribe(func2);
    carouselStore.updateSubscribers();
    expect(func1).toHaveBeenCalledTimes(1);
    expect(func2).toHaveBeenCalledTimes(1);
  });

  it("updateSubscribers() should call any supplied callback after dispatching updates", () => {
    const callback = vi.fn();
    carouselStore.updateSubscribers(callback);
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it("subscribeMasterSpinner() should append a src to the list of masterSpinnerSubscriptions", () => {
    expect(carouselStore.masterSpinnerSubscriptions).toEqual({});
    carouselStore.subscribeMasterSpinner("/home/bob.jpg");
    expect(carouselStore.masterSpinnerSubscriptions["/home/bob.jpg"]).toEqual({
      success: false,
      error: false,
      complete: false,
    });
  });

  it("masterSpinnerSuccess() should set masterSpinnerSubscriptions[src].success and masterSpinnerSubscriptions[src].complete to true", () => {
    expect(carouselStore.masterSpinnerSubscriptions).toEqual({});
    carouselStore.subscribeMasterSpinner("/home/bob.jpg");
    expect(carouselStore.masterSpinnerSubscriptions["/home/bob.jpg"]).toEqual({
      success: false,
      error: false,
      complete: false,
    });
    carouselStore.masterSpinnerSuccess("/home/bob.jpg");
    expect(carouselStore.masterSpinnerSubscriptions["/home/bob.jpg"]).toEqual({
      success: true,
      error: false,
      complete: true,
    });
  });

  it("masterSpinnerError() should set masterSpinnerSubscriptions[src].error and masterSpinnerSubscriptions[src].complete to true", () => {
    expect(carouselStore.masterSpinnerSubscriptions).toEqual({});
    carouselStore.subscribeMasterSpinner("/home/bob.jpg");
    expect(carouselStore.masterSpinnerSubscriptions["/home/bob.jpg"]).toEqual({
      success: false,
      error: false,
      complete: false,
    });
    carouselStore.masterSpinnerError("/home/bob.jpg");
    expect(carouselStore.masterSpinnerSubscriptions["/home/bob.jpg"]).toEqual({
      success: false,
      error: true,
      complete: true,
    });
  });

  it("subscribeMasterSpinner() should not append a duplicate listener for the same image src", () => {
    expect(carouselStore.masterSpinnerSubscriptions).toEqual({});
    carouselStore.subscribeMasterSpinner("/home/bob.jpg");
    carouselStore.subscribeMasterSpinner("/home/bob.jpg");
    expect(carouselStore.masterSpinnerSubscriptions["/home/bob.jpg"]).toEqual({
      success: false,
      error: false,
      complete: false,
    });
  });

  it("unsubscribeMasterSpinner() should not remove anything but the supplied src", () => {
    expect(carouselStore.masterSpinnerSubscriptions).toEqual({});
    carouselStore.subscribeMasterSpinner("/home/bob.jpg");
    carouselStore.subscribeMasterSpinner("/home/poo.jpg");
    expect(carouselStore.masterSpinnerSubscriptions).toEqual({
      "/home/bob.jpg": { success: false, error: false, complete: false },
      "/home/poo.jpg": { success: false, error: false, complete: false },
    });
    expect(carouselStore.unsubscribeMasterSpinner("/home/bob.jpg")).toBe(true);
    expect(carouselStore.unsubscribeMasterSpinner("/home/bob.jpg")).toBe(false);
    expect(carouselStore.masterSpinnerSubscriptions).toEqual({
      "/home/poo.jpg": { success: false, error: false, complete: false },
    });
  });

  it("unsubscribeMasterSpinner() should clear all subscriptions", () => {
    carouselStore.subscribeMasterSpinner("/home/bob.jpg");
    carouselStore.unsubscribeAllMasterSpinner();
    expect(carouselStore.masterSpinnerSubscriptions).toEqual({});
  });

  it("isMasterSpinnerFinished() should return false if every image is not complete", () => {
    expect(carouselStore.masterSpinnerSubscriptions).toEqual({});
    carouselStore.subscribeMasterSpinner("/home/bob.jpg");
    carouselStore.subscribeMasterSpinner("/home/poo.jpg");
    expect(carouselStore.masterSpinnerSubscriptions).toEqual({
      "/home/bob.jpg": { success: false, error: false, complete: false },
      "/home/poo.jpg": { success: false, error: false, complete: false },
    });
    expect(carouselStore.isMasterSpinnerFinished()).toBe(false);
    carouselStore.masterSpinnerSuccess("/home/bob.jpg");
    expect(carouselStore.isMasterSpinnerFinished()).toBe(false);
    carouselStore.masterSpinnerError("/home/poo.jpg");
    expect(carouselStore.isMasterSpinnerFinished()).toBe(true);
  });
});

describe("WithStore", () => {
  it("should inject store state and carouselStore via React Context and re-render on store changes", () => {
    const components = createComponentConfig();
    const { props } = components.CarouselProvider;
    const ConnectedCustom = WithStore(CustomView, (state) => ({
      currentSlide: state.currentSlide,
    }));

    const { unmount } = render(
      <CarouselProvider {...props}>
        <Slide index={0}>Hello</Slide>
        <ConnectedCustom />
      </CarouselProvider>,
    );

    expect(screen.getByRole("button", { name: "Slide: 0" })).toBeInTheDocument();
    act(() => {
      screen.getByRole("button", { name: "Slide: 0" }).click();
    });
    expect(screen.getByRole("button", { name: "Slide: 1" })).toBeInTheDocument();
    unmount();
  });

  it("should preserve a stable carouselStore prop reference across store updates and only re-render when mapped state or own props change", () => {
    const components = createComponentConfig();
    const { props } = components.CarouselProvider;
    const storeRefs: Store[] = [];
    let unmappedRenderCount = 0;

    const UnmappedObserver = WithStore(
      ({ carouselStore, label }: { carouselStore: Store; label?: string }) => {
        unmappedRenderCount += 1;
        storeRefs.push(carouselStore);
        return <div data-testid="unmapped">{label || "default"}</div>;
      },
    );

    const ConnectedCustom = WithStore(CustomView, (state) => ({
      currentSlide: state.currentSlide,
    }));

    const { rerender, unmount } = render(
      <CarouselProvider {...props}>
        <Slide index={0}>Hello</Slide>
        <ConnectedCustom />
        <UnmappedObserver label="first" />
      </CarouselProvider>,
    );

    expect(unmappedRenderCount).toBe(1);

    // Triggering a store state update should NOT re-render UnmappedObserver
    // since neither its ownProps nor its mapped stateProps ({}) changed.
    act(() => {
      screen.getByRole("button", { name: "Slide: 0" }).click();
    });
    expect(screen.getByRole("button", { name: "Slide: 1" })).toBeInTheDocument();
    expect(unmappedRenderCount).toBe(1);

    // Changing ownProps SHOULD re-render UnmappedObserver and pass the exact same carouselStore reference.
    rerender(
      <CarouselProvider {...props}>
        <Slide index={0}>Hello</Slide>
        <ConnectedCustom />
        <UnmappedObserver label="second" />
      </CarouselProvider>,
    );
    expect(unmappedRenderCount).toBe(2);
    expect(screen.getByTestId("unmapped")).toHaveTextContent("second");
    expect(storeRefs[0]).toBe(storeRefs[1]);

    unmount();
  });

  it("should handle a partial mock carouselStore passed via props without a state property", () => {
    const ConnectedCustom = WithStore(CustomView, (state) => ({
      currentSlide: state.currentSlide,
    }));
    const partialStore = {
      setStoreState: vi.fn(),
    } as unknown as Store;

    render(<ConnectedCustom currentSlide={2} carouselStore={partialStore} />);
    expect(screen.getByRole("button", { name: "Slide: 2" })).toBeInTheDocument();
  });
});
