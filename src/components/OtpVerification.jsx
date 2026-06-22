import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Loader2, RotateCcw, ArrowRight } from 'lucide-react';
import { useSettingsStore } from '../application/store/useSettingsStore';
import { translations } from '../application/utils/translations';
import '../styles/OtpVerification.css';

const OtpVerification = ({ email, type, onVerify, onResend, isLoading, error }) => {
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [timer, setTimer] = useState(120); // 2 minutes
    const [canResend, setCanResend] = useState(false);
    const inputRefs = useRef([]);

    const { lang } = useSettingsStore();
    const t = translations[lang];

    useEffect(() => {
        let interval;
        if (timer > 0) {
            interval = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);
        } else {
            setCanResend(true);
        }
        return () => clearInterval(interval);
    }, [timer]);

    useEffect(() => {
        // Auto focus first input on mount
        if (inputRefs.current[0]) {
            inputRefs.current[0].focus();
        }
    }, []);

    const handleChange = (index, value) => {
        if (!/^\d*$/.test(value)) return; // Only numbers

        const newOtp = [...otp];
        newOtp[index] = value.slice(-1); // Take only last character
        setOtp(newOtp);

        // Move to next input if value is entered
        if (value && index < 5) {
            inputRefs.current[index + 1].focus();
        }
    };

    const handleKeyDown = (index, e) => {
        // Handle backspace
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1].focus();
        }
    };

    const handlePaste = (e) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text').slice(0, 6).split('');
        const newOtp = [...otp];
        
        pastedData.forEach((char, index) => {
            if (/^\d$/.test(char) && index < 6) {
                newOtp[index] = char;
            }
        });
        
        setOtp(newOtp);
        
        // Focus the next empty or last input
        const nextIndex = Math.min(pastedData.length, 5);
        inputRefs.current[nextIndex].focus();
    };

    const handleSubmit = (e) => {
        e?.preventDefault();
        const otpCode = otp.join('');
        if (otpCode.length === 6) {
            onVerify(otpCode);
        }
    };

    const handleResend = () => {
        if (canResend) {
            setTimer(120);
            setCanResend(false);
            setOtp(['', '', '', '', '', '']);
            onResend();
            inputRefs.current[0].focus();
        }
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const isComplete = otp.every(digit => digit !== '');

    return (
        <div className="otp-overlay">
            <motion.div 
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="otp-container"
            >
                <div className="otp-icon-wrapper">
                    <ShieldCheck size={32} />
                </div>
                
                <h2 className="otp-title">{t.otp_title}</h2>
                <p className="otp-subtitle">
                    {t.otp_desc} <br />
                    <strong>{email}</strong>
                </p>

                <form onSubmit={handleSubmit}>
                    <div className="otp-inputs">
                        {otp.map((digit, index) => (
                            <input
                                key={index}
                                ref={(el) => (inputRefs.current[index] = el)}
                                type="text"
                                maxLength="1"
                                value={digit}
                                onChange={(e) => handleChange(index, e.target.value)}
                                onKeyDown={(e) => handleKeyDown(index, e)}
                                onPaste={handlePaste}
                                className={`otp-input ${digit ? 'filled' : ''}`}
                                disabled={isLoading}
                            />
                        ))}
                    </div>

                    {error && (
                        <motion.p 
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            style={{ color: 'var(--status-error)', fontSize: '14px', marginBottom: '16px' }}
                        >
                            {error}
                        </motion.p>
                    )}

                    <button 
                        type="submit" 
                        className="otp-verify-btn"
                        disabled={!isComplete || isLoading}
                        style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', justifyContent: 'center' }}
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="animate-spin" size={20} />
                                <span>{t.verifying}</span>
                            </>
                        ) : (
                            <>
                                <span>{t.otp_btn}</span>
                                <ArrowRight size={20} style={{ transform: lang === 'ar' ? 'rotate(180deg)' : 'none' }} />
                            </>
                        )}
                    </button>
                </form>

                <div className="otp-resend-wrapper">
                    {canResend ? (
                        <p>
                            {t.otp_resend}{' '}
                            <button 
                                onClick={handleResend} 
                                className="otp-resend-btn"
                                disabled={isLoading}
                                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.2rem' }}
                            >
                                <RotateCcw size={14} />
                                {t.otp_resend_btn}
                            </button>
                        </p>
                    ) : (
                        <p>
                            {t.otp_resend_timer} <span className="otp-timer">{formatTime(timer)}</span>
                        </p>
                    )}
                </div>
            </motion.div>
        </div>
    );
};

export default OtpVerification;
