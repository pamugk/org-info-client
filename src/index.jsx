import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from "react-router-dom";

import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import { ruRU } from '@material-ui/core/locale';

import './index.css';

import App from './app/App';
import * as serviceWorker from './serviceWorker';

const theme = createMuiTheme(ruRU);

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <App />
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);

serviceWorker.unregister();
