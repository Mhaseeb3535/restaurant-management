import { Outlet, Link } from "react-router-dom";
import {
  FaHome,
  FaShoppingCart,
  FaCalendarCheck,
  FaUsers,
  FaMoneyBillWave,
  FaUserFriends,
  FaImage,
  FaCog,
  FaSignOutAlt,
} from "react-icons/fa";

import "./AdminLayout.css";

function AdminLayout() {
  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">

        <div className="admin-logo d-flex align-items-center gap-2 justify-content-center">
          <img src="/icon.png" alt="Diego Kitchen Restaurant" width="60" height="60"  />
          { <span>Diego Kitchen Restaurant</span> }
        </div>

        <nav>

          <Link to="/admin">
            <FaHome /> Dashboard
          </Link>

          <Link to="/admin/orders">
            <FaShoppingCart /> Orders
          </Link>

          <Link to="/admin/reservations">
            <FaCalendarCheck /> Reservations
          </Link>

          <Link to="/admin/staff">
            <FaUsers /> Staff
          </Link>

          <Link to="/admin/gallery">
            <FaImage /> Gallery
          </Link>

          <Link to="/admin/customers">
            <FaUserFriends /> Customers
          </Link>

          <Link to="/admin/finance">
            <FaMoneyBillWave /> Finance
          </Link>

          <Link to="/admin/settings">
            <FaCog /> Settings
          </Link>

          <Link to="/login">
            <FaSignOutAlt /> Logout
          </Link>

        </nav>
      </aside>

      <main className="admin-content">
        <Outlet />
      </main>
    </div>
  );
}

export default AdminLayout;
