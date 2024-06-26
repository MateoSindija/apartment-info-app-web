import React, {useState} from "react";
import {auth} from "../firebase";
import {Navigate, Outlet} from "react-router-dom";
import {onAuthStateChanged} from "firebase/auth";

const ProtectedRoutes = () => {
    const [isUserLogged, setIsUserLogged] = useState(true);

    onAuthStateChanged(auth, (user) => {
        if (user) {
            setIsUserLogged(true);
        } else {
            setIsUserLogged(false);
        }
    });
    return isUserLogged ? <Outlet/> : <Navigate to={"/"} replace/>;
};

export default ProtectedRoutes;
