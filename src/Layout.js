// src/components/Layout.js
import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Dashboard from "./Pages/Dashboard";
import Sidebar from "./Components/Common/SideBar";
import Users from "./Components/Users";



// import other pages as needed

const Layout = () => {
  const location = useLocation();

  // Conditionally hide sidebar for specific paths
  const hideSidebarPaths = ["/"]; // you can add more if needed

  const shouldShowSidebar = !hideSidebarPaths.includes(location.pathname);

  return (
    <div className="flex h-screen bg-gradient-to-br from-green-600 to-black text-gray-100 overflow-hidden">
      {shouldShowSidebar && <Sidebar />}
      <div className="flex-grow">
        
        <Routes>
          <Route path="/overview" element={<Dashboard />} />
          <Route path="/users" element={<Users />} />

          
         

          {/* Add more nested routes here */}
        </Routes>
      </div>
    </div>
  );
};

export default Layout;