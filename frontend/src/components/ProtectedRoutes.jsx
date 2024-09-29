import React from "react";
import { Navigate, Outlet } from "react-router-dom";

function ProtectedRoutes() {
  let token = sessionStorage.getItem("token");
  console.log(token)
  if (token) {
    return <Outlet />;
  } else {
   return <Navigate to="/" />;
  }
}

export default ProtectedRoutes;
