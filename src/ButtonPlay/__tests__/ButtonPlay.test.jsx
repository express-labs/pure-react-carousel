import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import clone from 'clone';
import components from '../../helpers/component-config';
import ButtonPlay from '../ButtonPlay';


let props;

describe('<ButtonPlay />', () => {
  beforeEach(() => {
    props = clone(components.ButtonPlay.props);
  });
  it('should render', () => {
    render(<ButtonPlay {...props} />);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });
  it('should update isPlaying in the carousel store toggling it from false to true after one click and back again after another click.', () => {
    const { rerender } = render(<ButtonPlay {...props} />);
    fireEvent.click(screen.getByRole('button'));
    expect(props.carouselStore.state.isPlaying).toBe(true);
    
    // Re-render with updated isPlaying prop to simulate WithStore HOC behavior
    rerender(<ButtonPlay {...props} isPlaying={props.carouselStore.state.isPlaying} />);
    fireEvent.click(screen.getByRole('button'));
    expect(props.carouselStore.state.isPlaying).toBe(false);
  });
  it('should call any supplied onClick function on click', () => {
    const onClick = jest.fn();
    render(<ButtonPlay {...props} onClick={onClick} />);
    fireEvent.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
