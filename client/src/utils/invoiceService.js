/**
 * Invoice Service - Generate PDF invoices for orders
 * Uses browser's print-to-PDF functionality
 */

// Generate invoice HTML template
export const generateInvoiceHTML = (order, user) => {
  const orderDate = new Date(order.createdAt || Date.now()).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const items = order.items || order.products || [];
  const subtotal = items.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);
  const discount = order.discount || 0;
  const shipping = order.shipping || 0;
  const tax = order.tax || (subtotal * 0.08); // 8% tax default
  const total = order.total || (subtotal - discount + shipping + tax);

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Invoice - Order #${order.id || order._id}</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          line-height: 1.6;
          color: #333;
          background: #fff;
          padding: 40px;
        }
        .invoice-container {
          max-width: 800px;
          margin: 0 auto;
          background: #fff;
        }
        .header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 40px;
          padding-bottom: 20px;
          border-bottom: 2px solid #e5e7eb;
        }
        .logo {
          font-size: 28px;
          font-weight: bold;
          color: #111;
        }
        .logo span {
          color: #ef4444;
        }
        .invoice-info {
          text-align: right;
        }
        .invoice-title {
          font-size: 32px;
          font-weight: bold;
          color: #111;
          margin-bottom: 8px;
        }
        .invoice-number {
          font-size: 14px;
          color: #666;
        }
        .invoice-date {
          font-size: 14px;
          color: #666;
        }
        .addresses {
          display: flex;
          justify-content: space-between;
          margin-bottom: 40px;
        }
        .address-block {
          flex: 1;
        }
        .address-block h3 {
          font-size: 12px;
          text-transform: uppercase;
          color: #888;
          margin-bottom: 8px;
          letter-spacing: 1px;
        }
        .address-block p {
          font-size: 14px;
          color: #333;
          margin-bottom: 4px;
        }
        .items-table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 30px;
        }
        .items-table th {
          background: #f9fafb;
          padding: 12px 16px;
          text-align: left;
          font-size: 12px;
          text-transform: uppercase;
          color: #666;
          letter-spacing: 0.5px;
          border-bottom: 2px solid #e5e7eb;
        }
        .items-table td {
          padding: 16px;
          border-bottom: 1px solid #e5e7eb;
          font-size: 14px;
        }
        .items-table .item-name {
          font-weight: 500;
        }
        .items-table .text-right {
          text-align: right;
        }
        .items-table .text-center {
          text-align: center;
        }
        .summary {
          margin-left: auto;
          width: 300px;
        }
        .summary-row {
          display: flex;
          justify-content: space-between;
          padding: 8px 0;
          font-size: 14px;
        }
        .summary-row.discount {
          color: #16a34a;
        }
        .summary-row.total {
          font-size: 18px;
          font-weight: bold;
          border-top: 2px solid #e5e7eb;
          padding-top: 16px;
          margin-top: 8px;
        }
        .footer {
          margin-top: 60px;
          padding-top: 20px;
          border-top: 1px solid #e5e7eb;
          text-align: center;
          font-size: 12px;
          color: #888;
        }
        .payment-status {
          display: inline-block;
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 500;
          text-transform: uppercase;
        }
        .status-paid {
          background: #dcfce7;
          color: #166534;
        }
        .status-pending {
          background: #fef3c7;
          color: #92400e;
        }
        .notes {
          margin-top: 30px;
          padding: 16px;
          background: #f9fafb;
          border-radius: 8px;
          font-size: 13px;
          color: #666;
        }
        @media print {
          body {
            padding: 20px;
          }
          .invoice-container {
            max-width: none;
          }
        }
      </style>
    </head>
    <body>
      <div class="invoice-container">
        <div class="header">
          <div>
            <div class="logo">Off<span>Shore</span></div>
            <p style="font-size: 12px; color: #666; margin-top: 8px;">Premium E-Commerce Store</p>
          </div>
          <div class="invoice-info">
            <div class="invoice-title">INVOICE</div>
            <div class="invoice-number">#${order.id || order._id || 'N/A'}</div>
            <div class="invoice-date">${orderDate}</div>
            <div style="margin-top: 8px;">
              <span class="payment-status ${order.status === 'completed' || order.status === 'paid' ? 'status-paid' : 'status-pending'}">
                ${order.status || 'Pending'}
              </span>
            </div>
          </div>
        </div>

        <div class="addresses">
          <div class="address-block">
            <h3>Bill To</h3>
            <p><strong>${user?.name || order.customerName || 'Customer'}</strong></p>
            <p>${user?.email || order.email || 'N/A'}</p>
            <p>${order.shippingAddress?.street || order.address || ''}</p>
            <p>${order.shippingAddress?.city || ''} ${order.shippingAddress?.state || ''} ${order.shippingAddress?.zip || ''}</p>
          </div>
          <div class="address-block" style="text-align: right;">
            <h3>From</h3>
            <p><strong>OffShore Inc.</strong></p>
            <p>support@offshore.com</p>
            <p>123 Commerce Street</p>
            <p>San Francisco, CA 94102</p>
          </div>
        </div>

        <table class="items-table">
          <thead>
            <tr>
              <th style="width: 50%;">Item</th>
              <th class="text-center">Qty</th>
              <th class="text-right">Price</th>
              <th class="text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            ${items.map(item => `
              <tr>
                <td class="item-name">${item.name || item.productName || 'Product'}</td>
                <td class="text-center">${item.quantity || 1}</td>
                <td class="text-right">$${(item.price || 0).toFixed(2)}</td>
                <td class="text-right">$${((item.price || 0) * (item.quantity || 1)).toFixed(2)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <div class="summary">
          <div class="summary-row">
            <span>Subtotal</span>
            <span>$${subtotal.toFixed(2)}</span>
          </div>
          ${discount > 0 ? `
          <div class="summary-row discount">
            <span>Discount ${order.couponCode ? `(${order.couponCode})` : ''}</span>
            <span>-$${discount.toFixed(2)}</span>
          </div>
          ` : ''}
          <div class="summary-row">
            <span>Shipping</span>
            <span>${shipping > 0 ? `$${shipping.toFixed(2)}` : 'Free'}</span>
          </div>
          <div class="summary-row">
            <span>Tax (8%)</span>
            <span>$${tax.toFixed(2)}</span>
          </div>
          <div class="summary-row total">
            <span>Total</span>
            <span>$${total.toFixed(2)}</span>
          </div>
        </div>

        ${order.notes ? `
        <div class="notes">
          <strong>Notes:</strong> ${order.notes}
        </div>
        ` : ''}

        <div class="footer">
          <p>Thank you for shopping with OffShore!</p>
          <p style="margin-top: 8px;">For questions, contact support@offshore.com</p>
          <p style="margin-top: 16px; font-size: 10px;">This invoice was generated electronically and is valid without signature.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

// Open invoice in new window for printing/saving as PDF
export const downloadInvoice = (order, user) => {
  const invoiceHTML = generateInvoiceHTML(order, user);
  
  // Create a new window
  const printWindow = window.open('', '_blank', 'width=800,height=600');
  
  if (printWindow) {
    printWindow.document.write(invoiceHTML);
    printWindow.document.close();
    
    // Wait for content to load then trigger print
    printWindow.onload = () => {
      setTimeout(() => {
        printWindow.print();
      }, 250);
    };
  } else {
    // Fallback if popup blocked
    alert('Please allow popups to download the invoice.');
  }
};

// Generate invoice as Blob URL (for direct download)
export const getInvoiceBlob = (order, user) => {
  const invoiceHTML = generateInvoiceHTML(order, user);
  const blob = new Blob([invoiceHTML], { type: 'text/html' });
  return URL.createObjectURL(blob);
};

export default {
  generateInvoiceHTML,
  downloadInvoice,
  getInvoiceBlob
};
