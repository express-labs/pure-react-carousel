import React from 'react';
import { render, screen, act, waitFor } from '@testing-library/react';
import clone from 'clone';
import CarouselProvider from '..';
import Context from '../context';
import components from '../../helpers/component-config';
import Slider from '../../Slider';


let props;

jest.useFakeTimers();

describe('<CarouselProvider />', () => {
  beforeEach(() => {
    props = clone(components.CarouselProvider.props);
  });
  it('should render', () => {
    render(
      <CarouselProvider {...props}>Hello</CarouselProvider>
    );
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });
  it('utility function getStoreState should return the state', () => {
    // Create a test component to access the store via context
    const TestComponent = () => {
      const carouselStore = React.useContext(Context);
      return <div data-testid="orientation">{carouselStore.state.orientation}</div>;
    };
    
    render(
      <CarouselProvider {...props} orientation="vertical">
        <TestComponent />
      </CarouselProvider>
    );
    
    expect(screen.getByTestId('orientation')).toHaveTextContent('vertical');
  });
  it('should update the carouselStore values for slideSize and slideTraySize if totalSlides prop changes', () => {
    let carouselProvider;
    
    const { rerender } = render(
      <CarouselProvider {...props} totalSlides={4} ref={(ref) => { carouselProvider = ref; }}>
        <div>test</div>
      </CarouselProvider>
    );
    
    // Check initial values
    expect(carouselProvider.carouselStore.state.slideSize).toBe(25);
    expect(carouselProvider.carouselStore.state.slideTraySize).toBe(400);
    
    // Re-render with new props
    rerender(
      <CarouselProvider {...props} totalSlides={2} ref={(ref) => { carouselProvider = ref; }}>
        <div>test</div>
      </CarouselProvider>
    );
    
    // Check that values were updated after prop change
    expect(carouselProvider.carouselStore.state.slideSize).toBe(50);
    expect(carouselProvider.carouselStore.state.slideTraySize).toBe(200);
  });
  it('should update the carouselStore values for slideSize and slideTraySize if visibleSlides prop changes', () => {
    let carouselProvider;
    
    const { rerender } = render(
      <CarouselProvider {...props} totalSlides={4} ref={(ref) => { carouselProvider = ref; }}>
        <div>test</div>
      </CarouselProvider>
    );
    
    // Check initial values
    expect(carouselProvider.carouselStore.state.slideSize).toBe(25);
    expect(carouselProvider.carouselStore.state.slideTraySize).toBe(400);
    
    // Re-render with new visibleSlides prop
    rerender(
      <CarouselProvider {...props} totalSlides={4} visibleSlides={4} ref={(ref) => { carouselProvider = ref; }}>
        <div>test</div>
      </CarouselProvider>
    );
    
    // Check that values were updated after prop change
    expect(carouselProvider.carouselStore.state.slideSize).toBe(25);
    expect(carouselProvider.carouselStore.state.slideTraySize).toBe(100);
  });
  it('should keep currentSlide within bounds of totalSlides', () => {
    let carouselProvider;
    
    const { rerender } = render(
      <CarouselProvider {...props} currentSlide={3} totalSlides={4} ref={(ref) => { carouselProvider = ref; }}>
        <div>test</div>
      </CarouselProvider>
    );
    
    // Check initial value (currentSlide should be 3 but store might adjust it to 0 based index)
    expect(carouselProvider.carouselStore.state.currentSlide).toBe(3);
    
    // Re-render with reduced totalSlides
    rerender(
      <CarouselProvider {...props} currentSlide={3} totalSlides={3} ref={(ref) => { carouselProvider = ref; }}>
        <div>test</div>
      </CarouselProvider>
    );
    
    // Check that currentSlide was adjusted to be within bounds (max should be totalSlides - 1)
    expect(carouselProvider.carouselStore.state.currentSlide).toBe(2);
  });
  it('should not update the carouselStore if some prop we do not track changes', () => {
    let initialState;
    let updatedState;
    
    const TestComponent = () => {
      const carouselStore = React.useContext(Context);
      if (!initialState) {
        initialState = { ...carouselStore.state };
      } else {
        updatedState = { ...carouselStore.state };
      }
      return <div data-testid="dummy" />;
    };
    
    const { rerender } = render(
      <CarouselProvider {...props} data-foo={1}>
        <TestComponent />
      </CarouselProvider>
    );
    
    rerender(
      <CarouselProvider {...props} data-foo={2}>
        <TestComponent />
      </CarouselProvider>
    );
    
    expect(initialState).toEqual(updatedState);
  });
  it('should not reset the currentSlide or disableAnimation values when unrelated props change', () => {
    let carouselStore;
    let initialCurrentSlide;
    let initialDisableAnimation;
    let finalCurrentSlide;
    let finalDisableAnimation;
    
    const TestComponent = () => {
      const context = React.useContext(Context);
      carouselStore = context;
      
      if (initialCurrentSlide === undefined) {
        // First render - set custom currentSlide and capture initial state
        React.useEffect(() => {
          carouselStore.setStoreState({ currentSlide: 2 });
          initialCurrentSlide = carouselStore.state.currentSlide;
          initialDisableAnimation = carouselStore.state.disableAnimation;
        }, []);
      } else {
        // After rerender - capture final state
        finalCurrentSlide = carouselStore.state.currentSlide;
        finalDisableAnimation = carouselStore.state.disableAnimation;
      }
      
      return <div data-testid="dummy" />;
    };
    
    const { rerender } = render(
      <CarouselProvider {...props} totalSlides={4} data-foo={1}>
        <TestComponent />
      </CarouselProvider>
    );
    
    // Wait for initial effect to run
    act(() => {
      jest.runAllTimers();
    });
    
    rerender(
      <CarouselProvider {...props} totalSlides={4} data-foo={1} naturalSlideWidth={300}>
        <TestComponent />
      </CarouselProvider>
    );
    
    expect(finalCurrentSlide).toEqual(initialCurrentSlide);
    expect(finalDisableAnimation).toEqual(initialDisableAnimation);
  });
  it('should set disableAnimation to true and privateUnDisableAnimation to true if we updated currentSlide prop on CarouselProvider component', () => {
    let carouselProvider;
    
    const { rerender } = render(
      <CarouselProvider {...props} ref={(ref) => { carouselProvider = ref; }}>
        <div>test</div>
      </CarouselProvider>
    );
    
    // Check initial values
    expect(carouselProvider.carouselStore.state.disableAnimation).toBe(false);
    expect(carouselProvider.carouselStore.state.privateUnDisableAnimation).toBe(false);
    
    // Re-render with different currentSlide
    rerender(
      <CarouselProvider {...props} currentSlide={1} ref={(ref) => { carouselProvider = ref; }}>
        <div>test</div>
      </CarouselProvider>
    );
    
    // Check that animation was disabled when currentSlide changed
    expect(carouselProvider.carouselStore.state.disableAnimation).toBe(true);
    expect(carouselProvider.carouselStore.state.privateUnDisableAnimation).toBe(true);
  });
  it('The Slider component should reset disableAnimation to false and privateUnDisableAnimation to false if when Slider component is updated', async () => {
    const TestComponent = () => {
      const carouselStore = React.useContext(Context);
      return (
        <div>
          <div data-testid="disableAnimation">{carouselStore.state.disableAnimation.toString()}</div>
          <div data-testid="privateUnDisableAnimation">{carouselStore.state.privateUnDisableAnimation.toString()}</div>
        </div>
      );
    };
    
    const { rerender } = render(
      <CarouselProvider {...props}>
        <TestComponent />
        <Slider>Hello</Slider>
      </CarouselProvider>
    );
    
    rerender(
      <CarouselProvider {...props} currentSlide={1}>
        <TestComponent />
        <Slider>Hello</Slider>
      </CarouselProvider>
    );
    
    expect(screen.getByTestId('disableAnimation')).toHaveTextContent('false');
    expect(screen.getByTestId('privateUnDisableAnimation')).toHaveTextContent('false');
  });
  it('should correctly set store variable when using isIntrinsicHeight', async () => {
    const TestComponent = () => {
      const carouselStore = React.useContext(Context);
      return <div data-testid="isIntrinsicHeight">{carouselStore.state.isIntrinsicHeight.toString()}</div>;
    };
    
    render(
      <CarouselProvider {...props} isIntrinsicHeight>
        <TestComponent />
        test
      </CarouselProvider>
    );
    
    expect(screen.getByTestId('isIntrinsicHeight')).toHaveTextContent('true');
  });
  it('should throw an error, when trying to use isIntrinsicHeight in vertical orientation', async () => {
    // Mock console.error to suppress error output during test
    const originalConsoleError = console.error;
    console.error = jest.fn();
    
    try {
      expect(() => {
        new CarouselProvider({ 
          ...props, 
          isIntrinsicHeight: true, 
          orientation: "vertical", 
          children: "test" 
        });
      }).toThrow('isIntrinsicHeight can only be used in "horizontal" orientation. See Readme for more information.');
    } finally {
      // Restore console.error
      console.error = originalConsoleError;
    }
  });
});
