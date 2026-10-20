import React from "react";
import { render, fireEvent, act } from "@testing-library/react";
import { createComponentConfig } from "../../__tests__/component-config";
import Image from "../Image";
import Store from "../../Store/Store";
import CarouselProvider from "../../CarouselProvider";
import ImageWrapper from "../index";

describe("<Image />", () => {
  let props: ReturnType<typeof createComponentConfig>["Image"]["props"];
  let createdImages: HTMLImageElement[];
  let originalCreateElement: typeof document.createElement;

  beforeEach(() => {
    props = createComponentConfig().Image.props;
    createdImages = [];
    originalCreateElement = document.createElement.bind(document);
    vi.spyOn(document, "createElement").mockImplementation(
      (tagName: string, options?: ElementCreationOptions) => {
        const el = originalCreateElement(tagName, options);
        if (tagName.toLowerCase() === "img") {
          createdImages.push(el as HTMLImageElement);
        }
        return el;
      },
    );
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  const getInternalImage = () => createdImages[0];

  it("should render in loading state initially", () => {
    const { container } = render(<Image {...props} />);
    expect(container.querySelector(".carousel__image")).toBeInTheDocument();
    expect(container.querySelector(".carousel__image--loading")).toBeInTheDocument();
  });

  it("should render via Connected Image (WithStore) inside CarouselProvider", () => {
    const { container } = render(
      <CarouselProvider naturalSlideWidth={100} naturalSlideHeight={125} totalSlides={1}>
        <ImageWrapper src="test.jpg" alt="test" />
      </CarouselProvider>,
    );
    expect(container.querySelector(".carousel__image")).toBeInTheDocument();
  });

  it("should make a call to carouselStore.subscribeMasterSpinner() if props.hasMasterSpinner is true", () => {
    const spy = vi.spyOn(props.carouselStore, "subscribeMasterSpinner");
    expect(spy).not.toHaveBeenCalled();
    render(<Image {...props} hasMasterSpinner />);
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith("bob.jpg");
  });

  it("should make a call to carouselStore.unsubscribeMasterSpinner() if props.hasMasterSpinner is true and the component will unmount", () => {
    const spy = vi.spyOn(props.carouselStore, "unsubscribeMasterSpinner");
    expect(spy).not.toHaveBeenCalled();
    const { unmount } = render(<Image {...props} hasMasterSpinner />);
    unmount();
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith("bob.jpg");
  });

  it("should NOT make a call to carouselStore.unsubscribeMasterSpinner() if props.hasMasterSpinner is false and the component will unmount", () => {
    const spy = vi.spyOn(props.carouselStore, "unsubscribeMasterSpinner");
    expect(spy).not.toHaveBeenCalled();
    const { unmount } = render(<Image {...props} />);
    unmount();
    expect(spy).not.toHaveBeenCalled();
  });

  it("should call any passed-in onLoad after the image loads", () => {
    const onLoad = vi.fn();
    const { container } = render(<Image {...props} onLoad={onLoad} />);
    const internalImg = getInternalImage();

    act(() => {
      internalImg.dispatchEvent(new UIEvent("load"));
    });

    expect(onLoad).toHaveBeenCalledTimes(1);
    expect(container.querySelector(".carousel__image--success")).toBeInTheDocument();
  });

  it("should call any passed-in onError if an image load fails", () => {
    const onError = vi.fn();
    const { container } = render(<Image {...props} src="crap.junk" onError={onError} />);
    const internalImg = getInternalImage();

    act(() => {
      internalImg.dispatchEvent(new UIEvent("error"));
    });

    expect(onError).toHaveBeenCalledTimes(1);
    expect(container.querySelector(".carousel__image--error")).toBeInTheDocument();
  });

  it("should render the default error state with class imageError if an image load fails and there is no custom onError", () => {
    const { container } = render(<Image {...props} src="crap.junk" />);
    const internalImg = getInternalImage();

    act(() => {
      internalImg.dispatchEvent(new UIEvent("error"));
    });

    const el = container.querySelector("div");
    expect(el).toHaveClass("imageError");
    expect(el).toHaveClass("carousel__image--error");
  });

  it('should render the error state with the class "carousel__image--with-background" if isBgImage === true', () => {
    const { container } = render(<Image {...props} tag="div" src="crap.junk" isBgImage />);
    const internalImg = getInternalImage();

    act(() => {
      internalImg.dispatchEvent(new UIEvent("error"));
    });

    const el = container.querySelector("div");
    expect(el).toHaveClass("carousel__image--with-background");
    expect(el).toHaveClass("carousel__image--error");
  });

  it("should render with class carousel__image--with-background when isBgImage prop is true", () => {
    const { container } = render(<Image {...props} tag="div" isBgImage />);
    expect(container.querySelector("div")).toHaveClass("carousel__image--with-background");
  });

  it("should log console.error if you try to use isBgImage on an img tag", () => {
    const mockError = vi.spyOn(console, "error").mockImplementation(() => {});
    render(<Image {...props} isBgImage />);
    expect(mockError).toHaveBeenCalledTimes(1);
  });

  it("should call a custom renderLoading method if supplied as a prop", () => {
    const renderLoading = vi.fn(() => <span>Custom Loading</span>);
    const { getByText } = render(<Image {...props} renderLoading={renderLoading} />);
    expect(renderLoading).toHaveBeenCalled();
    expect(getByText("Custom Loading")).toBeInTheDocument();
  });

  it("should call a custom renderError method if supplied as a prop and image load fails", () => {
    const renderError = vi.fn(() => <span>Custom Error</span>);
    const { getByText } = render(<Image {...props} renderError={renderError} />);
    const internalImg = getInternalImage();

    act(() => {
      internalImg.dispatchEvent(new UIEvent("error"));
    });

    expect(renderError).toHaveBeenCalledTimes(1);
    expect(getByText("Custom Error")).toBeInTheDocument();
  });

  it("should call carouselStore.masterSpinnerSuccess if image load was a success and hasMasterSpinner is true", () => {
    const masterSpinnerSuccess = vi.spyOn(props.carouselStore, "masterSpinnerSuccess");
    render(<Image {...props} hasMasterSpinner />);
    const internalImg = getInternalImage();

    act(() => {
      internalImg.dispatchEvent(new UIEvent("load"));
    });

    expect(masterSpinnerSuccess).toHaveBeenCalledTimes(1);
    expect(masterSpinnerSuccess).toHaveBeenCalledWith("bob.jpg");
  });

  it("should call carouselStore.masterSpinnerError if image load error and hasMasterSpinner was true", () => {
    const masterSpinnerError = vi.spyOn(props.carouselStore, "masterSpinnerError");
    render(<Image {...props} hasMasterSpinner />);
    const internalImg = getInternalImage();

    act(() => {
      internalImg.dispatchEvent(new UIEvent("error"));
    });

    expect(masterSpinnerError).toHaveBeenCalledTimes(1);
    expect(masterSpinnerError).toHaveBeenCalledWith("bob.jpg");
  });

  it("if the image src changes, should unsubscribe old src and subscribe new src to masterSpinner", () => {
    const carouselStore = new Store({ hasMasterSpinner: true });
    const subSpy = vi.spyOn(carouselStore, "subscribeMasterSpinner");
    const unsubSpy = vi.spyOn(carouselStore, "unsubscribeMasterSpinner");

    const { rerender } = render(
      <Image {...props} carouselStore={carouselStore} hasMasterSpinner />,
    );
    expect(subSpy).toHaveBeenCalledWith("bob.jpg");

    rerender(<Image {...props} carouselStore={carouselStore} hasMasterSpinner src="foo.jpg" />);
    expect(unsubSpy).toHaveBeenCalledWith("bob.jpg");
    expect(subSpy).toHaveBeenCalledWith("foo.jpg");
  });

  it("should remove event listeners on unmount", () => {
    const { unmount } = render(<Image {...props} hasMasterSpinner />);
    const internalImg = getInternalImage();
    const spyRemoveEventListener = vi.spyOn(internalImg, "removeEventListener");
    unmount();
    expect(spyRemoveEventListener).toHaveBeenCalledTimes(2);
  });

  it("should attach the image to a div background if the supplied element is a div instead of the default img element", () => {
    const { container } = render(<Image {...props} tag="div" className="test" isBgImage />);
    const internalImg = getInternalImage();

    act(() => {
      fireEvent(internalImg, new UIEvent("load"));
    });

    const div = container.querySelector("div.test") as HTMLElement;
    expect(div).toBeInTheDocument();
    expect(div.style.backgroundImage).toBe('url("bob.jpg")');
    expect(div.style.backgroundSize).toBe("cover");
  });

  it("should forward ref to the rendered image element", () => {
    const ref = React.createRef<HTMLImageElement>();
    render(<Image {...props} ref={ref} />);
    const internalImg = getInternalImage();
    act(() => {
      internalImg.dispatchEvent(new UIEvent("load"));
    });
    expect(ref.current).toBeInstanceOf(HTMLImageElement);
    expect(ref.current).toHaveClass("carousel__image--success");
  });
});
