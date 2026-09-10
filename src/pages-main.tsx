import React from 'react';
import {createRoot} from 'react-dom/client';
import App from '../app/page';
import BusinessPlan from '../app/bp/page';
import '../app/globals.css';
import '../app/overrides.css';

const path=window.location.pathname.replace(/\/+$/,'');
const isBusinessPlan=path.endsWith('/bp');
document.title=isBusinessPlan?'火花｜天使轮商业计划书':'火花 · 无限互动视频';

createRoot(document.getElementById('root')!).render(
 <React.StrictMode>{isBusinessPlan?<BusinessPlan/>:<App/>}</React.StrictMode>,
);
