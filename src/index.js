import React from 'react';
import ReactDOM from 'react-dom/client';
import DrawingStateProvider from './context/drawingState';
import App from './App';
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <DrawingStateProvider>
        <App />
    </DrawingStateProvider>
);
