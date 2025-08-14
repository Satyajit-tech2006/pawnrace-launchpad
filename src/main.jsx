// Application Entry Point
// This file initializes and renders the React application

import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// Find the root DOM element and render our app
const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Failed to find the root element");
}

const root = createRoot(rootElement);
root.render(<App />);