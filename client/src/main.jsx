/* eslint-disable no-unused-vars */
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';


import Login from "./pages/login.jsx"
import Signup from "./pages/signup.jsx"
import Notfound from "./pages/notfound.jsx"
import Home from "./pages/home.jsx"




const router = createBrowserRouter([
 {path:"/" ,element: <Login />},
 {path:"/signup",element: <Signup />},
 {path:"/home",element: <Home />},
 {path:"*",element:<Notfound />}

])

createRoot(document.getElementById('root')).render(
  <StrictMode>
      <RouterProvider router={router} />
  </StrictMode>,
)
