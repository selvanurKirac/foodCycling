import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'

 

 
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Home from './components/Home.jsx';
import Login from './components/Login.jsx';
import SignUp from './components/SignUp.jsx';
 
 
 
 
 
       
ReactDOM.createRoot(document.getElementById('root')).render(
  <App/>  
)