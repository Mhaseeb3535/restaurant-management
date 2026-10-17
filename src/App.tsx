import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";

import Home from "./pages/Home/Home";
import AboutPage from "./pages/About/AboutPage";
import GalleryPage from "./pages/Gallery/GalleryPage";
import MenuPage from "./pages/Menu/MenuPage";
import ReservationPage from "./pages/Reservation/ReservationPage";
import ContactPage from "./pages/Contact/ContactPage";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import ForgotPassword from "./pages/Login/ForgotPassword";
import ResetPassword from "./pages/Login/ResetPassword";

// Customer
import CustomerDashboard from "./pages/Customer/CustomerDashboard";
import CustomerLayout from "./layouts/CustomerLayout/CustomerLayout";
import CustomerOrders from "./pages/Customer/Orders";
import CustomerReservations from "./pages/Customer/Reservations";
import CustomerCart from "./pages/Customer/Cart";
import CustomerCheckout from "./pages/Customer/Checkout";
import CustomerOrderDetail from "./pages/Customer/OrderDetail";
import CustomerFavorites from "./pages/Customer/Favorites";
import CustomerProfile from "./pages/Customer/Profile";
import CustomerSettings from "./pages/Customer/Settings";
import CustomerNotifications from "./pages/Customer/Notifications";

// Staff
import StaffLayout from "./layouts/StaffLayout/StaffLayout";
import StaffDashboard from "./pages/Staff/Dashboard/Dashboard";
import StaffMenu from "./pages/Staff/Menu/Menu";
import StaffOrders from "./pages/Staff/Orders/Orders";
import StaffProfile from "./pages/Staff/Profile/Profile";
import StaffGallery from "./pages/Staff/Gallery/Gallery";
import StaffNotifications from "./pages/Staff/Notifications/Notifications";

// Admin
import AdminLayout from "./layouts/AdminLayout/AdminLayout";
import AdminDashboard from "./pages/Admin/Dashboard/Dashboard";
import AdminOrders from "./pages/Admin/Orders/Orders";
import AdminReservations from "./pages/Admin/Reservations/Reservations";
import AdminStaff from "./pages/Admin/Staff/Staff";
import AdminMenu from "./pages/Admin/Menu/Menu";
import AdminCustomers from "./pages/Admin/Customers/Customers";
import AdminFinance from "./pages/Admin/Finance/Finance";
import AdminGallery from "./pages/Admin/Gallery/Gallery";
import AdminSettings from "./pages/Admin/Settings/Settings";

// Super Admin
import SuperAdminLayout from "./layouts/SuperAdminLayout/SuperAdminLayout";
import SuperDashboard from "./pages/SuperAdmin/Dashboard/Dashboard";
import SuperAnalytics from "./pages/SuperAdmin/Analytics/Analytics";
import SuperTraffic from "./pages/SuperAdmin/Traffic/Traffic";
import SuperStaff from "./pages/SuperAdmin/Staff/Staff";
import SuperFinance from "./pages/SuperAdmin/Finance/Finance";
import SuperReports from "./pages/SuperAdmin/Reports/Reports";
import SuperSettings from "./pages/SuperAdmin/Settings/Settings";

