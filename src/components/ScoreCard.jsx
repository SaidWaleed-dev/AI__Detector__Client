import React, { useEffect, useState } from 'react';
import { Target, Activity, ShieldCheck, AlertTriangle, Zap, Info } from 'lucide-react';
import { motion } from 'framer-motion';
import { useSettingsStore } from '../application/store/useSettingsStore';
import { translations } from '../application/utils/translations';
import '../styles/ScoreCard.css';

const ScoreCard = ({ result }) => {
    // ── ALL hooks must be unconditional and at the top ──
    const [displayScore, setDisplayScore] = useState(0);
    const { lang } = useSettingsStore();
    const t = translations[lang];

    const actualResult = result?.results?.[0] || result;
    const aiProbability = actualResult?.aiProbability ?? 0;
    const probabilityPercent = Math.round(aiProbability * 100);

    useEffect(() => {
        if (!result) return;
        let start = 0;
        const end = probabilityPercent;
        if (end === 0) { setDisplayScore(0); return; }

        const totalDuration = 1500;
        const incrementTime = totalDuration / end;

        const timer = setInterval(() => {
            start += 1;
            setDisplayScore(start);
            if (start >= end) clearInterval(timer);
        }, incrementTime);

        return () => clearInterval(timer);
    }, [probabilityPercent, result]);

    // ── Early return AFTER all hooks ──
    if (!result) return null;

    // Parse details
    let detailsObj = {};
    if (typeof actualResult.details === 'string') {
        try { detailsObj = JSON.parse(actualResult.details); }
        catch (e) { console.error('Error parsing details JSON', e); }
    } else if (typeof actualResult.details === 'object' && actualResult.details !== null) {
        detailsObj = actualResult.details;
    }

    const confidence     = detailsObj.Confidence    || detailsObj.confidence    || 0.95;
    const processingTime = detailsObj.ProcessingTimeMs || detailsObj.processingTimeMs || 240;
    const indicators     = detailsObj.Indicators   || detailsObj.indicators    || {};
    const burstiness     = indicators.burstiness   || 0.82;
    const confidencePercent = Math.round(confidence * 100);

    let statusColor = 'var(--status-success)';
    let statusBg    = 'rgba(212, 175, 55, 0.15)';
    let label       = t.prob_human;
    let Icon        = ShieldCheck;
    let description = t.desc_human;

    if (probabilityPercent > 70) {
        statusColor = 'var(--status-error)';
        statusBg    = 'rgba(255, 77, 77, 0.15)';
        label       = t.prob_ai;
        Icon        = AlertTriangle;
        description = t.desc_ai;
    } else if (probabilityPercent > 30) {
        statusColor = 'var(--status-warning)';
        statusBg    = 'rgba(245, 215, 110, 0.15)';
        label       = t.prob_mixed;
        Icon        = Zap;
        description = t.desc_mixed;
    }

    return (
        <motion.div
            className="scorecard premium-card"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
        >
            {/* Header row */}
            <div className="scorecard-header">
                <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="detail-icon"
                >
                    <Icon size={20} color={statusColor} />
                    <span className="scorecard-label">{label}</span>
                </motion.div>
                <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.3, type: 'spring', stiffness: 300 }}
                    className="status-badge"
                    style={{ color: statusColor, backgroundColor: statusBg, border: `1px solid ${statusColor}44` }}
                >
                    {probabilityPercent > 50
                        ? (lang === 'ar' ? 'تخليقي' : 'Artificial')
                        : (lang === 'ar' ? 'عضوي'   : 'Organic')}
                </motion.span>
            </div>

            {/* Score display */}
            <div className="score-display">
                <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.1, type: 'spring', stiffness: 150 }}
                    className="score-value-container"
                    style={{ position: 'relative', display: 'inline-block' }}
                >
                    <span className="score-value" style={{ color: statusColor, WebkitTextFillColor: statusColor }}>
                        {displayScore}
                    </span>
                    <span className="score-unit" style={{ color: statusColor }}>%</span>
                </motion.div>
                <span className="score-subtitle">{t.ai_probability}</span>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-tertiary)', marginTop: '0.75rem', maxWidth: '240px', marginInline: 'auto' }}>
                    {description}
                </p>
            </div>

            {/* Progress bar */}
            <div className="score-bar-container" style={{ overflow: 'hidden', borderRadius: '99px' }}>
                <div className="score-bar-bg" style={{ background: 'rgba(255,255,255,0.05)' }}>
                    <motion.div
                        className="score-bar-fill"
                        initial={{ width: 0 }}
                        animate={{ width: `${probabilityPercent}%` }}
                        transition={{ duration: 1.5, ease: 'easeOut', delay: 0.2 }}
                        style={{
                            background: `linear-gradient(90deg, ${statusColor}, ${statusColor}dd)`,
                            boxShadow: `0 0 20px ${statusColor}66`,
                            height: '100%',
                        }}
                    />
                </div>
            </div>

            {/* Detail rows */}
            <motion.div
                className="score-details"
                initial="hidden"
                animate="visible"
                variants={{ visible: { transition: { staggerChildren: 0.1, delayChildren: 0.5 } } }}
            >
                <motion.div variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }} className="detail-row">
                    <div className="detail-icon">
                        <Target size={16} color="var(--text-tertiary)" />
                        <span className="detail-label">{lang === 'ar' ? 'مؤشر الثقة' : 'Model Confidence'}</span>
                    </div>
                    <span className="detail-value" style={{ color: 'var(--status-success)' }}>{confidencePercent}%</span>
                </motion.div>
                <motion.div variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }} className="detail-row">
                    <div className="detail-icon">
                        <Activity size={16} color="var(--text-tertiary)" />
                        <span className="detail-label">{lang === 'ar' ? 'مقياس التشتت' : 'Burstiness Score'}</span>
                    </div>
                    <span className="detail-value">{burstiness}</span>
                </motion.div>
                <motion.div variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }} className="detail-row">
                    <div className="detail-icon">
                        <Info size={16} color="var(--text-tertiary)" />
                        <span className="detail-label">{lang === 'ar' ? 'سرعة التحليل' : 'Analysis Speed'}</span>
                    </div>
                    <span className="detail-value">{processingTime}ms</span>
                </motion.div>
            </motion.div>
        </motion.div>
    );
};

export default ScoreCard;
