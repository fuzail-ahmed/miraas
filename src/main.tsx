import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import sourceSerifHeadingUrl from '@fontsource/source-serif-4/files/source-serif-4-latin-600-normal.woff2?url';

import App from './App';
import './index.css';

function preloadFont(href: string): void {
  const preload = document.createElement('link');
  preload.rel = 'preload';
  preload.as = 'font';
  preload.type = 'font/woff2';
  preload.href = href;
  preload.crossOrigin = 'anonymous';
  document.head.append(preload);
}

preloadFont(sourceSerifHeadingUrl);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
