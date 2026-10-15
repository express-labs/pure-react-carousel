import React, { useEffect, useRef, useState } from "react";
import Image from "../Image";
import Spinner from "../Spinner";
import { boundedRange, cn, pct } from "../helpers";
import type { ImageWithZoomProps } from "../types";
import s from "./ImageWithZoom.scss";

const MOUSE_SCALE = 2;
const MAX_TOUCH_SCALE = 3;

export interface TouchCoordinates {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

export function midpointBetweenTwoTouches({ x1, y1, x2, y2 }: TouchCoordinates): {
  x: number;
  y: number;
} {
  return {
    x: (x1 + x2) / 2,
    y: (y1 + y2) / 2,
  };
}

export function distanceBetweenTwoTouches({ x1, y1, x2, y2 }: TouchCoordinates): number {
  return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
}

interface TouchPointCacheEntry {
  clientX: number;
  clientY: number;
}

const ImageWithZoom = (props: ImageWithZoomProps & { spinner?: () => React.ReactNode }) => {
  const {
    alt = undefined,
    bgImageProps = {},
    bgImageTag = "div",
    carouselStore,
    className = null,
    hasMasterSpinner: _hasMasterSpinner,
    imageClassName = null,
    overlayClassName = null,
    isPinchZoomEnabled = true,
    spinner = null,
    onLoad = null,
    onError = null,
    src,
    srcZoomed = null,
    tag: Tag = "div",
    ...filteredProps
  } = props;

  const [isImageLoading, setIsImageLoading] = useState(true);
  const [, setIsImageLoadingError] = useState(true);
  const [isHovering, setIsHovering] = useState(false);
  const [isZooming, setIsZooming] = useState(false);
  const [x, setX] = useState<string | null>(null);
  const [y, setY] = useState<string | null>(null);
  const [scale, setScale] = useState(1);

  const tpCacheRef = useRef<Record<number, TouchPointCacheEntry>>({});
  const prevIsZoomingRef = useRef(false);

  useEffect(() => {
    if (!prevIsZoomingRef.current && isZooming) {
      carouselStore.setStoreState({
        isPageScrollLocked: true,
      });
    } else if (prevIsZoomingRef.current && !isZooming) {
      carouselStore.setStoreState({
        isPageScrollLocked: false,
      });
    }
    prevIsZoomingRef.current = isZooming;
  }, [isZooming, carouselStore]);

  const handleImageComplete = (ev?: React.SyntheticEvent<HTMLElement> | Event) => {
    setIsImageLoading(false);
    if (onLoad) onLoad(ev);
  };

  const handleImageLoadError = (ev?: React.SyntheticEvent<HTMLElement> | Event) => {
    setIsImageLoadingError(true);
    setIsImageLoading(false);
    if (onError) onError(ev);
  };

  const handleOnMouseOver = () => {
    if (isZooming) return;
    setIsHovering(true);
    setScale(MOUSE_SCALE);
  };

  const handleOnMouseOut = () => {
    if (isZooming) return;
    setIsHovering(false);
    setScale(1);
  };

  const handleOnMouseMove = (ev: React.MouseEvent<HTMLElement>) => {
    if (isZooming) return;
    const target = ev.target as HTMLElement;
    const nextX = pct((ev.nativeEvent.offsetX / target.offsetWidth) * 100);
    const nextY = pct((ev.nativeEvent.offsetY / target.offsetHeight) * 100);
    setX(nextX);
    setY(nextY);
  };

  const handleOnTouchStart = (ev: React.TouchEvent<HTMLElement>) => {
    if (!isPinchZoomEnabled) return;
    Array.from(ev.targetTouches).forEach((touchPoint) => {
      tpCacheRef.current[touchPoint.identifier] = {
        clientX: touchPoint.clientX,
        clientY: touchPoint.clientY,
      };
    });

    setIsZooming((prevZooming) => prevZooming || Object.keys(tpCacheRef.current).length > 1);
  };

  const handleOnTouchMove = (ev: React.TouchEvent<HTMLElement>) => {
    if (!isZooming) return;

    const touches = Array.from(ev.targetTouches)
      .filter((touch) => Boolean(tpCacheRef.current[touch.identifier]))
      .slice(0, 2);

    if (touches.length === 2) {
      ev.stopPropagation();

      const target = ev.target as HTMLElement;
      const clientRect = target.getBoundingClientRect();
      const id0 = touches[0].identifier;
      const id1 = touches[1].identifier;

      const startCoords: TouchCoordinates = {
        x1: tpCacheRef.current[id0].clientX,
        y1: tpCacheRef.current[id0].clientY,
        x2: tpCacheRef.current[id1].clientX,
        y2: tpCacheRef.current[id1].clientY,
      };
      const startDistance = distanceBetweenTwoTouches(startCoords);

      const endCoords: TouchCoordinates = {
        x1: touches[0].clientX,
        y1: touches[0].clientY,
        x2: touches[1].clientX,
        y2: touches[1].clientY,
      };
      const endDistance = distanceBetweenTwoTouches(endCoords);
      const endMidpoint = midpointBetweenTwoTouches(endCoords);

      const nextX = pct(
        boundedRange({
          min: 0,
          max: 100,
          x: ((endMidpoint.x - clientRect.left) / clientRect.width) * 100,
        }),
      );
      const nextY = pct(
        boundedRange({
          min: 0,
          max: 100,
          x: ((endMidpoint.y - clientRect.top) / clientRect.height) * 100,
        }),
      );

      setScale((prevScale) => {
        const nextScale = boundedRange({
          min: 1,
          max: MAX_TOUCH_SCALE,
          x: prevScale + (endDistance - startDistance) / 100,
        });
        setIsZooming(nextScale !== 1);
        return nextScale;
      });
      setX(nextX);
      setY(nextY);
    }
  };

  const handleOnTouchEnd = (ev: React.TouchEvent<HTMLElement>) => {
    if (!isPinchZoomEnabled) return;

    Array.from(ev.changedTouches).forEach((touchPoint) => {
      delete tpCacheRef.current[touchPoint.identifier];
    });

    if (Object.keys(tpCacheRef.current).length === 0) {
      setIsZooming(false);
    }
  };

  const renderLoading = () => {
    if (isImageLoading) {
      return (
        <div
          className={cn([
            s.imageLoadingSpinnerContainer,
            "carousel__image-loading-spinner-container",
          ])}
        >
          {spinner && spinner()}
          {!spinner && <Spinner />}
        </div>
      );
    }
    return null;
  };

  const newClassName = cn([s.container, className]);
  const newImageClassName = cn([s.image, "carousel__zoom-image", imageClassName]);
  const newOverlayClassName = cn([
    s.overlay,
    "carousel__zoom-image-overlay",
    isHovering && s.hover,
    isZooming && s.zoom,
    isHovering && "carousel__zoom-image-overlay--hovering",
    isZooming && "carousel__zoom-image-overlay--zooming",
    overlayClassName,
  ]);

  const overlayStyle: React.CSSProperties = {};
  if (isHovering || isZooming) {
    overlayStyle.transformOrigin = `${x} ${y}`;
    overlayStyle.transform = `scale(${scale})`;
  }

  const ElementTag = Tag as React.ElementType;

  return (
    <ElementTag className={newClassName} {...filteredProps}>
      <Image
        alt={alt}
        className={newImageClassName}
        tag={bgImageTag}
        src={src}
        onLoad={handleImageComplete}
        onError={handleImageLoadError}
        {...bgImageProps}
      />
      <Image
        className={newOverlayClassName}
        tag="div"
        src={srcZoomed || src}
        style={overlayStyle}
        isBgImage
        onFocus={handleOnMouseOver}
        onMouseOver={handleOnMouseOver}
        onBlur={handleOnMouseOut}
        onMouseOut={handleOnMouseOut}
        onMouseMove={handleOnMouseMove}
        onTouchStart={handleOnTouchStart}
        onTouchEnd={handleOnTouchEnd}
        onTouchMove={handleOnTouchMove}
      />
      {renderLoading()}
    </ElementTag>
  );
};

ImageWithZoom.midpointBetweenTwoTouches = midpointBetweenTwoTouches;
ImageWithZoom.distanceBetweenTwoTouches = distanceBetweenTwoTouches;

export default ImageWithZoom;
