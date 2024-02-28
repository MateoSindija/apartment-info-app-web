import React, { useEffect, useState } from "react";
import { auth } from "../firebase.ts";
import { Navigate, Outlet } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";

const ProtectedRoutes = () => {
  const [isUserLogged, setIsUserLogged] = useState(true);

  onAuthStateChanged(auth, (user) => {
    if (user) {
      setIsUserLogged(true);
    } else {
      setIsUserLogged(false);
    }
  });
  return isUserLogged ? <Outlet /> : <Navigate to={"/"} replace />;
};

export default ProtectedRoutes;
