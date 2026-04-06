import React from 'react';
import { Navigate } from 'react-router-dom';

// StudentDashboard redirects to /home (main student page)
const StudentDashboard = () => <Navigate to="/home" replace />;

export default StudentDashboard;
