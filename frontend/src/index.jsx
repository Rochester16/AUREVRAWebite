import React from 'react';
import ReactDOM from 'react-dom/client';

// Bootstrap
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

// Font Awesome (move it BEFORE your own CSS)
import '@fortawesome/fontawesome-free/css/all.min.css';

// Your CSS
import './index.css';

// App
import App from './App.jsx';
import reportWebVitals from './reportWebVitals';


// Apply dark-mode on initial load if user previously enabled it
try {
    const _dm = localStorage.getItem('darkMode');
    if (_dm === 'enabled') {
        document.body.classList.add('dark-mode');
    } else {
        document.body.classList.remove('dark-mode');
    }
} catch (e) {
    // ignore errors
}


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);


// Performance metrics
reportWebVitals();
