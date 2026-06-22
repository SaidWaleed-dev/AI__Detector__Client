import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Mail, CheckCircle2, Loader2, KeyRound } from 'lucide-react';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { useAuthStore } from '../../application/store/useAuthStore';
import { useSettingsStore } from '../../application/store/useSettingsStore';
import { translations } from '../../application/utils/translations';

const VerifyAccount = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const emailFromUrl = searchParams.get('email') || '';
    
    const [code, setCode] = useState('');
    const { verifyOtp, isLoading } = useAuthStore();
    const { lang } = useSettingsStore();
    const t = translations[lang];

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (code.length < 6) {
            return toast.error(lang === 'ar' ? 'الرجاء إدخال الرمز المكون من 6 أرقام' : 'Please enter the 6-digit code');
        }

        try {
            await verifyOtp(emailFromUrl, code, 'registration');
            toast.success(lang === 'ar' ? 'تم تفعيل الحساب بنجاح!' : 'Account activated successfully!');
            navigate('/dashboard');
        } catch (err) {
            toast.error(err.response?.data?.message || (lang === 'ar' ? 'فشل التفعيل' : 'Verification failed'));
        }
    };

    return (
        <motion.div 
            className="auth-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
        >
            <div className="auth-header">
                <div style={{
                    background: 'rgba(52, 211, 153, 0.1)',
                    width: '72px', height: '72px',
                    borderRadius: '20px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    margin: '0 auto 1.5rem',
                    border: '1px solid rgba(52, 211, 153, 0.2)',
                }}>
                    <Mail size={40} color="#10b981" />
                </div>
                <h2 style={{ fontSize: '1.8rem', fontWeight: 800 }}>
                    {lang === 'ar' ? 'تفعيل الحساب' : 'Verify Account'}
                </h2>
                <p style={{ color: 'var(--text-secondary)' }}>
                    {lang === 'ar' ? 'لقد أرسلنا رمزًا مكونًا من 6 أرقام إلى' : 'We sent a 6-digit code to'} <strong>{emailFromUrl}</strong>
                </p>
            </div>

            <form className="auth-form" onSubmit={handleSubmit} style={{ gap: '1.5rem' }}>
                <div className="form-group">
                    <label>{lang === 'ar' ? 'رمز الأمان' : 'Security Code'}</label>
                    <input 
                        type="text" 
                        required 
                        maxLength={6}
                        placeholder="123456"
                        style={{ textAlign: 'center', letterSpacing: '8px', fontSize: '1.5rem', fontWeight: 'bold' }}
                        value={code}
                        onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
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
                            <span>{lang === 'ar' ? 'تفعيل الحساب' : 'Activate Account'}</span>
                            <CheckCircle2 size={20} />
                        </>
                    )}
                </motion.button>
            </form>

            <div style={{ marginTop: '2rem', textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-tertiary)' }}>
                {lang === 'ar' ? 'لم تستلم الرمز؟ تحقق من مجلد الرسائل غير المرغوب فيها.' : "Didn't receive the code? Check your spam folder."}
            </div>
        </motion.div>
    );
};

export default VerifyAccount;
