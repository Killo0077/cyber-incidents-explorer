import React from "react";
import { Routes, Route } from "react-router-dom";

import Navigation from "./Navigation.jsx";
import LandingPage from "./LandingPage.jsx";
import HomePage from "./HomePage.jsx";
import LoginPage from "./LoginPage.jsx";
import SignupPage from "./SignupPage.jsx";
import ReportsPage from "./ReportsPage.jsx";
import AccountsPage from "./AccountsPage.jsx";
import ChangePasswordPage from "./ChangePasswordPage.jsx";
import TableViewPage from "./TableViewPage.jsx";
import VisualizationView from "./VisualizationView.jsx";
import ProtectedRoute from "./ProtectedRoute.jsx";

export default function App() {
  return (
    <div className="app-root">
      <Navigation />

      <Routes>
        {/* Landing page – choose where to go */}
        <Route path="/" element={<LandingPage />} />

        {/* Auth */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        {/* Protected area */}
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/reports"
          element={
            <ProtectedRoute>
              <ReportsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/accounts"
          element={
            <ProtectedRoute>
              <AccountsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/change-password"
          element={
            <ProtectedRoute>
              <ChangePasswordPage />
            </ProtectedRoute>
          }
        />

        {/* 👉 YOUR PAGES – NOT protected for now */}
        <Route path="/table-view" element={<TableViewPage />} />
        <Route path="/visualizations" element={<VisualizationView />} />
      </Routes>
    </div>
  );
}
