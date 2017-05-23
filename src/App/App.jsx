import React from 'react';
import { Button, CarouselProvider } from '../';
import s from './style.css';
import { cn } from '../helpers';

const DevelopmentApp = () => (
  <CarouselProvider>
    <h1 className={cn(['headline', s.headline])}>Testing App!</h1>
    <Button>Hello</Button>
  </CarouselProvider>
);

export default DevelopmentApp;
