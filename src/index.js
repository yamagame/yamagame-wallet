import React from 'react';
import { Provider } from 'react-redux'
import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import ReactDOM from 'react-dom';
import {
  accountApp,
  loadInitialData,
} from './reducers'
import './index.css';
import App from './App';
//import registerServiceWorker from './registerServiceWorker';

let store = createStore(accountApp, applyMiddleware(thunk))

store.dispatch(loadInitialData());

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);
//registerServiceWorker();
