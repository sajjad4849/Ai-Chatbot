import React, { useState } from "react";
import ChatInput from "../components/ChatInput";
import Sidebar from "../components/Sidebar";
import { RxTextAlignLeft } from "react-icons/rx";

function HomePage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <Sidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Main Content */}
      <div className="flex-1 bg-gray-800 text-white p-4 relative overflow-hidden">
        {/* Mobile Sidebar Toggle Button */}
        <button
          onClick={toggleSidebar}
          className="lg:hidden absolute top-4 left-4 z-50 text-white text-3xl"
        >
          <RxTextAlignLeft />
        </button>

        {/* Main content (same for all screens) */}
        <div className="flex flex-col justify-end items-center text-center min-h-screen px-4 pb-6 pt-10 lg:pt-0 lg:justify-center overflow-hidden overscroll-none">
          <div className="mb-6">
            <h1 className="text-3xl font-bold mb-2">Main Content</h1>
            <p className="mb-4">This content is always visible.</p>
          </div>

          {/* ChatInput at bottom with good spacing */}
          <div className="w-full max-w-xl">
            <ChatInput />
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
