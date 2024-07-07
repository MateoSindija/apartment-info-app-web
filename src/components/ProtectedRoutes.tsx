import React, { useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

const ProtectedRoutes = () => {
  const userID = useSelector((state: RootState) => state.user.id);
  return userID ? <Outlet /> : <Navigate to={"/"} replace />;
};

export default ProtectedRoutes;
