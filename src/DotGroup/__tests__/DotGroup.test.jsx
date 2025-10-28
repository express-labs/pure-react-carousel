import React from 'react';
import { render, screen } from '@testing-library/react';
import clone from 'clone';
import components from '../../helpers/component-config';
import DotGroup from '../DotGroup';
import CarouselProvider from '../../CarouselProvider/CarouselProvider';


let props;

describe('<DotGroup />', () => {
  beforeEach(() => {
    props = clone(components.DotGroup.props);
  });
  it('should render', () => {
    const { container } = render(
      <CarouselProvider naturalSlideHeight={100} naturalSlideWidth={100} totalSlides={3}>
        <DotGroup {...props} />
      </CarouselProvider>
    );
    expect(container.querySelector('.carousel__dot-group')).toBeInTheDocument();
  });
  it('should render any children', () => {
    render(
      <CarouselProvider naturalSlideHeight={100} naturalSlideWidth={100} totalSlides={3}>
        <DotGroup {...props}><h1>Hello There</h1></DotGroup>
      </CarouselProvider>
    );
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Hello There');
  });
  it('should render dots with numbers if dotNumbers prop is true', () => {
    render(
      <CarouselProvider naturalSlideHeight={100} naturalSlideWidth={100} totalSlides={3}>
        <DotGroup {...props} dotNumbers />
      </CarouselProvider>
    );
    const spans = screen.getAllByRole('button').map(button => button.querySelector('span'));
    expect(spans[0]).toHaveTextContent('1');
    expect(spans[1]).toHaveTextContent('2');
    expect(spans[2]).toHaveTextContent('3');
  });
  it('should NOT render dots with numbers if dotNumbers prop is not set', () => {
    render(
      <CarouselProvider naturalSlideHeight={100} naturalSlideWidth={100} totalSlides={3}>
        <DotGroup {...props} />
      </CarouselProvider>
    );
    const spans = screen.getAllByRole('button').map(button => button.querySelector('span'));
    expect(spans[0]).toHaveTextContent('');
    expect(spans[1]).toHaveTextContent('');
    expect(spans[2]).toHaveTextContent('');
  });
  it('should render enabled active dots if disableActiveDots prop is false', () => {
    render(
      <CarouselProvider naturalSlideHeight={100} naturalSlideWidth={100} totalSlides={3}>
        <DotGroup {...props} disableActiveDots={false} />
      </CarouselProvider>
    );
    const buttons = screen.getAllByRole('button');
    expect(buttons[0]).not.toBeDisabled();
    expect(buttons[1]).not.toBeDisabled();
    expect(buttons[2]).not.toBeDisabled();
  });
  it('should render DISABLED dots if disableActiveDots prop is not set', () => {
    render(
      <CarouselProvider naturalSlideHeight={100} naturalSlideWidth={100} totalSlides={3}>
        <DotGroup {...props} />
      </CarouselProvider>
    );
    const buttons = screen.getAllByRole('button');
    expect(buttons[0]).not.toBeDisabled();
    expect(buttons[1]).toBeDisabled();
    expect(buttons[2]).toBeDisabled();
  });
  it('should render only current slide dot as selected if showAsSelectedForCurrentSlideOnly prop is true', () => {
    render(
      <CarouselProvider naturalSlideHeight={100} naturalSlideWidth={100} totalSlides={3}>
        <DotGroup {...props} showAsSelectedForCurrentSlideOnly />
      </CarouselProvider>
    );
    const buttons = screen.getAllByRole('button');
    expect(buttons[0]).not.toHaveClass('carousel__dot--selected');
    expect(buttons[1]).toHaveClass('carousel__dot--selected');
    expect(buttons[2]).not.toHaveClass('carousel__dot--selected');
  });
  it('should render all visible slides dot as selected if showAsSelectedForCurrentSlideOnly prop is not set', () => {
    render(
      <CarouselProvider naturalSlideHeight={100} naturalSlideWidth={100} totalSlides={3}>
        <DotGroup {...props} />
      </CarouselProvider>
    );
    const buttons = screen.getAllByRole('button');
    expect(buttons[0]).not.toHaveClass('carousel__dot--selected');
    expect(buttons[1]).toHaveClass('carousel__dot--selected');
    expect(buttons[2]).toHaveClass('carousel__dot--selected');
  });
  it('should render dots differently if renderDots is provided', () => {
    const renderDots = ({ totalSlides }) => {
      const dots = [];

      for (let i = 0; i < totalSlides; i += 1) {
        dots.push(<img key={i} src="data:," alt={`Dot ${i + 1}`} />);
      }
      return dots;
    };

    render(
      <CarouselProvider naturalSlideHeight={100} naturalSlideWidth={100} totalSlides={3}>
        <DotGroup {...props} renderDots={renderDots} />
      </CarouselProvider>
    );
    const images = screen.getAllByRole('img');
    expect(images).toHaveLength(3);
    expect(images[0]).toBeInTheDocument();
    expect(images[1]).toBeInTheDocument();
    expect(images[2]).toBeInTheDocument();
  });
});
