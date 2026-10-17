import { useState } from "react";
import { Dropdown } from "react-bootstrap";
import { FaUserCircle, FaCog, FaSignOutAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function ProfileDropdown() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  return (
    <Dropdown show={open} onToggle={() => setOpen(!open)}>
      <Dropdown.Toggle variant="light" className="d-flex align-items-center gap-2 border-0" id="profile-dropdown">
        <FaUserCircle size={30} className="text-secondary" />
        <span className="d-none d-md-inline">Admin</span>
      </Dropdown.Toggle>
      <Dropdown.Menu>
        <Dropdown.Item onClick={() => navigate("/admin/settings")}>
          <FaCog className="me-2" /> Settings
        </Dropdown.Item>
        <Dropdown.Divider />
        <Dropdown.Item onClick={() => navigate("/login")}>
          <FaSignOutAlt className="me-2" /> Logout
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
}

export default ProfileDropdown;
