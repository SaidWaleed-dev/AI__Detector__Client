import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../../../application/store/useAuthStore';
import DashboardLayout from '../../../components/DashboardLayout';

const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, isLoading, user } = useAuthStore();

    if (isLoading) {
        return <div style={{height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>Loading...</div>;
    }

    if (!isAuthenticated && !user?.isGuest) {
        return <Navigate to="/auth/login" replace />;
    }

    return <DashboardLayout>{children}</DashboardLayout>;
};

export default ProtectedRoute;