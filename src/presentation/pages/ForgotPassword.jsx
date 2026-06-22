import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, ArrowRight, Loader2, ChevronLeft, KeyRound, ShieldCheck, Lock, Sparkles, UserCheck } from 'lucide-react';
import { useSettingsStore } from '../../application/store/useSettingsStore';
import { translations } from '../../application/utils/translations';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';
import { authService } from '../../infrastructure/services/authService';
import OtpVerification from '../../components/OtpVerification';

const ForgotPassword = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1); // 1: Email, 3: New Password
    const [email, setEmail] = useState('');
    const [code, setCode] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showOtp, setShowOtp] = useState(false);
    const [otpError, setOtpError] = useState(null);

    const { lang } = useSettingsStore();
    const t = translations[lang];

    const handleSendCode = async (e) => {
        if (e) e.preventDefault();
        setIsLoading(true);
        try {
            await authService.forgotPassword(email);
            toast.info(lang === 'ar' ? 'تم إرسال رمز أمان مكون من 6 أرقام إلى بريدك الإلكتروني' : '6-digit security code sent to your email');
            setShowOtp(true);
        } catch (err) {
            toast.error(err.response?.data?.message || (lang === 'ar' ? 'فشل إرسال الرمز' : 'Failed to send code'));
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerifyOtp = async (otpCode) => {
        setIsLoading(true);
        setOtpError(null);
        try {
            await authService.verifyOtp(email, otpCode, 'reset-password');
            setCode(otpCode); // Save code for the final reset call
            toast.success(lang === 'ar' ? 'تم التحقق من الرمز بنجاح' : 'Code verified successfully');
            setShowOtp(false);
            setStep(3);
        } catch (err) {
            setOtpError(err.response?.data?.message || (lang === 'ar' ? 'رمز الأمان غير صحيح' : 'Invalid security code'));
        } finally {
            setIsLoading(false);
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            return toast.error(lang === 'ar' ? 'كلمات المرور غير متطابقة' : 'Passwords do not match');
        }
        if (newPassword.length < 6) {
            return toast.error(lang === 'ar' ? 'يجب أن تتكون كلمة المرور من 6 أحرف على الأقل' : 'Password must be at least 6 characters');
        }

        setIsLoading(true);
        try {
            await authService.resetPassword(email, code, newPassword);
            toast.success(lang === 'ar' ? 'نجاح! تم تحديث كلمة المرور.' : 'Success! Password updated.');
            navigate('/auth/login');
        } catch (err) {
            toast.error(err.response?.data?.message || (lang === 'ar' ? 'فشل إعادة تعيين كلمة المرور' : 'Failed to reset password'));
        } finally {
            setIsLoading(false);
        }
    };

    const containerVariants = {
        hidden: { opacity: 0, x: 20 },
        visible: { opacity: 1, x: 0, transition: { duration: 0.4, ease: "easeOut" } },
        exit: { opacity: 0, x: -20, transition: { duration: 0.3 } }
    };

    return (
        <>
            <motion.div 
                className="auth-card"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                style={{ position: 'relative', overflow: 'hidden' }}
            >
                <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '4px', background: 'rgba(255,255,255,0.05)' }}>
                    <motion.div 
                        initial={{ width: '0%' }}
                        animate={{ width: `${(step / 3) * 100}%` }}
                        style={{ height: '100%', background: 'var(--accent-primary)', transition: 'width 0.5s ease' }}
                    />
                </div>

                <Link to="/auth/login" className="back-home-btn" style={{ top: '2rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <ChevronLeft size={18} style={{ transform: lang === 'ar' ? 'rotate(180deg)' : 'none' }} />
                    <span>{t.back_login}</span>
                </Link>

                <AnimatePresence mode="wait">
                    {step === 1 && (
                        <motion.div key="step1" variants={containerVariants} initial="hidden" animate="visible" exit="exit" style={{ marginTop: '3rem' }}>
                            <div className="auth-header">
                                <div style={iconBoxStyle}><Mail size={32} color="var(--accent-primary)" /></div>
                                <h2 style={titleStyle}>{t.find_account}</h2>
                                <p style={descStyle}>{t.recovery_email_desc}</p>
                            </div>
                            <form className="auth-form" onSubmit={handleSendCode}>
                                <div className="form-group">
                                    <label>{t.email}</label>
                                    <input type="email" required placeholder="you@domain.com" value={email} onChange={(e) => setEmail(e.target.value)} />
                                </div>
                                <button disabled={isLoading} className="primary-btn auth-submit-btn" style={btnStyle}>
                                    {isLoading ? <Loader2 className="animate-spin" /> : <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center', justifyContent: 'center' }}><span>{t.continue_btn}</span> <ArrowRight size={20} style={{ transform: lang === 'ar' ? 'rotate(180deg)' : 'none' }} /></div>}
                                </button>
                            </form>
                        </motion.div>
                    )}

                    {step === 3 && (
                        <motion.div key="step3" variants={containerVariants} initial="hidden" animate="visible" exit="exit" style={{ marginTop: '3rem' }}>
                            <div className="auth-header">
                                <div style={iconBoxStyle}><Lock size={32} color="var(--accent-primary)" /></div>
                                <h2 style={titleStyle}>{t.create_new_pass}</h2>
                                <p style={descStyle}>{t.new_pass_desc}</p>
                            </div>
                            <form className="auth-form" onSubmit={handleResetPassword}>
                                <div className="form-group">
                                    <label>{t.new_pass_label}</label>
                                    <input type="password" required placeholder="••••••••" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                                </div>
                                <div className="form-group">
                                    <label>{t.confirm_new_pass}</label>
                                    <input type="password" required placeholder="••••••••" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                                </div>
                                <button disabled={isLoading} className="primary-btn auth-submit-btn" style={btnStyle}>
                                    {isLoading ? <Loader2 className="animate-spin" /> : <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center', justifyContent: 'center' }}><span>{t.finish_login}</span> <Sparkles size={20} /></div>}
                                </button>
                            </form>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="auth-links" style={{ marginTop: '2.5rem' }}>
                    {t.remember_pass} <Link to="/auth/login" style={{ color: 'var(--accent-primary)', fontWeight: 700, textDecoration: 'none' }}>{t.back_session}</Link>
                </div>
            </motion.div>

            <AnimatePresence>
                {showOtp && (
                    <OtpVerification 
                        email={email}
                        type="reset-password"
                        onVerify={handleVerifyOtp}
                        onResend={handleSendCode}
                        isLoading={isLoading}
                        error={otpError}
                    />
                )}
            </AnimatePresence>
        </>
    );
};

const iconBoxStyle = {
    background: 'rgba(255,255,255,0.03)',
    width: '72px', height: '72px',
    borderRadius: '20px',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    margin: '0 auto 1.5rem',
    border: '1px solid var(--border-subtle)'
};
const titleStyle = { fontSize: '2rem', fontWeight: 800, fontFamily: 'var(--font-heading)' };
const descStyle = { color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '1.5rem' };
const btnStyle = { width: '100%', height: '3.6rem', borderRadius: '16px' };

export default ForgotPassword;
