import { Outlet, NavLink, useNavigate } from "react-router-dom";
import {
  FaArrowLeft,
  FaBell,
  FaHome,
  FaShoppingCart,
  FaShoppingBag,
  FaCalendarAlt,
  FaHeart,
  FaUser,
  FaCog,
  FaSignOutAlt,
} from "react-icons/fa";
import { Badge, Button } from "react-bootstrap";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import { useNotifications } from "../../context/NotificationContext";

import "./CustomerLayout.css";

function CustomerLayout() {
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const { itemCount } = useCart();
  const { unreadCount } = useNotifications();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="customer-layout">

      {/* Sidebar */}
      <aside className="sidebar">

        <div className="logo d-flex align-items-center gap-2 justify-content-center">
          <img src="/icon.png" alt="Diego Kitchen Restaurant" width="60" height="60"  />
          { <h2 className="mb-0">Diego Kitchen Restaurant</h2> }
        </div>

        <ul>

          <li>
            <NavLink to="/">
              <FaArrowLeft /> Back to Home
            </NavLink>
          </li>

          <li>
            <NavLink to="/customer" end>
              <FaHome /> Dashboard
            </NavLink>
          </li>

          <li>
            <NavLink to="/customer/orders">
              <FaShoppingBag /> My Orders
            </NavLink>
          </li>

          <li>
            <NavLink to="/customer/reservations">
              <FaCalendarAlt /> Reservations
            </NavLink>
          </li>

          <li>
            <NavLink to="/customer/notifications">
              <FaBell /> Notifications
              
              {unreadCount > 0 ? <Badge bg="warning" text="dark">{unreadCount}</Badge> : null}
            </NavLink>
          </li>

          <li>
            <NavLink to="/customer/favorites">
              <FaHeart /> Favorites
            </NavLink>
          </li>

          <li>
            <NavLink to="/customer/profile">
              <FaUser /> Profile
            </NavLink>
          </li>

          <li>
            <NavLink to="/customer/settings">
              <FaCog /> Settings
            </NavLink>
          </li>

          <li>
            <button type="button" className="sidebar-logout" onClick={handleLogout}>
              <FaSignOutAlt /> Logout
            </button>
          </li>

        </ul>

      </aside>

      {/* Main Content */}
      <main className="dashboard-content">
        <div className="customer-quickbar">
          <div className="customer-quickbar__welcome">
            <p className="customer-quickbar__eyebrow">Customer portal</p>
            <h4 className="customer-quickbar__title">Welcome {user?.name || "Customer"}</h4>
          </div>

          <div className="customer-quickbar__actions">
            <Button
              variant="warning"
              className="customer-cart-shortcut position-relative"
              onClick={() => navigate("/customer/cart")}
            >
              <FaShoppingCart />
              <span className="customer-cart-shortcut__label">Cart</span>
              {itemCount > 0 ? (
                <Badge bg="danger" pill className="position-absolute top-0 start-100 translate-middle">
                  {itemCount}
                </Badge>
              ) : null}
            </Button>
          </div>
        </div>
        <Outlet />
      </main>

    </div>
  );
}

export default CustomerLayout;
