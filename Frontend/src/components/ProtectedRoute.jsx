import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const instituteId = localStorage.getItem("institute_id");

  return instituteId ? children : <Navigate to="/" />;
}
