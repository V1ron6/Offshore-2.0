# 🧪 Testing Guide - New Ecommerce Pages

## Quick Test Walkthrough

Follow this step-by-step guide to test all new pages and features:

---

## 1. **Home Page (/) - Starting Point**

### What to Test:

- ✅ Click "Browse Products" button
  - Should navigate to `/categories`
- ✅ Click "Get Started" button
  - Should navigate to `/signup`
- ✅ Verify responsive design
  - Desktop: Hero section with side-by-side layout
  - Mobile: Stacked layout with full-width buttons

---

## 2. **Categories/Shop Page (/categories) - NEW**

### What to Test:

**Filters (Left Sidebar)**

- ✅ Click category buttons
  - "All Products" → Shows 12 items
  - "Electronics" → Shows 6 items
  - "Accessories" → Shows 6 items
- ✅ Click star rating checkboxes
  - Should filter by minimum rating (UI only)
- ✅ Adjust price range slider
  - Slider should update (UI only)

**Sorting Dropdown**

- ✅ Select "Featured" → Default order
- ✅ Select "Price: Low to High" → Items sorted by price ascending
- ✅ Select "Price: High to Low" → Items sorted by price descending
- ✅ Select "Highest Rated" → Items sorted by rating

**View Mode Toggle**

- ✅ Click grid icon → Shows 3-column grid
- ✅ Click list icon → Shows full-width list view
- ✅ Product info visible in both modes

**Product Cards**

- ✅ Hover over card → Wishlist heart appears
- ✅ "View Product" button → Navigates to `/product/:id`
- ✅ Shows:
  - Product name
  - Star rating with count
  - Price in red
  - Image/emoji

---

## 3. **Product Details Page (/product/:id) - Existing**

### What to Test:

- ✅ Page loads with product info
- ✅ Quantity selector (+/- buttons)
- ✅ "Add to Cart" button
  - Check success message appears
  - Message disappears after 3 seconds
  - Stock count decreases (if tracked)
- ✅ Product description visible

**After Adding to Cart:**

- ✅ Cart badge updates in navbar
- ✅ Item count shows in cart icon

---

## 4. **Cart Page (/cart) - NEW**

### Test with Items in Cart:

**Cart Items Display**

- ✅ All items show with:
  - Product image
  - Product name & price
  - Quantity controls (+/-)
  - Subtotal per item
  - Remove button

**Quantity Controls**

- ✅ Click "+" → Quantity increases
- ✅ Click "-" → Quantity decreases
- ✅ Total price updates automatically
- ✅ Click trash icon → Item removed from cart

**Promo Codes**

- ✅ Enter "SAVE10" → 10% discount applied
- ✅ Enter "SAVE20" → 20% discount applied
- ✅ Enter invalid code → No discount
- ✅ Discount shows in green in summary
- ✅ Total updates with discount

**Order Summary (Right Panel)**

- ✅ Shows:
  - Subtotal
  - Shipping (Free)
  - Tax (10% of subtotal)
  - Discount amount (if applied)
  - Final total in red
- ✅ Sticky on scroll
- ✅ "Proceed to Checkout" button

**Empty Cart**

- ✅ Empty cart message shows
- ✅ "Continue Shopping" button visible
- ✅ Navigates to `/categories`

---

## 5. **Checkout Page (/checkout) - NEW**

### Step 1: Shipping Information

**Form Validation**

- ✅ Click "Continue to Payment" without filling form
  - Error messages appear for empty fields
- ✅ Enter invalid email → Error message
- ✅ Fill all fields correctly
  - First Name: "John"
  - Last Name: "Doe"
  - Email: "john@example.com"
  - Phone: "+1-555-0000"
  - Address: "123 Main St"
  - City: "New York"
  - State: "NY"
  - ZIP: "10001"
- ✅ Click "Continue to Payment" → Step 2 loads

**Order Summary Sidebar**

