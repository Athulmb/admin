// src/components/Layout.js
import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Dashboard from "./Pages/Dashboard";
import Sidebar from "./Components/Common/SideBar";
import Users from "./Components/Users";
import AdminServices from "./Components/Services";
import ProgramsAdmin from "./Components/Program";
import AdminUserStories from "./Components/AdminUserStory";
import AdminPricing from "./Components/AdminPricing";
import AdminCenters from "./Components/AdminCenters";
import AdminSports from "./Components/AdminSports";



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
          <Route path="/service" element={<AdminServices />} />
          <Route path="/programs" element={<ProgramsAdmin />} />
          <Route path="/story" element={<AdminUserStories />} />
          <Route path="/pricing" element={<AdminPricing />} />
          <Route path="/centers" element={<AdminCenters />} />
          <Route path="/sports" element={<AdminSports />} />









          
         

          {/* Add more nested routes here */}
        </Routes>
      </div>
    </div>
  );
};

export default Layout;