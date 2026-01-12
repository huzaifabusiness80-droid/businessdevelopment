import React from 'react';
import { Navigate } from 'react-router-dom';

// Redirect old Users page to Company & Users page
const Users = () => {
    return <Navigate to="/company" replace />;
};

export default Users;
