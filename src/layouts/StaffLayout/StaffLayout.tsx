import { Outlet, Link } from "react-router-dom";

import {
    FaHome,
    FaUtensils,
    FaClipboardList,
    FaUser,
    FaImage,
    FaBell,
    FaSignOutAlt
} from "react-icons/fa";

import "./StaffLayout.css";

function StaffLayout() {

    return (

        <div className="staff-layout">

            <aside className="staff-sidebar">

                <div className="logo d-flex align-items-center gap-2 justify-content-center">
                    <img src="/icon.png" alt="Diego Kitchen Restaurant" width="60" height="60" />
                    { <h2 className="mb-0">Diego Kitchen Restaurant</h2> }
                </div>

                <nav>

                    <Link to="/staff">

                        <FaHome />

                        Dashboard

                    </Link>

                    <Link to="/staff/menu">

                        <FaUtensils />

                        Today's Menu

                    </Link>

                    <Link to="/staff/orders">

                        <FaClipboardList />

                        Kitchen Orders

                    </Link>

                    <Link to="/staff/gallery">

                        <FaImage />

                        Gallery

                    </Link>

                    <Link to="/staff/profile">

                        <FaUser />

                        Profile

                    </Link>

                    <Link to="/staff/notifications">

                        <FaBell />

                        Notifications

                    </Link>

                    <Link to="/login">

                        <FaSignOutAlt />

                        Logout

                    </Link>

                </nav>

            </aside>

            <main className="staff-content">

                <Outlet />

            </main>

        </div>

    );

}

export default StaffLayout;
