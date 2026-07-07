import { useState } from 'react';
import { Play, Loader2, UploadCloud, FileText, Music, Image as ImageIcon, Video, ShieldAlert } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDetection } from '../application/hooks/useDetection';
import { useSettingsStore } from '../application/store/useSettingsStore';
import { translations } from '../application/utils/translations';
import InputArea from './InputArea';
import FileUpload from './FileUpload';
import ScoreCard from './ScoreCard';
import '../styles/DetectorInterface.css';

const FILE_TABS = ['image', 'audio', 'video'];

const DetectorInterface = () => {
    const [activeTab, setActiveTab] = useState('text');
    const [textContent, setTextContent] = useState('');
    const [fileContent, setFileContent] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const { loading, result, error, detectText, detectFile, setResult, setError } = useDetection();

    const { lang } = useSettingsStore();
    const t = translations[lang];
    const isFileTab = FILE_TABS.includes(activeTab);
    const isVideoTab = activeTab === 'video';

    const tabs = [
        { id: 'text', icon: FileText, label: t.tab_text },
        { id: 'image', icon: ImageIcon, label: t.tab_image },
        { id: 'audio', icon: Music, label: t.tab_audio },
        { id: 'video', icon: Video, label: t.tab_video },
    ];

    const handleTabChange = (tab) => {
        setActiveTab(tab);
        setResult(null);
        setError(null);
        setFileContent(null);
    };

    const handleTextChange = (e) => {
        setTextContent(e.target.value);
    };

    const handleFileChange = (file) => {
        setFileContent(file);
        setResult(null);
    };

    const handleDetection = async () => {
        if (isProcessing || loading) return;
        
        setIsProcessing(true);
        try {
            if (activeTab === 'text') {
                await detectText(textContent);
            } else {
                await detectFile(fileContent);
            }
        } finally {
            setIsProcessing(false);
        }
    };

    const isRunDisabled =
        loading ||
        isProcessing ||
        (activeTab === 'text' && !textContent) ||
        (isFileTab && !fileContent);

    const fadeVariants = {
        hidden: { opacity: 0, y: 15 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
    };

    const iconMargin = lang === 'ar' ? 'marginLeft' : 'marginRight';

    const renderTabContent = () => {
        if (activeTab === 'text') {
            return <InputArea value={textContent} onChange={handleTextChange} />;
        }

        if (activeTab === 'image') {
            return (
                <FileUpload
                    onFileSelect={handleFileChange}
                    selectedFile={fileContent}
                    accept="image/*"
                    t={t}
                />
            );
        }

        if (activeTab === 'audio') {
            return (
                <FileUpload
                    onFileSelect={handleFileChange}
                    selectedFile={fileContent}
                    accept="audio/*"
                    t={t}
                />
            );
        }

        if (activeTab === 'video') {
            return (
                <FileUpload
                    onFileSelect={handleFileChange}
                    selectedFile={fileContent}
                    accept="video/*"
                    t={t}
                />
            );
        }

        return null;
    };

    return (
        <div className="detector-split-view">
            {/* LEFT PANEL: EDITOR */}
            <motion.div 
                className="detector-main"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
            >
                <div className="detector-content-shell">
                    <header className="detector-toolbar glass-panel">
                        <div className="tab-group">
                            {tabs.map(({ id, icon: Icon, label }) => (
                                <button
                                    key={id}
                                    className={`clean-tab ${activeTab === id ? 'active' : ''}`}
                                    onClick={() => handleTabChange(id)}
                                >
                                    <Icon size={18} style={{ verticalAlign: 'middle', [iconMargin]: '6px' }} />
                                    <span className="tab-label">{label}</span>
                                </button>
                            ))}
                        </div>
                        <div className="toolbar-actions">
                            <AnimatePresence>
                                {activeTab === 'text' && textContent.length > 0 && (
                                    <motion.button 
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        className="clean-icon-btn" 
                                        onClick={() => setTextContent('')}
                                    >
                                        {t.clear_workspace}
                                    </motion.button>
                                )}
                            </AnimatePresence>
                        </div>
                    </header>

                    <div className="detector-editor-area">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeTab}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.3 }}
                                className="h-full"
                            >
                                {renderTabContent()}
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    <div className="detector-action-bar">
                        <AnimatePresence>
                            {error && (
                                <motion.span 
                                    initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}
                                    className="error-text mr-4 text-sm" 
                                    style={{ color: 'var(--status-error-text)' }}
                                >
                                    {error}
                                </motion.span>
                            )}
                        </AnimatePresence>
                        <motion.button
                            whileHover={{ scale: isRunDisabled ? 1 : 1.02 }}
                            whileTap={{ scale: isRunDisabled ? 1 : 0.98 }}
                            className="primary-btn"
                            onClick={handleDetection}
                            disabled={isRunDisabled}
                            style={{ position: 'relative', overflow: 'hidden' }}
                        >
                            {(loading || isProcessing) && (
                                <motion.div 
                                    style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)' }}
                                    animate={{ x: ['-100%', '100%'] }}
                                    transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                                />
                            )}
                            {(loading || isProcessing) ? <Loader2 className="animate-spin" size={18} /> : <Play size={18} fill="currentColor" />}
                            <span>{(loading || isProcessing) ? t.processing : t.run_detection}</span>
                        </motion.button>
                    </div>
                </div>
            </motion.div>

            {/* RIGHT PANEL: SIDEBAR */}
            <motion.div 
                className="detector-results-panel"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, ease: 'easeOut', delay: 0.1 }}
            >
                <AnimatePresence mode="wait">
                    {loading || isProcessing ? (
                        <motion.div 
                            key="analyzing" 
                            className="analyzing-state"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 1.1 }}
                            style={{ 
                                height: '100%', display: 'flex', flexDirection: 'column', 
                                alignItems: 'center', justifyContent: 'center', textAlign: 'center',
                                padding: '2rem'
                            }}
                        >
                            <div className="scanner-container" style={{ position: 'relative', width: '200px', height: '200px', marginBottom: '2rem' }}>
                                <motion.div 
                                    className="scanner-circle"
                                    animate={{ rotate: 360 }}
                                    transition={{ repeat: Infinity, duration: 3, ease: 'linear' }}
                                    style={{ 
                                        position: 'absolute', inset: 0, borderRadius: '50%',
                                        border: '2px dashed var(--accent-primary)', opacity: 0.3
                                    }}
                                />
                                <motion.div 
                                    className="scanner-pulse"
                                    animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
                                    transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
                                    style={{ 
                                        position: 'absolute', inset: '20%', borderRadius: '50%',
                                        background: 'radial-gradient(circle, var(--accent-primary) 0%, transparent 70%)',
                                    }}
                                />
                                <motion.div 
                                    className="scanner-bar"
                                    animate={{ top: ['0%', '100%', '0%'] }}
                                    transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
                                    style={{ 
                                        position: 'absolute', left: '-10%', right: '-10%', height: '2px',
                                        background: 'linear-gradient(90deg, transparent, var(--accent-primary), transparent)',
                                        boxShadow: '0 0 15px var(--accent-primary)', zIndex: 2
                                    }}
                                />
                                <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <ShieldAlert size={48} color="var(--accent-primary)" />
                                </div>
                            </div>
                            <motion.h3
                                animate={{ opacity: [0.5, 1, 0.5] }}
                                transition={{ repeat: Infinity, duration: 1.5 }}
                                style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.5rem' }}
                            >
                                {t.analyzing}
                            </motion.h3>
                            <p style={{ color: 'var(--text-tertiary)', maxWidth: '240px' }}>
                                {t.scanning_desc}
                            </p>
                        </motion.div>
                    ) : result ? (
                        <motion.div key="result" variants={fadeVariants} initial="hidden" animate="visible" exit="hidden" className="result-content">
                            <ScoreCard result={result} />
                        </motion.div>
                    ) : (
                        <motion.div key="empty" variants={fadeVariants} initial="hidden" animate="visible" exit="hidden" className="empty-results">
                            <motion.div 
                                className="empty-icon-placeholder"
                                animate={{ y: [0, -5, 0] }}
                                transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
                            >
                                <UploadCloud size={24} color="var(--text-tertiary)" style={{ margin: '12px' }} />
                            </motion.div>
                            <p className="text-secondary font-medium">{t.no_results}</p>
                            <p className="text-tertiary text-sm mt-1">{t.run_scan_desc}</p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    );
};

export default DetectorInterface;
