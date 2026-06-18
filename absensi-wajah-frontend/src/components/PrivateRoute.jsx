import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children, adminOnly = false }) => {
    const token = localStorage.getItem('auth_token');
    if (!token) return <Navigate to="/login" />;

    if (adminOnly) {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        if (user.role !== 'admin') return <Navigate to="/attendance" />;
    }

    return children;
};

export default PrivateRoute;
