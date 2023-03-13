import React from 'react';
import { auth } from "./utils/firebase";
import { useAuthState } from 'react-firebase-hooks/auth';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
    // eslint-disable-next-line
    const [user, loading] = useAuthState(auth);
    return user ? <Outlet /> : <Navigate to="/login" />
};

export default ProtectedRoute;
