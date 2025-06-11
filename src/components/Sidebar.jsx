// src/components/Sidebar.jsx
import React from "react";
import { IoIosClose } from "react-icons/io";
import { FiMoreVertical } from "react-icons/fi";

function Sidebar({ isSidebarOpen, toggleSidebar }) {
  const historyItems = [
    "Project load issue",
    "My code is not working",
    "Give me commands",
    "I am working with Tailwind",
  ];

  return (
    <div
      className={`fixed top-0 left-0 h-full w-64 bg-slate-900 text-white transform transition-transform duration-300 z-40
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0 lg:static lg:block`}
    >
      {/* Mobile Header */}
      <div className="flex justify-between items-center px-3 pt-3 lg:hidden">
        <h5 className="m-0">Sidebar</h5>
        <IoIosClose
          className="text-2xl cursor-pointer"
          onClick={toggleSidebar}
        />
      </div>

      {/* Sidebar List */}
      <ul className="px-3 pt-4 lg:pt-5 space-y-2">
        {historyItems.map((item, index) => (
          <li
            key={index}
            className="relative group py-2 px-3 rounded-md text-sm font-medium text-gray-300 hover:bg-[#334155] hover:text-white transition-all flex justify-between items-center"
          >
            <span>{item}</span>
            <span className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-400">
              <FiMoreVertical />
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Sidebar;
