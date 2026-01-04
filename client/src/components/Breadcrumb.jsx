/**
 * Breadcrumb Component - Navigation breadcrumbs
 */

import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

// Route name mappings
const routeNames = {
  '': 'Home',
  'app': 'Products',
  'product': 'Product Details',
  'login': 'Login',
  'signup': 'Sign Up',
  'dashboard': 'Dashboard',
  'profile': 'Profile',
  'cart': 'Shopping Cart',
  'checkout': 'Checkout',
  'orders': 'Orders',
  'order-confirmation': 'Order Confirmed',
  'categories': 'Shop',
  'complaints': 'Help & Support',
  'wishlist': 'Wishlist',
  'admin': 'Admin',
  'manage-users': 'Manage Users',
  'manage-products': 'Manage Products',
  'view-orders': 'View Orders',
  'view-concerns': 'View Concerns',
  'analytics': 'Analytics'
};

const Breadcrumb = ({ customItems = null, className = '' }) => {
  const location = useLocation();
  
  // Use custom items if provided
  if (customItems) {
    return (
      <nav className={`flex items-center gap-2 text-sm ${className}`} aria-label="Breadcrumb">
        {customItems.map((item, index) => (
          <div key={index} className="flex items-center gap-2">
            {index > 0 && <ChevronRight size={16} className="text-gray-400" />}
            {item.href ? (
              <Link
                to={item.href}
                className="text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition"
              >
                {index === 0 && <Home size={16} className="inline mr-1" />}
                {item.label}
              </Link>
            ) : (
              <span className="text-gray-900 dark:text-white font-medium">
                {item.label}
              </span>
            )}
          </div>
        ))}
      </nav>
    );
  }

  // Auto-generate from current path
  const pathSegments = location.pathname.split('/').filter(Boolean);
  
  // Don't show breadcrumb on home page
  if (pathSegments.length === 0) return null;

  const breadcrumbs = pathSegments.map((segment, index) => {
    const href = '/' + pathSegments.slice(0, index + 1).join('/');
    const isLast = index === pathSegments.length - 1;
    
    // Handle dynamic segments (like product IDs)
    let label = routeNames[segment] || segment;
    if (!isNaN(segment)) {
      label = `#${segment}`;
    }

    return {
      label,
      href: isLast ? null : href
    };
  });

  // Add home at the beginning
  breadcrumbs.unshift({ label: 'Home', href: '/' });

  return (
    <nav 
      className={`flex items-center gap-2 text-sm py-3 px-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg ${className}`}
      aria-label="Breadcrumb"
    >
      {breadcrumbs.map((item, index) => (
        <div key={index} className="flex items-center gap-2">
          {index > 0 && <ChevronRight size={16} className="text-gray-400 shrink-0" />}
          {item.href ? (
            <Link
              to={item.href}
              className="text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition flex items-center gap-1"
            >
              {index === 0 && <Home size={14} />}
              <span className="truncate max-w-[100px] sm:max-w-none">{item.label}</span>
            </Link>
          ) : (
            <span className="text-gray-900 dark:text-white font-medium truncate max-w-[150px] sm:max-w-none">
              {item.label}
            </span>
          )}
        </div>
      ))}
    </nav>
  );
};

export default Breadcrumb;
