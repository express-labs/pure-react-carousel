import React from 'react';
import s from './CustomSpinner.scss';

export default class CustomSpinner extends React.Component {
  static meta = {
    VERSION: '0.0.0',
  }

  render() {
    return (
      <svg className={s.spinner} viewBox="0 0 50 50">
        <circle className={s.path} cx="25" cy="25" r="20" fill="none" strokeWidth="5" />
      </svg>
    );
  }
}
