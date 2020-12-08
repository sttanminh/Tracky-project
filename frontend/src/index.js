import React from 'react';
import ReactDOM from 'react-dom';
import './css/index.css';
import App from './App';
// Redux
import { Provider, } from 'react-redux'
import { createStore, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'; 
import rootReducer from './redux/reducers'

// Custom
import './WebNotifiation';
import * as serviceWorker from './ServiceWorker';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(rootReducer, composeEnhancers(applyMiddleware(thunk)))

ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById('root')
);

serviceWorker.register();