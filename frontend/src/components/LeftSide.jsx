import { Link, NavLink } from "react-router-dom";
import {
  AiOutlineHome,
  AiOutlineUser,
  AiOutlineGift,
  AiOutlineFileText,
  AiOutlineProfile,
  AiOutlineUnorderedList,
  AiOutlinePlus,
} from "react-icons/ai";

const menuItems = [
  { name: "Home", path: "/", icon: <AiOutlineHome /> },
  { name: "Dashboard", path: "/dashboard", icon: <AiOutlineUser /> },
  { name: "My Requests", path: "/my-donation-requests", icon: <AiOutlineUnorderedList /> },
  { name: "All Users", path: "/all-users", icon: <AiOutlineUser /> },
  { name: "Manage Blogs", path: "/dashboard/content-management", icon: <AiOutlineFileText /> },
  { name: "All Requests", path: "/all-donation-requests", icon: <AiOutlineUnorderedList /> },
  { name: "Blood Request", path: "/requests", icon: <AiOutlineGift /> },
  { name: "Blogs", path: "/blogs", icon: <AiOutlineFileText /> },
  { name: "Add Blog", path: "/dashboard/content-management/add-blog", icon: <AiOutlinePlus /> },
];

const LeftSide = () => {
  return (
    <aside className="bg-red-900 text-white min-h-screen fixed lg:relative w-16 lg:w-64 transition-all duration-300">
      {/* Desktop: full sidebar */}
      <div className="hidden lg:block sticky top-0 z-50 p-5">
        <h2 className="text-xl font-bold mb-4">Dashboard</h2>
        <ul className="space-y-3">
          {menuItems.map((item) => (
            <li key={item.name}>
              <NavLink
                to={item.path}
                className={({ isActive })=>
                `flex items-center gap-2 p-2 ${isActive ? "bg-red-800" :  "hover:bg-red-700 rounded"}`
                }
              >
                {item.icon}
                <span>{item.name}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </div>

      {/* Mobile: only icons */}
      <div className="lg:hidden flex flex-col min-h-screen p-4 space-y-4">
        {menuItems.map((item) => (
          <Link
            key={item.name}
            to={item.path}
            className="flex justify-center p-2 hover:bg-red-800 rounded"
          >
            {item.icon}
          </Link>
        ))}
      </div>
    </aside>
  );
};

export default LeftSide;
