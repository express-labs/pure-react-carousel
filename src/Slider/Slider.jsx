import React from 'react';
import PropTypes from 'prop-types';
import { cn, pct } from '../helpers';
import s from './slider.css';

const Slider = class Slider extends React.Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
    className: PropTypes.string,
    currentSlide: PropTypes.number.isRequired,
    hasMasterSpinner: PropTypes.bool.isRequired,
    masterSpinnerErrorCount: PropTypes.number.isRequired,
    masterSpinnerSuccessCount: PropTypes.number.isRequired,
    masterSpinnerSubscriptionCount: PropTypes.number.isRequired,
    slideTrayWidth: PropTypes.number.isRequired,
    slideWidth: PropTypes.number.isRequired,
    store: PropTypes.object.isRequired,
    style: PropTypes.object,
    visibleSlides: PropTypes.number,
  }

  static defaultProps = {
    className: '',
    style: {},
    visibleSlides: 1,
  }

  renderMasterSpinner() {
    const {
      hasMasterSpinner, masterSpinnerErrorCount,
      masterSpinnerSuccessCount, masterSpinnerSubscriptionCount,
    } = this.props;

    const testImageCountReached = (
      masterSpinnerErrorCount + masterSpinnerSuccessCount
    ) === masterSpinnerSubscriptionCount;

    const testInitialLoad = masterSpinnerSubscriptionCount === 0;

    if (hasMasterSpinner && (!testImageCountReached || testInitialLoad)) {
      return (
        <div
          className={cn(['carousel__master-spinner-container', s.masterSpinnerContainer])}
        >
          <div className={cn(['carousel__master-spinner', s.masterSpinner])} />
        </div>
      );
    }

    return null;
  }

  render() {
    const {
      children, className, currentSlide, hasMasterSpinner, masterSpinnerSuccessCount,
      masterSpinnerErrorCount, masterSpinnerSubscriptionCount, slideTrayWidth, slideWidth, store,
      visibleSlides,
      ...props
    } = this.props;

    const style = {
      width: pct(slideTrayWidth),
      transform: `translateX(${pct(slideWidth * currentSlide * -1)})`,
    };

    const sliderClasses = cn([
      s.slider,
      'carousel__slide-show',
      className,
    ]);

    const trayClasses = cn([
      s.sliderTray,
      'carousel__slide-tray',
    ]);

    return (
      <div className={sliderClasses} aria-live="polite" {...props}>
        <div className={trayClasses} style={style}>
          {children}
        </div>
        {this.renderMasterSpinner()}
      </div>
    );
  }
};

export default Slider;
