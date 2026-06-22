import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../../application/store/useAuthStore';
import { useSettingsStore } from '../../application/store/useSettingsStore';
import { translations } from '../../application/utils/translations';
import { UserCircle2, ArrowRight, Loader2, User, Home, ChevronLeft, LogIn } from 'lucide-react';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';

const Login = () => {
    const navigate = useNavigate();
    const { login, guestLogin, googleLogin, isLoading } = useAuthStore();
    const { lang } = useSettingsStore();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const t = translations[lang];

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(email, password);
            toast.success(lang === 'ar' ? 'تم تسجيل الدخول بنجاح!' : 'Logged in successfully!');
            navigate('/dashboard');
        } catch (err) {
            toast.error(err.response?.data?.message || (lang === 'ar' ? 'فشل تسجيل الدخول' : 'Failed to login'));
        }
    };

    const handleGuest = async () => {
        try {
            await guestLogin();
            toast.success(lang === 'ar' ? 'المتابعة كزائر' : 'Continuing as Guest');
            navigate('/dashboard');
        } catch {
            toast.error(lang === 'ar' ? 'فشل دخول الزائر' : 'Guest login failed');
        }
    };

    const containerVariants = {
        hidden: { opacity: 0, scale: 0.98 },
        visible: { 
            opacity: 1, 
            scale: 1, 
            transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1], staggerChildren: 0.08 } 
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 12 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
    };

    return (
        <motion.div 
            className="auth-card"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            style={{ position: 'relative' }}
        >
            <Link to="/" className="back-home-btn" style={{ gap: '0.5rem', display: 'flex', alignItems: 'center' }}>
                <ChevronLeft size={18} style={{ transform: lang === 'ar' ? 'rotate(180deg)' : 'none' }} />
                <Home size={18} />
                <span>{t.back_home}</span>
            </Link>

            <motion.div className="auth-header" variants={itemVariants} style={{ marginTop: '1.5rem' }}>
                <div style={{
                    background: 'rgba(212, 175, 55, 0.1)',
                    width: '72px', height: '72px',
                    borderRadius: '20px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    margin: '0 auto 1.5rem',
                    border: '1px solid rgba(212, 175, 55, 0.2)',
                    boxShadow: '0 0 20px rgba(212, 175, 55, 0.1)'
                }}>
                    <UserCircle2 size={40} color="var(--accent-primary)" />
                </div>
                <h2 style={{ fontSize: '2.2rem', fontFamily: 'var(--font-heading)', fontWeight: 800 }}>{t.login_title}</h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>{t.login_subtitle}</p>
            </motion.div>

            <motion.form className="auth-form" onSubmit={handleSubmit} variants={itemVariants} style={{ gap: '1.5rem' }}>
                <div className="form-group">
                    <label>{t.email}</label>
                    <input 
                        type="email" 
                        required 
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <label style={{ marginBottom: 0 }}>{t.password}</label>
                        <Link to="/auth/forgot-password" style={{ fontSize: '0.85rem', color: 'var(--accent-primary)', textDecoration: 'none', fontWeight: 600 }}>{t.forgot_password}</Link>
                    </div>
                    <input 
                        type="password" 
                        required 
                        placeholder="••••••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>

                <motion.button 
                    whileHover={{ scale: isLoading ? 1 : 1.01, filter: 'brightness(1.1)' }}
                    whileTap={{ scale: isLoading ? 1 : 0.98 }}
                    type="submit" 
                    className="primary-btn auth-submit-btn" 
                    disabled={isLoading}
                    style={{ width: '100%', borderRadius: '16px', height: '3.6rem', fontSize: '1.1rem', display: 'flex', gap: '0.5rem', alignItems: 'center', justifyContent: 'center' }}
                >
                    {isLoading ? <Loader2 className="animate-spin" size={22} /> : (
                        <>
                            <span>{t.login_btn}</span>
                            <LogIn size={20} style={{ transform: lang === 'ar' ? 'scaleX(-1)' : 'none' }} />
                        </>
                    )}
                </motion.button>
            </motion.form>

            <motion.div className="guest-divider" variants={itemVariants}>
                <span>{t.continue_guest ? t.continue_guest.toUpperCase() : 'OR'}</span>
            </motion.div>

            <motion.button 
                whileHover={{ scale: isLoading ? 1 : 1.01, background: 'rgba(255, 255, 255, 0.05)' }}
                whileTap={{ scale: isLoading ? 1 : 0.98 }}
                type="button" 
                className="guest-btn" 
                onClick={handleGuest} 
                disabled={isLoading}
                variants={itemVariants}
                style={{ width: '100%', borderRadius: '16px', height: '3.6rem', border: '1px solid var(--border-subtle)', display: 'flex', gap: '0.5rem', alignItems: 'center', justifyContent: 'center' }}
            >
                <User size={20} color="var(--accent-secondary)" />
                <span style={{ fontWeight: 700 }}>{t.continue_guest}</span>
            </motion.button>

            <motion.div className="auth-links" variants={itemVariants} style={{ marginTop: '2.5rem' }}>
                {t.no_account} <Link to="/auth/register" style={{ color: 'var(--accent-primary)', fontWeight: 700, textDecoration: 'none' }}>{t.create_account}</Link>
            </motion.div>
        </motion.div>
    );
};

export default Login;
