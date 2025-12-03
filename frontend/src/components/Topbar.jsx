import { useContext } from "react";
import { AuthContext } from "../context/AuthProvider";
import { Link } from "react-router-dom";

const Topbar = () => {
  const {profile, user, logOut } = useContext(AuthContext);

  const handleLogout = async () => {
    try {
      await logOut(); // depends on your AuthProvider implementation
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  return (
    <div className="navbar bg-red-900 text-white px-6 shadow-md">
      {/* Website Title */}
      <div className="flex-1">
        <Link to="/" className="text-xl pl-6 ml-6 font-bold">
          🩸 Blood Donation App
        </Link>
      </div>

      {/* Avatar + Dropdown */}
      <div className="flex-none">
        <div className="dropdown dropdown-end">
          <div tabIndex={0} role="button" className="flex items-center gap-2 cursor-pointer">
            <div className="avatar">
              <div className="w-10 rounded-full border-2 border-white">
                <img
                  src={profile?.image}
                  alt="avatar"
                />
              </div>
            </div>
            <span className="font-medium hidden sm:block">{profile?.name || "Guest"}</span>
          </div>

          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-white text-gray-700 rounded-box w-52"
          >
            <li>
              <Link to="dashboard/profile">👤 Profile</Link>
            </li>
            {/* <li>
              <button onClick={handleLogout}>🚪 Logout</button>
            </li> */}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Topbar;