- ✅ Shows all cart items
- ✅ Shows totals (Subtotal, Shipping, Tax)
- ✅ Total amount visible

### Step 2: Payment Information

**Form Display**

- ✅ Progress indicator shows step 2/2
- ✅ "Back" button visible (click to go back)
- ✅ "Place Order" button visible

**Payment Form Validation**

- ✅ Leave fields empty → Error messages
- ✅ Enter invalid card number → Error
  - Must be 16 digits
- ✅ Enter invalid CVV → Error
  - Must be 3-4 digits
- ✅ Fill form correctly:
  - Cardholder: "John Doe"
  - Card Number: "1234 5678 9012 3456"
  - Expiry: "12/25"
  - CVV: "123"
- ✅ Click "Place Order" → Processing...
  - Button shows disabled state
  - After ~1.5s: Navigates to `/order-confirmation`

---

## 6. **Order Confirmation Page (/order-confirmation) - NEW**

### What to Test:

**Success Message**

- ✅ Large checkmark icon with animation
- ✅ "Thank You for Your Order!" heading
- ✅ Confirmation message visible
- ✅ Order number displayed (ORD-XXXXXXXX format)

**Order Status Timeline**

- ✅ Shows 4 stages:
  1. Order Confirmed ✓ (green, completed)
  2. Processing (yellow, animated - pulsing)
  3. Shipped (gray, pending)
  4. Delivered (gray, pending)
- ✅ Lines connect the stages
- ✅ Animated dots below title

**Delivery Information**

- ✅ Shipping Address Card
  - Shows sample address
  - Estimated delivery date (3 days from now)
- ✅ Tracking Information Card
  - Shows tracking number
  - "Track Shipment" button (clickable but no action)

**Guidance Section**

- ✅ "What's Next?" card visible
- ✅ Track shipment info
- ✅ Inspect items info

**Action Buttons**

- ✅ "Continue Shopping" → Navigates to `/dashboard`
- ✅ "View All Orders" → Navigates to `/orders`

**Contact Info**

- ✅ Support email visible
- ✅ Support phone visible

---

## 7. **Orders History Page (/orders) - NEW**

### What to Test:

**Orders List**

- ✅ Shows 4 sample orders (if no real orders exist)
- ✅ Each order card displays:
  - Order number (ORD-XXXXXXX)
  - Order date (formatted: "Dec 30, 2025")
  - Status badge (Delivered/Shipped/Processing)
  - Total price in red
  - Item count

**Order Selection**

- ✅ Click an order card → Details panel updates
- ✅ Hover effect on card
- ✅ Only one order selected at a time

**Order Details Panel (Right Sidebar)**

- ✅ Shows selected order details:
  - Status with icon
  - Order number (monospace font)
  - Order date (formatted)
  - Estimated delivery
  - Tracking number (if available)
  - Order total in large red text

**Status Indicators**

- ✅ Delivered: Green badge with ✓
- ✅ Shipped: Blue badge with 📦
- ✅ Processing: Yellow badge with ⧗
- ✅ Cancelled: Red badge with ✕

**Action Buttons** (visible in details panel)

- ✅ "Track Shipment" button (for shipped/delivered)
- ✅ "Reorder Items" button (clickable but no action)
- ✅ "Return Items" button (clickable but no action)

**Reviews Section**

- ✅ For delivered orders: "Write a Review" button visible
- ✅ Star rating review section shown

**Empty State**

- ✅ If no orders: "No Orders Yet" message
- ✅ Helpful text shown
- ✅ Package icon displayed

---

## 8. **Cart Synchronization Test**

### Test Cross-Page Sync:

1. **Add item from Categories**

   - Go to `/categories`
   - Click "View Product" on any item
   - Click "Add to Cart"
   - Check cart badge updates

2. **Navigate to Cart**

   - Click cart icon or go to `/cart`
   - Verify item shows in cart
   - Update quantity
   - Go back to Dashboard
   - Return to `/cart`
   - ✅ Quantity persists (localStorage)

