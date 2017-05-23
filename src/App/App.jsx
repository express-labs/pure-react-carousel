import React from 'react';
import { Button, CarouselProvider } from '../';
import s from './style.css';

const DevelopmentApp = () => (
  <CarouselProvider>
    <h1>Testing App!</h1>
    <Button>Hello</Button>
  </CarouselProvider>
);

export default DevelopmentApp;
