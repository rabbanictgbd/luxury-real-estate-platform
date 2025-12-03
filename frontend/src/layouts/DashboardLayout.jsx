import { Outlet } from "react-router-dom";
import Topbar from "../components/Topbar";
import LeftSide from "../components/LeftSide";

const DashboardLayout = () => {
  return (
    <div className="flex">
      <LeftSide />

      {/* Main Content */}
      <main className="flex-1  ">
        <Topbar />
        <div className="pl-6 ml-6">

        <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
