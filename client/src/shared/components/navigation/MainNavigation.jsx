import { useState } from "react";
import { TiThMenu } from "react-icons/ti";

import NavLinks from "./NavLinks";
import SideDrawer from "./SideDrawer";
import Backdrop from "../UIElements/Backdrop";
import "./MainNavigation.css";

function MainNavigation() {
  const [isOpenSideDrawer, setIsOpenSideDrawer] = useState(false);

  const handleClickMenuIcon = () => {
    setIsOpenSideDrawer(true);
  };

  const handleClickSideDrawer = () => {
    setIsOpenSideDrawer(false);
  };

  return (
    <>
      <div className="main-navigation">
        <NavLinks />
      </div>
      {<TiThMenu className="menu-icon" onClick={handleClickMenuIcon} />}
      {isOpenSideDrawer && (
        <Backdrop onClickBackdrop={() => setIsOpenSideDrawer(false)} />
      )}
      <SideDrawer
        onClickSideDrawer={handleClickSideDrawer}
        isOpenSideDrawer={isOpenSideDrawer}
      >
        <NavLinks />
      </SideDrawer>
    </>
  );
}

export default MainNavigation;
