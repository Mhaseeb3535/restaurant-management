import { Outlet, Link } from "react-router-dom";
import {
  FaHome,
  FaChartLine,
  FaUsers,
  FaMoneyBillWave,
  FaChartBar,
  FaFileAlt,
  FaCog,
  FaSignOutAlt,
} from "react-icons/fa";

import "./SuperAdminLayout.css";

function SuperAdminLayout() {
  return (
    <div className="super-layout">

      <aside className="super-sidebar">

        <div className="logo d-flex align-items-center gap-2 justify-content-center">
          <img src="/icon.png" alt="Diego Kitchen Restaurant" width="60" height="60"  />
          <h2 className="mb-0">Diego Kitchen Restaurant</h2>
        </div>

        <nav>

          <Link to="/super-admin">
            <FaHome />
            Dashboard
          </Link>

          <Link to="/super-admin/analytics">
            <FaChartLine />
            Analytics
          </Link>

          <Link to="/super-admin/traffic">
            <FaChartBar />
            Customer Traffic
          </Link>

          <Link to="/super-admin/staff">
            <FaUsers />
            Staff
          </Link>

          <Link to="/super-admin/finance">
            <FaMoneyBillWave />
            Finance
          </Link>

          <Link to="/super-admin/reports">
            <FaFileAlt />
            Reports
          </Link>

          <Link to="/super-admin/settings">
            <FaCog />
            Settings
          </Link>

          <Link to="/login">
            <FaSignOutAlt />
            Logout
          </Link>

        </nav>

      </aside>

      <main className="super-content">
        <Outlet />
      </main>

    </div>
  );
}

export default SuperAdminLayout;
