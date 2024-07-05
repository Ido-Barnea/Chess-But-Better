import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

const container = document.getElementById('root');
const root = createRoot(container);

// It is common practice to name all of your components file names with pascal case;
// use react router for routes in website.
// get rid of additional html files,
// all you need is index.html,
// you render the rest of it under App component using Outlet from react router
// React.StrictMode ruins React DND for whatever reason ("can't have 2 html5 backends");

root.render(<App />);
