import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toggleSidebar } from "../redux/sidebarSlice";
import type { RootState } from "../redux/store";
import { useNavigate } from "react-router-dom";
import {
  FaTasks,
  FaProjectDiagram,
  FaHome,
  FaTimes,
  FaBars,
  FaChevronDown,
  FaChevronUp,
  FaUser,
} from "react-icons/fa";
import { FaPerson } from "react-icons/fa6";

const Sidebar: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isOpen = useSelector((state: RootState) => state.sidebar.isOpen);
  const [active, setIsActive] = useState("");
  const [openMenus, setOpenMenus] = useState<{ [key: string]: boolean }>({
    Projects: false,
    Tasks: false,
  });

  const toggleMenu = (menu: string) => {
    setOpenMenus((prev) => ({ ...prev, [menu]: !prev[menu] }));
  };

  const navItems = [
    { name: "Dashboard", icon: <FaHome />, path: "/dashboard" },
    {
      name: "Projects",
      icon: <FaProjectDiagram />,
      path: "/dashboard/projects",
    },
    {
      name: "Tasks",
      icon: <FaTasks />,
      path: "/dashboard/tasks",
    },
    {
      name: "Profile",
      icon: <FaUser />,
      path: "/dashboard/profile",
    },
  ];

  return (
    <div
      className={`fixed top-0 left-0 h-full z-50 bg-[#E0E4F2] shadow-md transition-all duration-300`}
      style={{ width: isOpen ? "250px" : "60px" }}
    >
      <div className="flex items-center justify-between px-5 py-10">
        {isOpen && <span className="text-xl font-bold">TaskPro</span>}
        <button
          onClick={() => dispatch(toggleSidebar())}
          className="cursor-pointer"
        >
          {isOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      <nav className="flex flex-col mt-4 space-y-3">
        {navItems.map((item) => (
          <div key={item.name} className="flex flex-col">
            <button
              className={`flex items-center px-4 py-3 text-left transition cursor-pointer
                ${
                  active === item.name
                    ? "bg-[#A9C2DA] text-blue-900 font-semibold rounded-2xl"
                    : "text-gray-800 hover:bg-[#C4D6E8] rounded-2xl"
                }
                `}
              onClick={() => {
                if (item?.submenu) {
                  toggleMenu(item.name);
                } else {
                  navigate(item.path!);
                }
                setIsActive(item.name);
              }}
            >
              <span className="text-lg">{item.icon}</span>
              {isOpen && (
                <span className="ml-3 flex-grow flex justify-between items-center">
                  {item.name}
                  {Array.isArray(item.submenu) &&
                    item.submenu.length > 0 &&
                    (openMenus[item.name] ? (
                      <FaChevronUp className="ml-2" />
                    ) : (
                      <FaChevronDown className="ml-2" />
                    ))}
                </span>
              )}
            </button>

            {Array.isArray(item.submenu) &&
              item.submenu.length > 0 &&
              openMenus[item.name] &&
              isOpen && (
                <div className="ml-10 mt-1 flex flex-col space-y-5">
                  {item.submenu.map((sub) => (
                    <button
                      key={sub.name}
                      onClick={() => navigate(sub.path)}
                      className="text-left text-sm text-gray-700 hover:text-gray-900"
                    >
                      {sub.name}
                    </button>
                  ))}
                </div>
              )}
          </div>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
