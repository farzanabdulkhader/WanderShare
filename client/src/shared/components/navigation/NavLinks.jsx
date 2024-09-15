import { NavLink, useParams } from "react-router-dom";
import "./NavLinks.css";
import { useAuth } from "../../context/AuthContext.jsx";
import { useEffect } from "react";

function NavLinks() {
  const { isAuthenticated, logout, user } = useAuth();

  function handleLogout() {
    logout();
  }

  return (
    <ul className="nav-links">
      <li>
        <NavLink
          to="/"
          end
          className={({ isActive }) => (isActive ? "active-link" : "")}
        >
          All Users
        </NavLink>
      </li>
      {!isAuthenticated && (
        <li>
          <NavLink
            to="/auth"
            className={({ isActive }) => (isActive ? "active-link" : "")}
          >
            Authenticate
          </NavLink>
        </li>
      )}
      <li>
        <NavLink
          to="/places/new"
          className={({ isActive }) => (isActive ? "active-link" : "")}
        >
          New Place
        </NavLink>
      </li>
      {isAuthenticated && user.id && (
        <>
          <li>
            <NavLink
              to={`/${user.id}/places`}
              className={({ isActive }) => (isActive ? "active-link" : "")}
            >
              My Places
            </NavLink>
          </li>
          <li>
            <NavLink
              onClick={handleLogout}
              to="/"
              className={({ isActive }) => (isActive ? "active-link" : "")}
            >
              Logout
            </NavLink>
          </li>
        </>
      )}
    </ul>
  );
}

export default NavLinks;
