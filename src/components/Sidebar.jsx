import { LayoutDashboard, History, LogOut, ShieldAlert } from 'lucide-react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../application/store/useAuthStore';
import { motion } from 'framer-motion';
import '../styles/Sidebar.css';
import { toast } from 'react-toastify';

const Sidebar = () => {
    const { logout, user } = useAuthStore();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        toast.info('Logged out successfully');
        navigate('/');
    };

    return (
        <motion.aside
            className="sidebar glass-panel"
            initial={{ x: -240 }}
            animate={{ x: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
        >
            <div className="sidebar-header">
                <ShieldAlert className="brand-icon" size={28} color="var(--accent-primary)" />
                <span className="brand-name">Sentinel<span className="brand-highlight" style={{ color: 'var(--accent-primary)' }}>AI</span></span>
            </div>

            <nav className="sidebar-nav">
                <NavLink to="/dashboard" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} end>
                    <LayoutDashboard size={20} />
                    <span>Detector</span>
                </NavLink>

                {/* Hide History for Guests if the API enforces it, but let's show it and handle gracefully backend */}
                {!user?.isGuest && (
                    <NavLink to="/history" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                        <History size={20} />
                        <span>History</span>
                    </NavLink>
                )}

                <div className="nav-spacer" style={{ flexGrow: 1 }}></div>

                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleLogout}
                    className="nav-item bottom-item"
                    style={{ border: 'none', background: 'transparent', width: '100%', cursor: 'pointer', textAlign: 'left' }}
                >
                    <LogOut size={20} />
                    <span>Logout</span>
                </motion.button>
            </nav>
        </motion.aside>
    );
};

export default Sidebar;
