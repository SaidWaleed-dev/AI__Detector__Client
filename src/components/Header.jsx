import { LogIn, LayoutDashboard, ChevronRight, Sun, Moon, Globe } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../application/store/useAuthStore';
import { useSettingsStore } from '../application/store/useSettingsStore';
import { translations } from '../application/utils/translations';
import { motion } from 'framer-motion';
import '../styles/Header.css';

const Header = ({ activeSection }) => {
    const { isAuthenticated } = useAuthStore();
    const { theme, toggleTheme, lang, setLang } = useSettingsStore();
    const location = useLocation();
    const navigate = useNavigate();

    const t = translations[lang];

    const isPathActive = (path) => location.pathname === path;

    const isLinkActive = (sectionId, path = '/') => {
        if (location.pathname !== path) return false;
        if (!activeSection) return path === '/' && isPathActive('/');
        return activeSection === sectionId;
    };

    const handleScrollToSection = (id) => {
        if (location.pathname !== '/') {
            navigate('/');
            setTimeout(() => {
                const el = document.getElementById(id);
                if (el) el.scrollIntoView({ behavior: 'smooth' });
            }, 300);
        } else {
            const el = document.getElementById(id);
            if (el) el.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <motion.header 
            className="header"
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
        >
            <div className="header-container">
                <Link to="/" className="logo">
                    <img src="/logo.jpg" alt="Logo" style={{ width: '34px', height: '34px', borderRadius: '8px', objectFit: 'cover', filter: 'drop-shadow(0 0 8px var(--accent-glow))' }} />
                    <span className="logo-text">Sentinel <span className="logo-highlight">AI</span></span>
                </Link>

                <nav className="nav">
                    <button 
                        onClick={() => handleScrollToSection('home')} 
                        className={`nav-link ${isLinkActive('home', '/') ? 'active' : ''}`}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', font: 'inherit', display: 'flex', alignItems: 'center' }}
                    >
                        {t.home}
                    </button>
                    <button 
                        onClick={() => handleScrollToSection('features')} 
                        className={`nav-link ${isLinkActive('features', '/') ? 'active' : ''}`}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', font: 'inherit', display: 'flex', alignItems: 'center' }}
                    >
                        {t.features}
                    </button>

                    <button 
                        onClick={() => handleScrollToSection('about')} 
                        className={`nav-link ${isLinkActive('about', '/') ? 'active' : ''}`}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', font: 'inherit', display: 'flex', alignItems: 'center' }}
                    >
                        {t.about}
                    </button>

                    {/* Language Switcher */}
                    <button 
                        onClick={() => setLang(lang === 'en' ? 'ar' : 'en')}
                        className="nav-link" 
                        style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem', font: 'inherit' }}
                        title="Toggle Language"
                    >
                        <Globe size={16} />
                        <span>{t.language}</span>
                    </button>

                    {/* Theme Toggle */}
                    <button 
                        onClick={toggleTheme}
                        className="nav-link" 
                        style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 0.5rem' }}
                        title="Toggle Theme"
                    >
                        {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
                    </button>
                    
                    {isAuthenticated ? (
                        <Link to="/dashboard" className="primary-btn auth-nav-btn">
                            <LayoutDashboard size={18} /> 
                            <span>{t.dashboard}</span>
                            <ChevronRight size={16} style={{ transform: lang === 'ar' ? 'rotate(180deg)' : 'none' }} />
                        </Link>
                    ) : (
                        <Link to="/auth/login" className="primary-btn auth-nav-btn">
                            <LogIn size={18} /> 
                            <span>{t.login}</span>
                            <ChevronRight size={16} style={{ transform: lang === 'ar' ? 'rotate(180deg)' : 'none' }} />
                        </Link>
                    )}
                </nav>
            </div>
        </motion.header>
    );
};

export default Header;
