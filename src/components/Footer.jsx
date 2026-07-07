import React from 'react';
import { Link } from 'react-router-dom';
import { Twitter, Github, Linkedin, Mail } from 'lucide-react';
import { useSettingsStore } from '../application/store/useSettingsStore';
import { translations } from '../application/utils/translations';
import '../styles/Footer.css';

const Footer = () => {
    const { lang } = useSettingsStore();
    const t = translations[lang];

    return (
        <footer className="footer fade-in">
            <div className="footer-container">
                <div className="footer-brand">
                    <Link to="/" className="footer-logo">
                        <img src="/logo.jpg" alt="Logo" style={{ width: '34px', height: '34px', borderRadius: '8px', objectFit: 'cover', filter: 'drop-shadow(0 0 8px var(--accent-glow))' }} />
                        <span className="logo-text">Sentinel <span className="logo-highlight">AI</span></span>
                    </Link>
                    <p className="footer-tagline">
                        {t.footer_tagline}
                    </p>
                    <div className="social-links">
                        <a href="https://twitter.com" className="social-link" target="_blank" rel="noreferrer"><Twitter size={20} /></a>
                        <a href="https://github.com/SaidWaleed-dev" className="social-link" target="_blank" rel="noreferrer"><Github size={20} /></a>
                        <a href="https://linkedin.com" className="social-link" target="_blank" rel="noreferrer"><Linkedin size={20} /></a>
                        <a href="mailto:info@sentinelai.com" className="social-link"><Mail size={20} /></a>
                    </div>
                </div>

                <div className="footer-column">
                    <h4 className="footer-title">{lang === 'ar' ? 'المنصة' : 'Platform'}</h4>
                    <div className="footer-links">
                        <Link to="/" className="footer-link">{t.tray_text}</Link>
                        <Link to="/" className="footer-link">{t.tray_image}</Link>
                        <Link to="/" className="footer-link">{t.tray_audio}</Link>
                        <Link to="/" className="footer-link">{t.tray_video}</Link>
                    </div>
                </div>

                <div className="footer-column">
                    <h4 className="footer-title">{lang === 'ar' ? 'الشركة' : 'Company'}</h4>
                    <div className="footer-links">
                        <Link to="/" className="footer-link">{lang === 'ar' ? 'من نحن' : 'About Us'}</Link>
                        <Link to="/" className="footer-link">{lang === 'ar' ? 'العلوم والأبحاث' : 'Science & Research'}</Link>
                        <Link to="/" className="footer-link">{lang === 'ar' ? 'توثيق واجهة البرمجيات' : 'API Documentation'}</Link>
                        <Link to="/" className="footer-link">{lang === 'ar' ? 'المؤسسات' : 'Enterprise'}</Link>
                    </div>
                </div>

                <div className="footer-column">
                    <h4 className="footer-title">{lang === 'ar' ? 'قانوني' : 'Legal'}</h4>
                    <div className="footer-links">
                        <Link to="/" className="footer-link">{lang === 'ar' ? 'سياسة الخصوصية' : 'Privacy Policy'}</Link>
                        <Link to="/" className="footer-link">{lang === 'ar' ? 'شروط الخدمة' : 'Terms of Service'}</Link>
                        <Link to="/" className="footer-link">{lang === 'ar' ? 'سياسة ملفات الارتباط' : 'Cookie Policy'}</Link>
                        <Link to="/" className="footer-link">{lang === 'ar' ? 'الامتثال القانوني' : 'Compliance'}</Link>
                    </div>
                </div>
            </div>

            <div className="footer-bottom">
                <div className="footer-copyright">
                    &copy; {new Date().getFullYear()} {t.footer_copyright}
                </div>
                <div style={{ display: 'flex', gap: '2rem', fontSize: '0.85rem', color: 'var(--text-tertiary)' }}>
                    <span>v2.4.0-Stable</span>
                    <span>{lang === 'ar' ? 'حالة النظام: يعمل بشكل طبيعي' : 'System Status: Operational'}</span>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
