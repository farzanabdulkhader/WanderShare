import { NavLink, useParams } from "react-router-dom";
import "./NavLinks.css";
import { useAuth } from "../../context/AuthContext.jsx";
import { useEffect } from "react";
import Profile from "./Profile.jsx";

function NavLinks() {
  const { isAuthenticated, logout, user } = useAuth();

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
          {isAuthenticated && <Profile user={user} logout={logout} />}
        </>
      )}
    </ul>
  );
}

export default NavLinks;
