import { NavLink } from "react-router-dom";
import "./Profile.css";
import { useState } from "react";

function Profile({ user, logout }) {
  const [isOpenDropdown, setIsOpenDropdown] = useState(false);

  function handleLogout() {
    logout();
  }

  return (
    <li
      onMouseEnter={() => setIsOpenDropdown(true)}
      onMouseLeave={() => setIsOpenDropdown(false)}
      className="profile"
    >
      <NavLink
        to="/"
        className={({ isActive }) => (isActive ? "active-link" : "")}
      >
        <div>
          <img src={user?.image} alt="profile" className="profile-image" />
          <div className={`dropdown ${isOpenDropdown ? "show" : ""}`}>
            <a onClick={handleLogout}>Logout</a>
          </div>
        </div>
      </NavLink>
    </li>
  );
}

export default Profile;
