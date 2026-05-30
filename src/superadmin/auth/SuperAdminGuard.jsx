import { Navigate } from "react-router-dom";

export default function SuperAdminGuard({ children }) {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (!token || role !== "SUPER_ADMIN") {
    return <Navigate to="/owner/login" replace />;
  }

  return children;
}
