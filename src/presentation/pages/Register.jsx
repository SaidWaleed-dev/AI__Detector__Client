import { useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../../application/store/useAuthStore';
import { useSettingsStore } from '../../application/store/useSettingsStore';
import { translations } from '../../application/utils/translations';
import { UserPlus, Loader2, ChevronLeft, Home, Sparkles, ShieldCheck, ShieldX } from 'lucide-react';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';
import OtpVerification from '../../components/OtpVerification';

const Register = () => {
    const navigate = useNavigate();
    const { register, verifyOtp, googleLogin, isLoading } = useAuthStore();
    const { lang } = useSettingsStore();
    
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    
    const [showOtp, setShowOtp] = useState(false);
    const [otpError, setOtpError] = useState(null);

    const t = translations[lang];

    const passwordStrength = useMemo(() => {
        const pass = formData.password;
        return {
            length: pass.length >= 6,
            number: /[0-9]/.test(pass),
            special: /[!@#$%^&*]/.test(pass)
        };
    }, [formData.password]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const validate = () => {
        if (formData.password !== formData.confirmPassword) {
            toast.error(lang === 'ar' ? 'كلمات المرور غير متطابقة' : 'Passwords do not match');
            return false;
        }
        if (!passwordStrength.length || !passwordStrength.number) {
            toast.error(lang === 'ar' ? 'الرجاء اختيار كلمة مرور أقوى' : 'Please choose a stronger password');
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;
        
        try {
            await register(formData.username, formData.email, formData.password);
            toast.success(lang === 'ar' ? 'تم إرسال رمز التحقق إلى بريدك الإلكتروني!' : 'Verification code sent to your email!');
            setShowOtp(true);
        } catch (error) {
            toast.error(error.response?.data?.message || (lang === 'ar' ? 'فشل التسجيل' : 'Failed to register'));
        }
    };

    const handleVerifyOtp = async (otpCode) => {
        setOtpError(null);
        try {
            await verifyOtp(formData.email, otpCode, 'registration');
            toast.success(lang === 'ar' ? 'تم التحقق وإنشاء الحساب بنجاح!' : 'Account verified and created successfully!');
            navigate('/dashboard');
        } catch (err) {
            setOtpError(err.response?.data?.message || (lang === 'ar' ? 'الرمز غير صحيح' : 'Invalid code'));
        }
    };

    const handleResendOtp = async () => {
        try {
            await register(formData.username, formData.email, formData.password);
            toast.info(lang === 'ar' ? 'تم إرسال رمز تحقق جديد!' : 'New verification code sent!');
        } catch (err) {
            toast.error(err.response?.data?.message || (lang === 'ar' ? 'فشل إعادة إرسال الرمز' : 'Failed to resend code'));
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
        <>
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
                        <UserPlus size={40} color="var(--accent-secondary)" />
                    </div>
                    <h2 style={{ fontSize: '2.2rem', fontFamily: 'var(--font-heading)', fontWeight: 800 }}>{t.register_title}</h2>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>{t.register_subtitle}</p>
                </motion.div>

                <motion.form className="auth-form" onSubmit={handleSubmit} variants={itemVariants} style={{ gap: '1.25rem' }}>
                    <div className="form-group">
                        <label>{t.fullname}</label>
                        <input 
                            type="text" 
                            name="username"
                            required 
                            placeholder={lang === 'ar' ? 'أدخل اسمك الكامل' : 'Enter your full name'}
                            value={formData.username}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-group">
                        <label>{t.email}</label>
                        <input 
                            type="email" 
                            required 
                            name="email"
                            placeholder="you@example.com"
                            value={formData.email}
                            onChange={handleChange}
                        />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div className="form-group">
                            <label>{t.password}</label>
                            <input 
                                type="password" 
                                name="password"
                                required 
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="form-group">
                            <label>{t.confirm}</label>
                            <input 
                                type="password" 
                                name="confirmPassword"
                                required 
                                placeholder="••••••••"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div style={{ 
                        display: 'flex', gap: '1rem', fontSize: '0.75rem', 
                        padding: '0.75rem', borderRadius: '12px', background: 'rgba(255,255,255,0.02)',
                        border: '1px solid var(--border-subtle)',
                        justifyContent: 'center',
                        flexWrap: 'wrap'
                    }}>
                        <div style={{ color: passwordStrength.length ? 'var(--status-success)' : 'var(--text-tertiary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            {passwordStrength.length ? <ShieldCheck size={14} /> : <ShieldX size={14} />} {t.strength_len}
                        </div>
                        <div style={{ color: passwordStrength.number ? 'var(--status-success)' : 'var(--text-tertiary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            {passwordStrength.number ? <ShieldCheck size={14} /> : <ShieldX size={14} />} {t.strength_num}
                        </div>
                        <div style={{ color: passwordStrength.special ? 'var(--status-success)' : 'var(--text-tertiary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            {passwordStrength.special ? <ShieldCheck size={14} /> : <ShieldX size={14} />} {t.strength_spec}
                        </div>
                    </div>

                    <motion.button 
                        whileHover={{ scale: isLoading ? 1 : 1.01, filter: 'brightness(1.1)' }}
                        whileTap={{ scale: isLoading ? 1 : 0.98 }}
                        type="submit" 
                        className="primary-btn auth-submit-btn" 
                        disabled={isLoading}
                        style={{ width: '100%', borderRadius: '16px', height: '3.6rem', fontSize: '1.1rem', marginTop: '0.5rem', display: 'flex', gap: '0.5rem', alignItems: 'center', justifyContent: 'center' }}
                    >
                        {isLoading ? <Loader2 className="animate-spin" size={22} /> : (
                            <>
                                <span>{t.register_btn}</span>
                                <Sparkles size={20} />
                            </>
                        )}
                    </motion.button>
                </motion.form>

                <motion.div className="auth-links" variants={itemVariants} style={{ marginTop: '2.5rem' }}>
                    {t.has_account} <Link to="/auth/login" style={{ color: 'var(--accent-primary)', fontWeight: 700, textDecoration: 'none' }}>{t.login}</Link>
                </motion.div>
            </motion.div>

            <AnimatePresence>
                {showOtp && (
                    <OtpVerification 
                        email={formData.email}
                        type="registration"
                        onVerify={handleVerifyOtp}
                        onResend={handleResendOtp}
                        isLoading={isLoading}
                        error={otpError}
                    />
                )}
            </AnimatePresence>
        </>
    );
};

export default Register;