import AnimatedPage from "./components/AnimatedPage/AnimatedPage";
import PizzaARPage from "./pages/PizzaARPage";

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Public Routes */}
        <Route path="/" element={<AnimatedPage><Home /></AnimatedPage>} />
        <Route path="/about" element={<AnimatedPage><AboutPage /></AnimatedPage>} />
        <Route path="/gallery" element={<AnimatedPage><GalleryPage /></AnimatedPage>} />
        <Route path="/menu" element={<AnimatedPage><MenuPage /></AnimatedPage>} />
        <Route path="/pizza-ar" element={<AnimatedPage><PizzaARPage /></AnimatedPage>} />
        <Route path="/reservation" element={<AnimatedPage><ReservationPage /></AnimatedPage>} />
        <Route path="/contact" element={<AnimatedPage><ContactPage /></AnimatedPage>} />
        <Route path="/login" element={<AnimatedPage><Login /></AnimatedPage>} />
        <Route path="/register" element={<AnimatedPage><Register /></AnimatedPage>} />
        <Route path="/forgot-password" element={<AnimatedPage><ForgotPassword /></AnimatedPage>} />
        <Route path="/reset-password" element={<AnimatedPage><ResetPassword /></AnimatedPage>} />

        {/* Customer Routes */}
        <Route path="/customer" element={<CustomerLayout />}>
          <Route index element={<AnimatedPage><CustomerDashboard /></AnimatedPage>} />
          <Route path="orders" element={<AnimatedPage><CustomerOrders /></AnimatedPage>} />
          <Route path="orders/:id" element={<AnimatedPage><CustomerOrderDetail /></AnimatedPage>} />
          <Route path="reservations" element={<AnimatedPage><CustomerReservations /></AnimatedPage>} />
          <Route path="cart" element={<AnimatedPage><CustomerCart /></AnimatedPage>} />
          <Route path="checkout" element={<AnimatedPage><CustomerCheckout /></AnimatedPage>} />
          <Route path="favorites" element={<AnimatedPage><CustomerFavorites /></AnimatedPage>} />
          <Route path="notifications" element={<AnimatedPage><CustomerNotifications /></AnimatedPage>} />
          <Route path="profile" element={<AnimatedPage><CustomerProfile /></AnimatedPage>} />
          <Route path="settings" element={<AnimatedPage><CustomerSettings /></AnimatedPage>} />
        </Route>

        {/* Staff Routes */}
        <Route path="/staff" element={<StaffLayout />}>
          <Route index element={<AnimatedPage><StaffDashboard /></AnimatedPage>} />
          <Route path="menu" element={<AnimatedPage><StaffMenu /></AnimatedPage>} />
          <Route path="orders" element={<AnimatedPage><StaffOrders /></AnimatedPage>} />
          <Route path="gallery" element={<AnimatedPage><StaffGallery /></AnimatedPage>} />
          <Route path="profile" element={<AnimatedPage><StaffProfile /></AnimatedPage>} />
          <Route path="notifications" element={<AnimatedPage><StaffNotifications /></AnimatedPage>} />
        </Route>

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AnimatedPage><AdminDashboard /></AnimatedPage>} />
          <Route path="menu" element={<AnimatedPage><AdminMenu /></AnimatedPage>} />
          <Route path="orders" element={<AnimatedPage><AdminOrders /></AnimatedPage>} />
          <Route path="reservations" element={<AnimatedPage><AdminReservations /></AnimatedPage>} />
          <Route path="staff" element={<AnimatedPage><AdminStaff /></AnimatedPage>} />
          <Route path="gallery" element={<AnimatedPage><AdminGallery /></AnimatedPage>} />
          <Route path="customers" element={<AnimatedPage><AdminCustomers /></AnimatedPage>} />
          <Route path="finance" element={<AnimatedPage><AdminFinance /></AnimatedPage>} />
          <Route path="settings" element={<AnimatedPage><AdminSettings /></AnimatedPage>} />
        </Route>

        {/* Super Admin Routes */}
        <Route path="/super-admin" element={<SuperAdminLayout />}>
          <Route index element={<AnimatedPage><SuperDashboard /></AnimatedPage>} />
          <Route path="analytics" element={<AnimatedPage><SuperAnalytics /></AnimatedPage>} />
          <Route path="traffic" element={<AnimatedPage><SuperTraffic /></AnimatedPage>} />
          <Route path="staff" element={<AnimatedPage><SuperStaff /></AnimatedPage>} />
          <Route path="finance" element={<AnimatedPage><SuperFinance /></AnimatedPage>} />
          <Route path="reports" element={<AnimatedPage><SuperReports /></AnimatedPage>} />
          <Route path="settings" element={<AnimatedPage><SuperSettings /></AnimatedPage>} />
        </Route>
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AnimatedRoutes />
    </BrowserRouter>
  );
}

export default App;
