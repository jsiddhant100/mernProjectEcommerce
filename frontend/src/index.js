import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import store from "../src/store/store"
import { Provider } from 'react-redux';
import { transitions, positions, Provider as AlertProvider } from 'react-alert'
import AlertTemplate from 'react-alert-template-basic'
const options = {
  // you can also just use 'bottom center'
  position: positions.BOTTOM_CENTER,
  timeout: 5000,
  // you can also just use 'scale'
  transition: transitions.SCALE
}
ReactDOM.render(
  <Provider store={store}>
  <AlertProvider template={AlertTemplate} {...options}>
    <App />
    </AlertProvider>
  </Provider>,
  (document.getElementById("root"))
);


