
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { ToastProvider } from './components/Toast.jsx';
import { ThemeProvider } from './components/ThemeContext.jsx';
import { SkipToContent } from './components/Accessibility.jsx';
import ScrollToTop from './components/ScrollToTop.jsx';
import AppWrapper from './components/AppWrapper.jsx';

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
import AddProductPage from "./pages/addproduct.jsx"
import ComplaintsPage from "./pages/complaints.jsx"
import WishlistPage from "./pages/wishlist.jsx"
import AdminLogin from "./pages/admin/adminlogin.jsx"
import AdminDashboard from "./pages/admin/admindashboard.jsx"
import ManageUsers from "./pages/admin/ManageUsers.jsx"
import ManageProducts from "./pages/admin/ManageProducts.jsx"
import ViewOrders from "./pages/admin/ViewOrders.jsx"
import ViewConcerns from "./pages/admin/ViewConcerns.jsx"
import Analytics from "./pages/admin/Analytics.jsx"


const flipper = createBrowserRouter([
 {path:"/" ,element: <Home />},
 {path:"/app", element: <App />},
 {path:"/product/:id", element: <ProductDetails />},
 {path:"/signup",element: <Signup />},
 {path:"/login", element:<Login />},
 {path:"/profile/",element: <Profile />},
 {path:"/dashboard/",element:<Dashboard />},
 {path:"/add-product",element:<AddProductPage />},
 {path:"/cart",element:<CartPage />},
 {path:"/checkout",element:<CheckoutPage />},
 {path:"/order-confirmation",element:<OrderConfirmation />},
 {path:"/orders",element:<OrdersPage />},
 {path:"/categories",element:<CategoriesPage />},
 {path:"/complaints",element:<ComplaintsPage />},
 {path:"/wishlist",element:<WishlistPage />},
 {path:"/admin/login",element:<AdminLogin />},
 {path:"/admin/dashboard",element:<AdminDashboard />},
 {path:"/admin/manage-users",element:<ManageUsers />},
 {path:"/admin/manage-products",element:<ManageProducts />},
 {path:"/admin/view-orders",element:<ViewOrders />},
 {path:"/admin/view-concerns",element:<ViewConcerns />},
 {path:"/admin/analytics",element:<Analytics />},
 {path:"*",element:<Notfound />}
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
      <ToastProvider>
        <SkipToContent />
        <RouterProvider router={flipper} />
        <ScrollToTop />
      </ToastProvider>
    </ThemeProvider>
  </StrictMode>
)
