
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';


import Login from "./pages/login.jsx"
import Signup from "./pages/signup.jsx"
import Notfound from "./pages/notfound.jsx"
import Home from "./pages/home.jsx"
import App from "./App.jsx"



const router = createBrowserRouter([
 {path:"/" ,element: <App />},
 {path:"/signup",element: <Signup />},
 {path:"/home",element: <Home />},
 {path:"/login", element:<Login />},
 {path:"*",element:<Notfound />}

])

createRoot(document.getElementById('root')).render(
  <StrictMode>
      <RouterProvider router={router} />
  </StrictMode>,
)