3. **Open Multiple Tabs**
   - Open `/categories` in two browser tabs
   - Add item from Tab 1
   - Switch to Tab 2
   - ✅ Cart icon updates (event-based sync)

---

## 9. **Responsive Design Test**

### Mobile (375px width)

- ✅ All pages stack vertically
- ✅ Buttons full-width
- ✅ Images scale appropriately
- ✅ Text readable without zooming
- ✅ Navigation accessible
- ✅ Forms properly sized

### Tablet (768px width)

- ✅ Two-column layouts work
- ✅ Sidebars visible or collapsible
- ✅ Proper spacing maintained
- ✅ Images sized correctly

### Desktop (1024px+ width)

- ✅ Three-column layouts visible
- ✅ Sticky sidebars function
- ✅ Hover effects work
- ✅ Full feature set visible

---

## 10. **Navigation Test**

### Navbar Links (when logged in):

- ✅ Home → `/`
- ✅ Dashboard → `/dashboard`
- ✅ Shop → `/categories`
- ✅ Orders → `/orders`
- ✅ Profile → `/profile`
- ✅ Cart icon → Opens cart dropdown

### Mobile Menu (when logged in):

- ✅ Hamburger opens menu
- ✅ All same links visible
- ✅ Logout button present

### In-Page Links:

- ✅ "Continue Shopping" buttons → `/categories` or `/dashboard`
- ✅ "View All Orders" → `/orders`
- ✅ Product cards → `/product/:id`
- ✅ Back buttons work

---

## 11. **Error Handling Test**

### Form Validation Errors:

- ✅ Email validation works
- ✅ Required field messages show
- ✅ Card validation messages show
- ✅ Error styling (red borders, red text)
- ✅ Errors clear when field updated

### Loading States:

- ✅ Cart page shows spinner when loading
- ✅ Checkout shows spinner when loading
- ✅ Orders page shows spinner when loading
- ✅ Smooth transitions

### Success Messages:

- ✅ "Added to cart" message shows (3s duration)
- ✅ Promo code application confirmed
- ✅ Order placed success page displays

---

## 📊 Test Checklist

```
General
  ☐ All pages load without errors
  ☐ No console errors
  ☐ All links work correctly
  ☐ Responsive at all breakpoints

Cart Functionality
  ☐ Items add to cart
  ☐ Quantity updates
  ☐ Remove item works
  ☐ Total recalculates
  ☐ Promo codes apply
  ☐ Cart persists on page reload

Checkout
  ☐ Form validates correctly
  ☐ Step progression works
  ☐ Back button functions
  ☐ Order number generates
  ☐ Navigates to confirmation

Orders
  ☐ Order list displays
  ☐ Click to select works
  ☐ Details panel updates
  ☐ Status badges show correct colors
  ☐ Buttons are clickable

Navigation
  ☐ All navbar links work
  ☐ Mobile menu works
  ☐ In-page navigation works
  ☐ Back buttons function
  ☐ Cart icon updates

Responsive
  ☐ Mobile layout proper
  ☐ Tablet layout proper
  ☐ Desktop layout proper
  ☐ Images scale correctly
  ☐ Text readable at all sizes
```

---

## 🚀 Quick Links for Testing

Once you're logged in, here are the direct URLs:

- **Shop:** http://localhost:5173/categories
- **Cart:** http://localhost:5173/cart
- **Checkout:** http://localhost:5173/checkout
- **Order Confirmation:** http://localhost:5173/order-confirmation
- **Orders:** http://localhost:5173/orders
- **Dashboard:** http://localhost:5173/dashboard
- **Profile:** http://localhost:5173/profile

---

## ✅ All Tests Complete?

If you've checked everything above, your ecommerce site is fully functional! 🎉

**Ready for next phase:** Backend API integration
