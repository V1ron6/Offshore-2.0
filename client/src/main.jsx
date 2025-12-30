
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';

import Login from "./pages/login.jsx"
import Signup from "./pages/signup.jsx"
import Notfound from "./pages/notfound.jsx"
import Home from "./pages/home.jsx"
import App from "./App.jsx"
import Profile from "./pages/profile.jsx"
import Dashboard from "./pages/dashboard.jsx"
import ProductDetails from "./pages/productdetails.jsx"
import CartPage from "./pages/cart.jsx"
import CheckoutPage from "./pages/checkout.jsx"
import OrderConfirmation from "./pages/orderconfirmation.jsx"
import OrdersPage from "./pages/orders.jsx"
import CategoriesPage from "./pages/categories.jsx"


const flipper = createBrowserRouter([
 {path:"/" ,element: <Home />},
 {path:"/app", element: <App />},
 {path:"/product/:id", element: <ProductDetails />},
 {path:"/signup",element: <Signup />},
 {path:"/login", element:<Login />},
 {path:"/profile/",element: <Profile />},
 {path:"/dashboard/",element:<Dashboard />},
 {path:"/cart",element:<CartPage />},
 {path:"/checkout",element:<CheckoutPage />},
 {path:"/order-confirmation",element:<OrderConfirmation />},
 {path:"/orders",element:<OrdersPage />},
 {path:"/categories",element:<CategoriesPage />},
 {path:"*",element:<Notfound />}
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
      <RouterProvider router={flipper} />
  </StrictMode>,
)
