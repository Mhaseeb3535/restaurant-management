# Cart-to-Order Flow Implementation

## Backend Changes
- [x] 1. Update `server/db-init.js` - Add `Refund Requested` status, add `payment_status` column
- [x] 2. Update `server/routes/orders.js` - Multi-item support, refund endpoint, payment status

## Frontend Changes
- [ ] 3. Create `src/pages/Customer/Checkout.tsx` - Full checkout page with all cart items
- [ ] 4. Create `src/pages/Customer/OrderDetail.tsx` - Order detail/slip page with refund option
- [ ] 5. Update `src/pages/Customer/Cart.tsx` - Wire "Proceed to Checkout" to checkout page
- [ ] 6. Update `src/pages/Customer/Orders.tsx` - View detail link, refund request button
- [ ] 7. Update `src/pages/Admin/Orders/Orders.tsx` - Real API integration
- [ ] 8. Update `src/App.tsx` - Add checkout and order detail routes
- [ ] 9. Update `src/components/Navbar/Navbar.tsx` - Update checkout flow
- [ ] 10. Update `src/layouts/CustomerLayout/CustomerLayout.tsx` - Add Cart link

