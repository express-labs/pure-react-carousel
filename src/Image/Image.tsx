import * as React from "react";
import { useEffect, useRef, useState } from "react";
import { cn, LOADING, SUCCESS, ERROR } from "../helpers";
import type { ImageViewProps } from "../types";
import s from "./Image.scss";

export function subscribeMasterSpinner(
  props: Pick<ImageViewProps, "hasMasterSpinner" | "carouselStore" | "src">,
): void {
  if (props.hasMasterSpinner) {
    props.carouselStore.subscribeMasterSpinner(props.src);
  }
}

export function unsubscribeMasterSpinner(
  props: Pick<ImageViewProps, "hasMasterSpinner" | "carouselStore" | "src">,
): void {
  if (props.hasMasterSpinner) {
    props.carouselStore.unsubscribeMasterSpinner(props.src);
  }
}

const Image = Object.assign(
  React.forwardRef<HTMLImageElement, ImageViewProps>((props, ref) => {
    const {
      alt = "",
      bgImageProps: _bgImageProps,
      bgImageTag: _bgImageTag,
      carouselStore,
      children = null,
      className = null,
      classNameError: _classNameError,
      classNameLoading: _classNameLoading,
      classNameSuccess: _classNameSuccess,
      hasMasterSpinner,
      isBgImage = false,
      onError = null,
      onLoad = null,
      renderError = null,
      renderLoading = null,
      src,
      style = null,
      tag = "img",
      ...restProps
    } = props;

    const [imageState, setImageState] = useState<{ src: string; status: string }>({
      src,
      status: LOADING,
    });
    const imageStatus = imageState.src === src ? imageState.status : LOADING;

    const latestPropsRef = useRef({
      carouselStore,
      hasMasterSpinner,
      onError,
      onLoad,
      src,
    });

    useEffect(() => {
      latestPropsRef.current = {
        carouselStore,
        hasMasterSpinner,
        onError,
        onLoad,
        src,
      };
    });

    useEffect(() => {
      if (isBgImage && tag === "img") {
        // eslint-disable-next-line no-console
        console.error(
          "HTML img elements should not have a backgroundImage. Please use isBgImage for other block-level HTML tags, like div, a, section, etc...",
        );
      }
    }, [isBgImage, tag]);

    useEffect(() => {
      const currentProps = latestPropsRef.current;
      subscribeMasterSpinner({
        hasMasterSpinner: currentProps.hasMasterSpinner,
        carouselStore: currentProps.carouselStore,
        src,
      });

      const img = document.createElement("img");

      const handleImageLoad = (ev: Event) => {
        setImageState({ src, status: SUCCESS });
        if (latestPropsRef.current.hasMasterSpinner) {
          latestPropsRef.current.carouselStore.masterSpinnerSuccess(src);
        }
        if (latestPropsRef.current.onLoad) {
          latestPropsRef.current.onLoad(ev);
        }
      };

      const handleImageError = (ev: Event) => {
        setImageState({ src, status: ERROR });
        if (latestPropsRef.current.hasMasterSpinner) {
          latestPropsRef.current.carouselStore.masterSpinnerError(src);
        }
        if (latestPropsRef.current.onError) {
          latestPropsRef.current.onError(ev);
        }
      };

      img.addEventListener("load", handleImageLoad, false);
      img.addEventListener("error", handleImageError, false);
      img.src = src;

      const imgWithReadyState: HTMLImageElement & { readyState?: string } = img;
      if (imgWithReadyState.readyState || img.complete) {
        const currentSrc = img.src;
        img.src = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";
        img.src = currentSrc;
      }

      return () => {
        unsubscribeMasterSpinner({
          hasMasterSpinner: latestPropsRef.current.hasMasterSpinner,
          carouselStore: latestPropsRef.current.carouselStore,
          src,
        });
        img.removeEventListener("load", handleImageLoad);
        img.removeEventListener("error", handleImageError);
      };
    }, [src]);

    const tempTag = tag === "img" ? "div" : tag;

    const fallbackProps = {
      ...(style ? { style } : {}),
      ...restProps,
    };

    if (imageStatus === LOADING) {
      const newClassName = cn([
        s.image,
        s.imageLoading,
        "carousel__image",
        isBgImage && "carousel__image--with-background",
        "carousel__image--loading",
        className,
      ]);

      return React.createElement(
        tempTag,
        { ref, className: newClassName, ...fallbackProps },
        typeof renderLoading === "function" ? renderLoading() : children,
      );
    }

    if (imageStatus === ERROR) {
      const newClassName = cn([
        s.image,
        s.imageError,
        "carousel__image",
        isBgImage && "carousel__image--with-background",
        "carousel__image--error",
        className,
      ]);

      return React.createElement(
        tempTag,
        { ref, className: newClassName, ...fallbackProps },
        typeof renderError === "function" ? renderError() : children,
      );
    }

    const newClassName = cn([
      s.image,
      "carousel__image",
      isBgImage && "carousel__image--with-background",
      "carousel__image--success",
      className,
    ]);

    let newStyle: React.CSSProperties = { ...style };
    let newFilteredProps: Record<string, unknown> = {
      alt,
      src,
      ...restProps,
    };

    if (tag !== "img") {
      const hasNonEmptyAlt = typeof alt === "string" && alt.length > 0;
      const defaultRole = hasNonEmptyAlt ? "img" : undefined;
      const defaultAriaLabel =
        hasNonEmptyAlt && restProps["aria-labelledby"] === undefined ? alt : undefined;
      newFilteredProps = {
        ...(defaultRole ? { role: defaultRole } : {}),
        ...(defaultAriaLabel ? { "aria-label": defaultAriaLabel } : {}),
        ...restProps,
      };
      newStyle = {
        ...style,
        backgroundImage: `url("${src}")`,
        backgroundSize: "cover",
      };
    }

    return React.createElement(
      tag,
      { ref, className: newClassName, style: newStyle, ...newFilteredProps },
      children,
    );
  }),
  {
    subscribeMasterSpinner,
    unsubscribeMasterSpinner,
  },
);

export default Image;
