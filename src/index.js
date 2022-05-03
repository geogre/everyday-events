import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import * as serviceWorker from './serviceWorker';
import AppWithAuth from './containers/AppWithAuth';
import {BrowserRouter} from 'react-router-dom';
import {compose, combineReducers} from 'redux';
import {Provider} from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import eventsReducer from './store/reducers/events-reducer';
import datesReducer from "./store/reducers/dates-reducer";
import 'bootstrap/dist/css/bootstrap.css';
import AuthContextProvider from "./context/AuthContextProvider";

const composeEnhancers = (process.env.APP_ENV !== 'production' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) || compose;

const rootReducer = combineReducers({
    eventsData: eventsReducer,
    datesData: datesReducer
});

const store = configureStore({
    reducer: rootReducer,
    enhancers: composeEnhancers
});
const container = document.getElementById('root');
const root = createRoot(container);
const RoutedApp = props => <AuthContextProvider><AppWithAuth {...props}/></AuthContextProvider>;
root.render(<Provider store={store}><BrowserRouter><RoutedApp /></BrowserRouter></Provider>, );

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
