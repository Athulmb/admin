import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./Pages/Login";
import Layout from "./Layout";
import PrivateRoute from "./utils/PrivateRoutes";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
  path="/*"
  element={
    <PrivateRoute>
      <Layout />
    </PrivateRoute>
  }
/>
        {/* Redirect root to login */}
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
};

export default App;
