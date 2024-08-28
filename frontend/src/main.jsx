import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import App from './App';
import './index.css';
import configureStore from './store/store.js';
import { restoreCSRF, csrfFetch } from './store/csrf.js';
import * as sessionActions from './store/session.js';
import { ModalProvider, Modal } from './context/modal.jsx';

const store = configureStore();

if (import.meta.env.MODE !== "production") {
    restoreCSRF();

    window.csrfFetch = csrfFetch;
    window.store = store;
    window.sessionActions = sessionActions;
}

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <ModalProvider>
            <Provider store={store}>
                <App />
                <Modal />
            </Provider>
        </ModalProvider>
    </React.StrictMode>
);