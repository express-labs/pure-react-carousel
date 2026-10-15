import { createContext } from "react";
import { Store } from "../Store/Store";
import type { CarouselStoreInterface } from "../types";

export const CarouselContext = createContext<CarouselStoreInterface>(new Store());
CarouselContext.displayName = "CarouselContext";

export default CarouselContext;
