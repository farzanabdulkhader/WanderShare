import { Link } from "react-router-dom";
import "./MainHeader.css";
import MainNavigation from "./MainNavigation.jsx";


function MainHeader() {
  return (
    <div className="main-header">
      <Link to={"/"}>
        <h1>
          <span
            className="app-logo
          "
          >
            🏕️
          </span>
          WanderShare
        </h1>
      </Link>
      <MainNavigation />
      
    </div>
  );
}

export default MainHeader;
