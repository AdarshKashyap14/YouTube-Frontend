import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

export default function PrivateRoute() {
  const {currentuser} = useSelector((state) => state.user);
  return currentuser? <Outlet /> : <Navigate to="/sign-in" />;
}
