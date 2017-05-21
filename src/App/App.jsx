import React from 'react';
import { Button, CarouselProvider } from '../';

const DevelopmentApp = () => (
  <CarouselProvider>
    <h1>Hello from my fake app!</h1>
    <Button>Hello</Button>
  </CarouselProvider>
);

export default DevelopmentApp;
