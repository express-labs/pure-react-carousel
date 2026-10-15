import React from "react";
import { cn, cleanProps } from "../helpers";
import type { SpinnerProps } from "../types";
import s from "./Spinner.scss";

const Spinner = (props: SpinnerProps) => {
  const { className = undefined, ...restProps } = props;
  const filteredProps = cleanProps(restProps);
  const newClassName = cn([s.spinner, "carousel__spinner", className]);
  return <div className={newClassName} {...filteredProps} />;
};

export default Spinner;
