import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import {fetchUserById, fetchUserByToken} from "./services/service";

const root = ReactDOM.createRoot(document.getElementById('root'));
const token = localStorage.getItem("token");
const result =  token ? await fetchUserByToken(token) : null
const user = result && result.success ? await fetchUserById(result.userId) : null

root.render(
  <React.StrictMode>
    <App user={user} token={token}/>
  </React.StrictMode>
);
