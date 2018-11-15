import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import store from './store';
import { BrowserRouter as Router} from 'react-router-dom';
import { Main } from './components';

ReactDOM.render(
  <Provider store={store}>
      <Router>
        <Main />
      </Router>
  </Provider>,
  document.getElementById('app')
);