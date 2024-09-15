import { Outlet } from "react-router-dom";
import MainHeader from "./shared/components/navigation/MainHeader";

function AppLayout() {
  return (
    <div>
      <MainHeader />
      <Outlet />
    </div>
  );
}

export default AppLayout;
