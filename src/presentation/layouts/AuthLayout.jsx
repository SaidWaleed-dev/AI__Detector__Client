import { Outlet, Navigate } from 'react-router-dom';
import { useAuthStore } from '../../application/store/useAuthStore';
import { motion } from 'framer-motion';
import './AuthLayout.css';
import { Sparkles, Binary, CheckCircle2 } from 'lucide-react';

const AuthLayout = () => {
    const { isAuthenticated } = useAuthStore();

    if (isAuthenticated) {
        return <Navigate to="/dashboard" replace />;
    }

    return (
        <div className="auth-layout">
            <motion.div 
                className="auth-banner"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
            >
                <div className="banner-content">
                    <motion.div 
                        className="logo"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                    >
                        <img src="/logo.jpg" alt="Logo" style={{ width: '64px', height: '64px', borderRadius: '12px', objectFit: 'cover', filter: 'drop-shadow(0 0 10px var(--accent-glow))' }} />
                        <h1 style={{ fontFamily: 'var(--font-heading)' }}>Sentinel AI</h1>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4, duration: 0.5 }}
                    >
                        <p className="banner-text">Defend Digital Authenticity with Deep Neural Forensics.</p>
                        
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginTop: '4rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: 'var(--text-secondary)' }}>
                                <Binary size={24} color="var(--accent-primary)" />
                                <span>Multi-Modal Deepfake Analysis</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: 'var(--text-secondary)' }}>
                                <Sparkles size={24} color="var(--accent-primary)" />
                                <span>LLM Stylometric Verification</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: 'var(--text-secondary)' }}>
                                <CheckCircle2 size={24} color="var(--accent-primary)" />
                                <span>99.4% Accuracy Rating</span>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </motion.div>
            <motion.div 
                className="auth-form-container"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
            >
                <Outlet />
            </motion.div>
        </div>
    );
};

export default AuthLayout;
