import { Navigate, Outlet } from "react-router-dom";

export default function PrivateRoutes({ auth }) {
  return auth ? <Outlet /> : <Navigate to="/login" replace />;
}
