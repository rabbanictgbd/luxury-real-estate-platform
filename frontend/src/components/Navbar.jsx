import { useContext, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { AuthContext } from "../context/AuthProvider";

export default function Navbar() {
  const { profile, user, role, logout } = useContext(AuthContext);
  const [menuOpen, setMenuOpen] = useState(false);

  const navConfig = {
    guest: [
     
      { path: "/", label: "Home" },
      { path: "/properties", label: "Property Search" },
      { path: "/my-bookings", label: "My Bookings" },
      { path: "/login", label: "Login" },

    ],
    donor: [
      { path: "/", label: "Home" },
      { path: "/properties", label: "Property Search" },
      { path: "/my-bookings", label: "My Bookings" },
    ],
    admin: [
      { path: "/", label: "Home" },
      { path: "/property-entry", label: "Property Entry" },
      { path: "/properties", label: "Property Search" },
      { path: "/my-bookings", label: "My Bookings" },
    ],
  };

  const navItems = navConfig[role || "guest"];

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
  };

  return (
    <div className="navbar bg-base-100 sticky top-0 z-50 shadow-md px-22">
      {/* Logo */}
      <div className="flex-1">
        <Link to="/" className="text-2xl font-bold text-primary">
          Luxury Real State Platform
        </Link>
      </div>

      {/* Desktop Dropdown Menu */}
      <div className="flex-none hidden lg:flex items-center gap-3">
        <div className="dropdown dropdown-hover">

          <ul className="flex">
            {navItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `block px-3 py-2 rounded-md ${isActive
                      ? "bg-accen text-primary font-semibold"
                      : "hover:bg-gray-100"
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>

        {/* Profile Dropdown */}
        {user && (
          <div className="dropdown dropdown-hover dropdown-end">
            <label tabIndex={0}>
              <img
                className="w-10 h-10 rounded-full cursor-pointer"
                src={user?.image}
                alt="NoImg"
              />
            </label>
            <ul
              tabIndex={0}
              className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52"
            >
              <li>
                <NavLink to="/dashboard/profile">Profile</NavLink>
              </li>
              <li>
                <NavLink to="/dashboard">Dashboard</NavLink>
              </li>
              <li>
                <button onClick={handleLogout}>Logout</button>
              </li>
            </ul>
          </div>
        )}
      </div>

      {/* Mobile Menu */}
      <div className="flex-none lg:hidden">
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="btn btn-ghost text-xl"
        >
          ☰
        </button>
      </div>

      {/* Mobile Dropdown */}
      {menuOpen && (
        <div className="absolute top-16 right-4 bg-white shadow-lg rounded-lg p-3 w-48 lg:hidden z-50">
          <ul className="flex flex-col gap-2">
            {navItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  onClick={() => setMenuOpen(false)}
                  className={({ isActive }) =>
                    `block px-3 py-2 rounded-md ${isActive
                      ? "bg-red-100 text-primary font-semibold"
                      : "hover:bg-gray-100"
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
            {user && (
              <>
                <li>
                  <NavLink
                    to="/dashboard/profile"
                    onClick={() => setMenuOpen(false)}
                    className="block px-3 py-2 rounded-md hover:bg-gray-100"
                  >
                    Profile
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/dashboard"
                    onClick={() => setMenuOpen(false)}
                    className="block px-3 py-2 rounded-md hover:bg-gray-100"
                  >
                    Dashboard
                  </NavLink>
                </li>
                <li>
                  <button
                    onClick={handleLogout}
                    className="btn btn-error btn-sm text-white w-full"
                  >
                    Logout
                  </button>
                </li>
              </>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
