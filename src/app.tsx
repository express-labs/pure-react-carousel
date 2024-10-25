// This is a development app for local dev work on react-carousel
import { createRoot } from 'react-dom/client';
import React from 'react';
import DevelopmentApp from './App/App';

const container = document.getElementById('app');
if (container) {
  const root = createRoot(container); // createRoot(container!) if you use TypeScript
  root.render(
    <React.StrictMode>
      <DevelopmentApp />
    </React.StrictMode>
  );
}
