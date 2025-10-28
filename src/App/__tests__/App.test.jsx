import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import App from '../App';

describe('<App />', () => {
  it('should render the demo app', () => {
    render(<App />);
    // Check if the app renders by looking for a common element
    expect(screen.getByText('Pure React Carousel')).toBeInTheDocument();
  });
  
  it('should call handleChange when a select is changed', () => {
    render(<App />);
    // Get the main demo selection dropdown by its class
    const selectElement = screen.getByDisplayValue('Show All');
    
    // Initially should have default value
    expect(selectElement.value).toBe('0');
    
    // Change the select value
    fireEvent.change(selectElement, { target: { value: '5' } });
    
    // Verify the value changed
    expect(selectElement.value).toBe('5');
  });
});
