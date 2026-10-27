import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children, role }) => {
  const {
    currentUser,
    isDoctor,
    isAdmin,
    loading, // ✅ make sure your AuthContext provides this
  } = useAuth();

  const location = useLocation();

  // ✅ Wait until auth state is ready
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-slate-500 font-semibold">
        Checking authentication...
      </div>
    );
  }

  // ❌ Not logged in
  if (!currentUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // ❌ Role-based protection
  if (role) {
    const roles = Array.isArray(role) ? role : [role];

    const hasAccess =
      (roles.includes("admin") && isAdmin) ||
      (roles.includes("doctor") && isDoctor) ||
      (roles.includes("user") && !isDoctor && !isAdmin);

    if (!hasAccess) {
      return <Navigate to="/" replace />;
    }
  }

  // ✅ Allowed
  return children;
};

export default ProtectedRoute;