import React from "react";
import s from "./CustomSpinner.scss";

const CustomSpinner = (): React.ReactElement => (
  <svg className={s.spinner} viewBox="0 0 50 50">
    <circle className={s.path} cx="25" cy="25" r="20" fill="none" strokeWidth="5" />
  </svg>
);

export default CustomSpinner;
