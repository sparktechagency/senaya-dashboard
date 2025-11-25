import { motion } from "framer-motion";
import {
  Car,
  ChevronDown,
  ChevronUp,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageCircle,
  Package,
  Settings,
  Sparkle,
  User,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { MdBrandingWatermark, MdWork, MdWorkHistory } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { Link, NavLink, useLocation } from "react-router-dom";
import { toggleSidebar } from "../redux/sidebarSlice";
import { MdDiscount  } from "react-icons/md";
import type { RootState } from "../redux/store";
import { SiOrganicmaps } from "react-icons/si";
import { SiWorkplace } from "react-icons/si";

interface MenuItem {
  name: string;
  path?: string;
  icon: React.ElementType;
  subItems?: { name: string; path: string }[];
}

const AdminNavbar: React.FC = () => {
  const dispatch = useDispatch();
  const { isCollapsed } = useSelector((state: RootState) => state.sidebar);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  console.log("🚀 ~ AdminNavbar ~ isLoggedIn:", isLoggedIn);

  // ✅ Store open state per dropdown
  const [openDropdowns, setOpenDropdowns] = useState<{
    [key: string]: boolean;
  }>({});

  const location = useLocation();
console.log(isLoggedIn);
  const menuItems: MenuItem[] = [
    { name: "Dashboard", icon: LayoutDashboard, path: "/admin/dashboard" },
    { name: "Profile", icon: User, path: "/admin/profile" },
    { name: "Car", icon: Car, path: "/admin/car" },
    { name: "Country", icon: SiOrganicmaps, path: "/admin/country" },
    { name: "Brand", icon: MdBrandingWatermark, path: "/admin/brand" },
    { name: "Car Model", icon: Car, path: "/admin/carmodel" },
    { name: "Workshop", icon: MdWorkHistory, path: "/admin/workShop" },
    { name: "WorkCategory", icon: SiWorkplace, path: "/admin/workCategory" },
    { name: "Work", icon: MdWork, path: "/admin/workList" },
    { name: "Spare", icon: Sparkle, path: "/admin/Spare" },
    { name: "Cupon", icon: MdDiscount, path: "/admin/cupon" },
    { name: "User Feedback", icon: MessageCircle, path: "/admin/message" },
    {
      name: "Subscription",
      icon: Package,
      subItems: [
        { name: "Package", path: "/admin/package" },
        { name: "Subscription", path: "/admin/Subscription" },
      ],
    },
    {
      name: "Setting",
      icon: Settings,
      subItems: [
        { name: "Privacy Policy", path: "/admin/privacy-policy" },
        { name: "About Us", path: "/admin/about-us" },
        { name: "Support", path: "/admin/support" },
        { name: "Service", path: "/admin/service" },
        // { name: "Account Delete", path: "/admin/account-delete" },
      ],
    },
  ];

  const checkLoginStatus = () => {
    const token = localStorage.getItem("accessToken");
    setIsLoggedIn(!!token);
  };

  useEffect(() => {
    checkLoginStatus();

    const handleAuthChange = () => {
      checkLoginStatus();
    };

    window.addEventListener("authChange", handleAuthChange);

    return () => {
      window.removeEventListener("authChange", handleAuthChange);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");

    window.dispatchEvent(new Event("authChange"));
    setIsLoggedIn(false);
    window.location.reload();
  };

  const toggleDropdown = (name: string) => {
    setOpenDropdowns((prev) => ({
      ...prev,
      [name]: !prev[name],
    }));
  };

  // Check if dropdown should be open based on path or toggle state
  const isDropdownOpen = (
    name: string,
    subItems?: { name: string; path: string }[]
  ) => {
    if (subItems) {
      return (
        openDropdowns[name] ||
        subItems.some((sub) => sub.path === location.pathname)
      );
    }
    return false;
  };

  return (
    <div
      className={`${
        isCollapsed ? "w-20" : "w-64"
      } bg-[#1771B7] text-white h-screen flex flex-col transition-all duration-300 fixed`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-blue-400">
        {!isCollapsed && (
          <Link to="/">
            <h1 className="text-xl font-bold">AdminPanel</h1>
          </Link>
        )}
        <button
          onClick={() => dispatch(toggleSidebar())}
          className="hover:text-gray-100"
        >
          <Menu size={22} />
        </button>
      </div>

      {/* Menu Items */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex-1 mt-4 space-y-1 overflow-y-auto"
      >
        {menuItems.map(({ name, icon: Icon, path, subItems }) => {
          const open = isDropdownOpen(name, subItems);

          return (
            <div key={name}>
              {subItems ? (
                <>
                  {/* Dropdown Parent */}
                  <button
                    onClick={() => toggleDropdown(name)}
                    className={`flex items-center justify-between w-full p-3 rounded-md transition-all ${
                      open
                        ? "bg-linear-to-tr from-blue-500 via-purple-500 to-pink-500 text-white font-bold"
                        : "hover:bg-blue-700"
                    }`}
                  >
                    <div className="flex items-center">
                      <Icon size={20} />
                      {!isCollapsed && <span className="ml-3">{name}</span>}
                    </div>
                    {!isCollapsed &&
                      (open ? (
                        <ChevronUp size={18} />
                      ) : (
                        <ChevronDown size={18} />
                      ))}
                  </button>

                  {/* Dropdown Items */}
                  {open && !isCollapsed && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="ml-10 mt-1 space-y-1"
                    >
                      {subItems.map((sub) => (
                        <NavLink
                          key={sub.name}
                          to={sub.path}
                          className={({ isActive }) =>
                            `block text-sm p-2 rounded-md transition-all ${
                              isActive
                                ? "bg-blue-600 font-semibold"
                                : "hover:bg-blue-500"
                            }`
                          }
                        >
                          {sub.name}
                        </NavLink>
                      ))}
                    </motion.div>
                  )}
                </>
              ) : (
                // Normal menu item
                <NavLink
                  to={path!}
                  className={({ isActive }) =>
                    `flex items-center w-full p-3 rounded-md transition-all ${
                      isActive
                        ? "bg-linear-to-tr from-blue-500 via-purple-500 to-pink-500 font-bold text-white"
                        : "hover:bg-blue-700"
                    }`
                  }
                >
                  <Icon size={20} />
                  {!isCollapsed && <span className="ml-3">{name}</span>}
                </NavLink>
              )}
            </div>
          );
        })}
      </motion.div>

      {/* Footer */}
      <div className="p-4 border-t border-blue-400">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div className="flex items-center space-x-3">
              <img
                src="https://i.pravatar.cc/40"
                alt="admin"
                className="h-8 w-8 rounded-full"
              />
              <div>
                <p className="text-sm font-semibold">Admin</p>
                <p className="text-xs text-gray-200">Super Admin</p>
              </div>
            </div>
          )}
          <button
            className="text-red-400 hover:text-red-500"
            onClick={handleLogout}
          >
            <LogOut size={20} />
          </button>
        </div>
        {/* {isLoggedIn ? (
          
        ) : (
          <Link
            to="/login"
            className="flex items-center justify-between px-4 py-2 bg-blue-950 rounded-xl"
          >
            <p className="font-semibold">Login</p>
            <VscSignIn size={22} />
          </Link>
        )} */}
      </div>
    </div>
  );
};

export default AdminNavbar;
