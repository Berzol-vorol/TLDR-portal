import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import {getCookies} from "./utils/util";
import { inject } from '@vercel/analytics';

inject();

const root = ReactDOM.createRoot(document.getElementById('root'));
const cookies = await getCookies()


root.render(
  <React.StrictMode>
    <App user={cookies.user} token={cookies.token}/>
  </React.StrictMode>
);
