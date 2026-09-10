import React from 'react';
import {createRoot} from 'react-dom/client';
import App from '../app/page';
import '../app/globals.css';
import '../app/overrides.css';

document.title='火花 · 无限互动视频';

createRoot(document.getElementById('root')!).render(
 <React.StrictMode><App/></React.StrictMode>,
);
