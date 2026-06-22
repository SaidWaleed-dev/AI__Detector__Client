import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Lock, ArrowRight, Loader2, KeyRound } from 'lucide-react';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { authService } from '../../infrastructure/services/authService';
import { useSettingsStore } from '../../application/store/useSettingsStore';
import { translations } from '../../application/utils/translations';

const ResetPassword = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');
    const email = searchParams.get('email');

    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const { lang } = useSettingsStore();
    const t = translations[lang];

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            return toast.error(lang === 'ar' ? 'كلمات المرور غير متطابقة' : 'Passwords do not match');
        }
        if (newPassword.length < 6) {
            return toast.error(lang === 'ar' ? 'يجب أن تتكون كلمة المرور من 6 أحرف على الأقل' : 'Password must be at least 6 characters');
        }

        setIsLoading(true);
        try {
            await authService.resetPassword(email, token, newPassword);
            toast.success(lang === 'ar' ? 'تم إعادة تعيين كلمة المرور بنجاح!' : 'Password reset successfully!');
            navigate('/auth/login');
        } catch (err) {
            toast.error(err.response?.data?.message || (lang === 'ar' ? 'فشل إعادة تعيين كلمة المرور' : 'Failed to reset password'));
        } finally {
            setIsLoading(false);
        }
    };

    if (!token || !email) {
        return (
            <div className="auth-card" style={{ textAlign: 'center' }}>
                <h2 style={{ color: 'var(--status-error)' }}>
                    {lang === 'ar' ? 'رابط إعادة تعيين غير صالح' : 'Invalid Reset Link'}
                </h2>
                <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
                    {lang === 'ar' ? 'الرجاء طلب رابط إعادة تعيين جديد من صفحة تسجيل الدخول.' : 'Please request a new reset link from the login page.'}
                </p>
                <button onClick={() => navigate('/auth/forgot-password')} className="primary-btn" style={{ marginTop: '2rem', width: '100%' }}>
                    {lang === 'ar' ? 'الانتقال إلى صفحة الاستعادة' : 'Go to Recovery'}
                </button>
            </div>
        );
    }

    return (
        <motion.div 
            className="auth-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
        >
            <div className="auth-header">
                <div style={{
                    background: 'rgba(168, 85, 247, 0.1)',
                    width: '72px', height: '72px',
                    borderRadius: '20px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    margin: '0 auto 1.5rem',
                    border: '1px solid rgba(168, 85, 247, 0.2)',
                }}>
                    <KeyRound size={40} color="#a855f7" />
                </div>
                <h2>{lang === 'ar' ? 'تعيين كلمة مرور جديدة' : 'Set New Password'}</h2>
                <p style={{ color: 'var(--text-secondary)' }}>
                    {lang === 'ar' ? 'أدخل كلمة مرور قوية لهويتك' : 'Enter a strong password for your identity'}
                </p>
            </div>

            <form className="auth-form" onSubmit={handleSubmit} style={{ gap: '1.5rem' }}>
                <div className="form-group">
                    <label>{lang === 'ar' ? 'كلمة المرور الجديدة' : 'New Password'}</label>
                    <input 
                        type="password" 
                        required 
                        placeholder="••••••••"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label>{lang === 'ar' ? 'تأكيد كلمة المرور' : 'Confirm Password'}</label>
                    <input 
                        type="password" 
                        required 
                        placeholder="••••••••"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                </div>

                <motion.button 
                    whileHover={{ scale: isLoading ? 1 : 1.01 }}
                    whileTap={{ scale: isLoading ? 1 : 0.98 }}
                    type="submit" 
                    className="primary-btn auth-submit-btn" 
                    disabled={isLoading}
                    style={{ width: '100%', height: '3.6rem' }}
                >
                    {isLoading ? <Loader2 className="animate-spin" size={22} /> : (
                        <>
                            <span>{lang === 'ar' ? 'إعادة تعيين كلمة المرور' : 'Reset Password'}</span>
                            <ArrowRight size={20} style={{ transform: lang === 'ar' ? 'rotate(180deg)' : 'none' }} />
                        </>
                    )}
                </motion.button>
            </form>
        </motion.div>
    );
};

export default ResetPassword;
