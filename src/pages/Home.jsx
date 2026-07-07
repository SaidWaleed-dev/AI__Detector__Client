import React, { useState, useEffect } from 'react';
import { ShieldCheck, ArrowRight, Zap, Target, Lock, UserPlus, Mic, Image as ImageIcon, Binary, ShieldAlert, Cpu } from 'lucide-react';
import { Link, useOutletContext } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useSettingsStore } from '../application/store/useSettingsStore';
import { translations } from '../application/utils/translations';
import '../styles/Home.css';

// Typing Text Effect Component
const TypingText = () => {
    const { lang } = useSettingsStore();
    const t = translations[lang];
    const texts = [
        t.typing_1,
        t.typing_2,
        t.typing_3,
        t.typing_4
    ];
    const [index, setIndex] = useState(0);
    const [displayedText, setDisplayedText] = useState("");
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        let timer;
        const currentText = texts[index];

        if (isDeleting) {
            timer = setTimeout(() => {
                setDisplayedText(currentText.substring(0, displayedText.length - 1));
            }, 35);
        } else {
            timer = setTimeout(() => {
                setDisplayedText(currentText.substring(0, displayedText.length + 1));
            }, 75);
        }

        if (!isDeleting && displayedText === currentText) {
            timer = setTimeout(() => setIsDeleting(true), 2000);
        } else if (isDeleting && displayedText === "") {
            setIsDeleting(false);
            setIndex((prev) => (prev + 1) % texts.length);
        }

        return () => clearTimeout(timer);
    }, [displayedText, isDeleting, index]);

    return (
        <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent-primary)', letterSpacing: '0.12em', fontSize: '1.1rem', fontWeight: 'bold' }}>
            {displayedText}
            <motion.span
                animate={{ opacity: [1, 0, 1] }}
                transition={{ repeat: Infinity, duration: 0.8 }}
                style={{ marginLeft: '2px' }}
            >
                _
            </motion.span>
        </span>
    );
};

// Animated Float Particles Component
const BackgroundParticles = () => {
    const particles = Array.from({ length: 25 }).map((_, i) => ({
        id: i,
        size: Math.random() * 4 + 2,
        x: Math.random() * 100,
        y: Math.random() * 100,
        duration: Math.random() * 8 + 8,
        delay: Math.random() * 5
    }));

    return (
        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 1 }}>
            {particles.map(p => (
                <motion.div
                    key={p.id}
                    style={{
                        position: 'absolute',
                        left: `${p.x}%`,
                        top: `${p.y}%`,
                        width: p.size,
                        height: p.size,
                        borderRadius: '50%',
                        backgroundColor: 'var(--accent-primary)',
                        opacity: 0.12,
                        filter: 'blur(1px)'
                    }}
                    animate={{
                        y: ['0px', '-100px', '0px'],
                        x: ['0px', '30px', '0px'],
                        opacity: [0.08, 0.35, 0.08]
                    }}
                    transition={{
                        duration: p.duration,
                        repeat: Infinity,
                        delay: p.delay,
                        ease: 'easeInOut'
                    }}
                />
            ))}
        </div>
    );
};

// Neural Network / AI Brain Canvas Component
const NeuralNetwork = () => {
    const nodes = [
        { id: 1, cx: 60, cy: 120, size: 7 },
        { id: 2, cx: 130, cy: 60, size: 6 },
        { id: 3, cx: 130, cy: 180, size: 6 },
        { id: 4, cx: 200, cy: 120, size: 5 },
        { id: 5, cx: 270, cy: 60, size: 6 },
        { id: 6, cx: 270, cy: 180, size: 6 },
        { id: 7, cx: 340, cy: 120, size: 9 },
    ];

    const connections = [
        { from: 1, to: 2 },
        { from: 1, to: 3 },
        { from: 2, to: 4 },
        { from: 3, to: 4 },
        { from: 4, to: 5 },
        { from: 4, to: 6 },
        { from: 5, to: 7 },
        { from: 6, to: 7 },
        { from: 2, to: 5 },
        { from: 3, to: 6 },
    ];

    return (
        <div style={{ position: 'relative', width: '100%', height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="100%" height="100%" viewBox="0 0 400 240" style={{ overflow: 'visible' }}>
                <defs>
                    <filter id="glow-gold" x="-30%" y="-30%" width="160%" height="160%">
                        <feGaussianBlur stdDeviation="4" result="blur" />
                        <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                </defs>

                {/* Connections */}
                {connections.map((c, i) => {
                    const fromNode = nodes.find(n => n.id === c.from);
                    const toNode = nodes.find(n => n.id === c.to);
                    return (
                        <g key={i}>
                            <line
                                x1={fromNode.cx}
                                y1={fromNode.cy}
                                x2={toNode.cx}
                                y2={toNode.cy}
                                stroke="rgba(212, 175, 55, 0.2)"
                                strokeWidth="1.5"
                            />
                            {/* Data Pulse packet */}
                            <motion.circle
                                cx={fromNode.cx}
                                cy={fromNode.cy}
                                r="3.5"
                                fill="var(--accent-secondary)"
                                filter="url(#glow-gold)"
                                animate={{
                                    cx: [fromNode.cx, toNode.cx],
                                    cy: [fromNode.cy, toNode.cy]
                                }}
                                transition={{
                                    duration: 2 + (i % 3) * 0.8,
                                    repeat: Infinity,
                                    ease: "linear"
                                }}
                            />
                        </g>
                    );
                })}

                {/* Nodes */}
                {nodes.map(n => (
                    <g key={n.id}>
                        <motion.circle
                            cx={n.cx}
                            cy={n.cy}
                            r={n.size + 4}
                            fill="rgba(212, 175, 55, 0.08)"
                            stroke="rgba(212, 175, 55, 0.15)"
                            strokeWidth="1.5"
                            animate={{
                                r: [n.size + 2, n.size + 6, n.size + 2]
                            }}
                            transition={{
                                duration: 3 + (n.id % 2),
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                        />
                        <motion.circle
                            cx={n.cx}
                            cy={n.cy}
                            r={n.size}
                            fill="var(--accent-primary)"
                            filter="url(#glow-gold)"
                            whileHover={{ scale: 1.4 }}
                        />
                    </g>
                ))}
            </svg>
        </div>
    );
};

// Interactive Stats Card with Animated Counter
const StatCard = ({ label, targetValue, suffix = "", prefix = "" }) => {
    const [value, setValue] = useState(0);

    useEffect(() => {
        let start = 0;
        const cleanValueStr = String(targetValue).replace(/,/g, '');
        const end = parseFloat(cleanValueStr);

        if (isNaN(end)) {
            setValue(targetValue);
            return;
        }

        const isDecimal = cleanValueStr.includes('.');
        const totalDuration = 1800; // ms
        const steps = 60;
        const stepTime = totalDuration / steps;
        let currentStep = 0;

        const timer = setInterval(() => {
            currentStep++;
            const progress = currentStep / steps;
            // Ease out quad
            const easeProgress = progress * (2 - progress);
            const currentVal = easeProgress * end;

            if (currentStep >= steps) {
                setValue(targetValue);
                clearInterval(timer);
            } else {
                if (isDecimal) {
                    setValue(currentVal.toFixed(1));
                } else {
                    setValue(Math.floor(currentVal).toLocaleString());
                }
            }
        }, stepTime);

        return () => clearInterval(timer);
    }, [targetValue]);

    return (
        <motion.div
            whileHover={{ y: -6, scale: 1.02 }}
            className="premium-card"
            style={{
                padding: '2.5rem 2rem',
                textAlign: 'center',
                background: 'rgba(18, 18, 18, 0.7)',
                backdropFilter: 'blur(20px)',
                border: '1px solid var(--border-subtle)',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem',
                justifyContent: 'center',
                height: '100%'
            }}
        >
            <div className="gold-glow-overlay" />
            <span style={{ fontSize: '0.8rem', color: 'var(--accent-primary)', fontWeight: '800', letterSpacing: '0.15em', fontFamily: 'var(--font-heading)', textTransform: 'uppercase' }}>
                {label}
            </span>
            <h3 style={{ fontSize: '2.5rem', fontWeight: '800', margin: '0.25rem 0', fontFamily: 'var(--font-mono)', color: 'var(--text-primary)' }}>
                {prefix}{value}{suffix}
            </h3>
        </motion.div>
    );
};

// Interactive Telemetry SVG Chart Component
const TelemetryChart = () => {
    const { lang } = useSettingsStore();
    const t = translations[lang];

    const points = [
        { x: 30, y: 140 },
        { x: 80, y: 105 },
        { x: 130, y: 125 },
        { x: 180, y: 55 },
        { x: 230, y: 85 },
        { x: 280, y: 40 },
        { x: 330, y: 110 },
        { x: 380, y: 35 }
    ];

    const pathData = `M ${points.map(p => `${p.x} ${p.y}`).join(' L ')}`;
    const areaData = `${pathData} L 380 180 L 30 180 Z`;

    return (
        <div className="premium-card" style={{ padding: '2.2rem', background: 'rgba(18, 18, 18, 0.8)', border: '1px solid var(--border-subtle)', flex: 1, minWidth: '320px' }}>
            <div className="gold-glow-overlay" />
            <h4 style={{ fontSize: '1rem', fontFamily: 'var(--font-heading)', color: 'var(--text-primary)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.6rem', letterSpacing: '0.04em' }}>
                <span className="animate-pulse-glow" style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--accent-primary)' }} />
                {t.chart_title}
            </h4>
            <div style={{ position: 'relative', width: '100%', height: '200px' }}>
                <svg width="100%" height="100%" viewBox="0 0 400 200" preserveAspectRatio="none" style={{ overflow: 'visible' }}>
                    <defs>
                        <linearGradient id="chartGlow" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="var(--accent-primary)" stopOpacity="0.25" />
                            <stop offset="100%" stopColor="var(--accent-primary)" stopOpacity="0" />
                        </linearGradient>
                    </defs>
                    {/* Grid lines */}
                    <line x1="30" y1="30" x2="380" y2="30" stroke="rgba(212, 175, 55, 0.05)" />
                    <line x1="30" y1="80" x2="380" y2="80" stroke="rgba(212, 175, 55, 0.05)" />
                    <line x1="30" y1="130" x2="380" y2="130" stroke="rgba(212, 175, 55, 0.05)" />
                    <line x1="30" y1="180" x2="380" y2="180" stroke="rgba(212, 175, 55, 0.15)" />

                    {/* Area background */}
                    <motion.path
                        d={areaData}
                        fill="url(#chartGlow)"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1 }}
                    />

                    {/* Path line */}
                    <motion.path
                        d={pathData}
                        fill="none"
                        stroke="var(--accent-primary)"
                        strokeWidth="2.5"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 1.5, ease: 'easeOut' }}
                    />

                    {/* Pulsing glow circles */}
                    {points.map((p, i) => (
                        <g key={i}>
                            <motion.circle
                                cx={p.x}
                                cy={p.y}
                                r="5.5"
                                fill="#0A0A0A"
                                stroke="var(--accent-secondary)"
                                strokeWidth="2"
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.4 + i * 0.08 }}
                                whileHover={{ scale: 1.4 }}
                            />
                        </g>
                    ))}
                </svg>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem', fontSize: '0.75rem', color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)' }}>
                <span>LAYER IN-L1</span>
                <span>DEEPFORENSICS</span>
                <span>STYLOMETRY</span>
                <span>RESULT OUT</span>
            </div>
        </div>
    );
};

// Features Card Component with Gold Reflections
const FeatureCard = ({ icon: FeatureIcon, title, desc, color = "var(--accent-primary)" }) => {
    return (
        <motion.div
            whileHover={{ y: -10, transition: { duration: 0.3 } }}
            className="premium-card"
            style={{
                padding: '3rem 2rem',
                textAlign: 'start',
                background: 'rgba(18, 18, 18, 0.6)',
                backdropFilter: 'blur(20px)',
                border: '1px solid var(--border-subtle)'
            }}
        >
            <div className="gold-glow-overlay" />
            <div style={{
                background: 'linear-gradient(135deg, rgba(212,175,55,0.1) 0%, transparent 100%)',
                width: '64px', height: '64px',
                borderRadius: '16px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: '1.8rem',
                border: '1px solid rgba(212, 175, 55, 0.25)',
                boxShadow: '0 8px 20px rgba(212,175,55,0.05)'
            }}>
                <FeatureIcon size={30} color={color} />
            </div>
            <h3 style={{ fontSize: '1.4rem', marginBottom: '1rem', fontWeight: 700, fontFamily: 'var(--font-heading)', color: 'var(--text-primary)' }}>{title}</h3>
            <p style={{ color: 'var(--text-secondary)', lineHeight: '1.7', fontSize: '1rem' }}>{desc}</p>
        </motion.div>
    );
};



const Home = () => {
    const { lang } = useSettingsStore();
    const t = translations[lang];
    const { setActiveSection } = useOutletContext() || {};

    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

    useEffect(() => {
        if (!setActiveSection) return;

        const sections = ['home', 'features', 'about'];

        const observerCallback = (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    setActiveSection(entry.target.id);
                }
            });
        };

        const observerOptions = {
            root: null,
            rootMargin: '-30% 0px -40% 0px',
            threshold: 0.1
        };

        const observer = new IntersectionObserver(observerCallback, observerOptions);

        sections.forEach((id) => {
            const el = document.getElementById(id);
            if (el) {
                observer.observe(el);
            }
        });

        const handleScroll = () => {
            const scrollPosition = window.innerHeight + window.pageYOffset;
            const scrollHeight = document.documentElement.scrollHeight;
            if (window.pageYOffset < 50) {
                setActiveSection('home');
            } else if (scrollPosition >= scrollHeight - 50) {
                setActiveSection('about');
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });

        // Trigger once initially
        handleScroll();

        return () => {
            observer.disconnect();
            window.removeEventListener('scroll', handleScroll);
        };
    }, [setActiveSection]);

    const handleMouseMove = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        setMousePos({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        });
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.15, delayChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { y: 30, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { type: 'spring', stiffness: 70, damping: 15 }
        }
    };

    return (
        <div
            onMouseMove={handleMouseMove}
            style={{ position: 'relative', overflow: 'hidden', minHeight: '100vh', background: 'var(--bg-page)' }}
        >
            {/* Cybersecurity Grid & Particle Overlays */}
            <div className="cyber-grid" />
            <BackgroundParticles />

            {/* Glowing Mouse Follow Overlay */}
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                background: `radial-gradient(700px circle at ${mousePos.x}px ${mousePos.y}px, rgba(212, 175, 55, 0.05), transparent 75%)`,
                pointerEvents: 'none',
                zIndex: 1
            }} />

            {/* Vertical Scanning Bar Sweep */}
            <motion.div
                animate={{ top: ['-10%', '110%'] }}
                transition={{ repeat: Infinity, duration: 6, ease: 'easeInOut' }}
                style={{
                    position: 'absolute',
                    left: 0,
                    width: '100%',
                    height: '2px',
                    background: 'linear-gradient(90deg, transparent, rgba(212, 175, 55, 0.4), transparent)',
                    boxShadow: '0 0 20px rgba(212, 175, 55, 0.3)',
                    zIndex: 2,
                    pointerEvents: 'none'
                }}
            />

            {/* HERO SECTION CONTAINER */}
            <motion.div
                id="home"
                className="home-hero-grid"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                style={{
                    padding: '8rem 2.5rem 6rem',
                    maxWidth: '1400px',
                    margin: '0 auto',
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    alignItems: 'center',
                    gap: '4rem',
                    position: 'relative',
                    zIndex: 3
                }}
            >
                {/* Hero Information */}
                <div style={{ textAlign: 'start' }}>
                    <motion.div variants={itemVariants} style={{
                        display: 'inline-flex', alignItems: 'center', gap: '0.6rem',
                        background: 'rgba(212, 175, 55, 0.08)', padding: '0.65rem 1.25rem',
                        borderRadius: '99px', marginBottom: '2.5rem',
                        color: 'var(--accent-primary)', fontWeight: '700',
                        border: '1px solid rgba(212, 175, 55, 0.2)',
                        fontFamily: 'var(--font-heading)', fontSize: '0.8rem',
                        textTransform: 'uppercase', letterSpacing: '0.08em',
                        boxShadow: '0 0 15px rgba(212, 175, 55, 0.05)'
                    }}>
                        <ShieldCheck size={16} />
                        <span>{t.badge}</span>
                    </motion.div>

                    <motion.h1 variants={itemVariants} style={{
                        fontSize: 'clamp(2.5rem, 5vw, 4.2rem)', fontWeight: '900', marginBottom: '2rem',
                        lineHeight: '1.15', letterSpacing: '-0.04em', color: 'var(--text-primary)',
                        fontFamily: 'var(--font-heading)'
                    }}>
                        {lang === 'ar' ? (
                            <>
                                حماية نزاهة المعلومات <br />
                                عبر <span className="text-gradient">Sentinel AI</span>
                            </>
                        ) : (
                            <>
                                Securing Information <br />
                                Integrity via <span className="text-gradient">Sentinel AI</span>
                            </>
                        )}
                    </motion.h1>

                    <motion.div variants={itemVariants} style={{ marginBottom: '2.5rem' }}>
                        <TypingText />
                    </motion.div>

                    <motion.p variants={itemVariants} style={{
                        fontSize: '1.15rem', color: 'var(--text-secondary)',
                        maxWidth: '560px', marginBottom: '3.5rem', lineHeight: '1.8',
                        fontWeight: '400'
                    }}>
                        {t.heroDesc}
                    </motion.p>

                    <motion.div variants={itemVariants} style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
                        <Link to="/auth/login" className="primary-btn" style={{
                            padding: '1.2rem 3rem', fontSize: '1.1rem', borderRadius: '14px',
                        }}>
                            {t.initPlatform} <ArrowRight size={20} style={{ transform: lang === 'ar' ? 'rotate(180deg)' : 'none' }} />
                        </Link>
                        <Link to="/auth/register" className="secondary-btn" style={{
                            padding: '1.2rem 3rem', fontSize: '1.1rem', borderRadius: '14px',
                        }}>
                            {t.sandbox} <UserPlus size={20} />
                        </Link>
                    </motion.div>
                </div>

                {/* Hero Visual Block */}
                <motion.div
                    variants={itemVariants}
                    style={{
                        background: 'radial-gradient(circle at center, rgba(212, 175, 55, 0.05) 0%, transparent 70%)',
                        padding: '3rem',
                        borderRadius: '24px',
                        border: '1px solid rgba(212, 175, 55, 0.08)',
                        backdropFilter: 'blur(20px)',
                        boxShadow: '0 30px 60px rgba(0,0,0,0.8)'
                    }}
                >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', borderBottom: '1px solid rgba(212,175,55,0.1)', paddingBottom: '1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <Cpu size={20} color="var(--accent-primary)" />
                            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{t.telemetry}</span>
                        </div>
                        <span style={{ fontSize: '0.8rem', color: 'var(--accent-primary)', fontFamily: 'var(--font-mono)' }}>{t.activeScan}</span>
                    </div>
                    <NeuralNetwork />
                </motion.div>
            </motion.div>

            {/* STATISTICS AND TELEMETRY GRID */}
            <div style={{ maxWidth: '1400px', margin: '4rem auto 8rem', padding: '0 2.5rem', position: 'relative', zIndex: 3 }}>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', alignItems: 'stretch' }}>

                    {/* Left: Interactive SVGs Charts */}
                    <div style={{ flex: '1.5 1 400px' }}>
                        <TelemetryChart />
                    </div>

                    {/* Right: Numerical metrics cards */}
                    <div style={{ flex: '1 1 300px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
                        <StatCard label={t.stat_verified} targetValue="1,489,203" suffix="+" />
                        <StatCard label={t.stat_latency} targetValue="240" suffix="ms" />
                        <StatCard label={t.stat_precision} targetValue="99.4" suffix="%" />
                        <StatCard label={t.stat_anomaly} targetValue="0.04" prefix="σ " />
                    </div>

                </div>
            </div>

            {/* MULTI-MODAL CAPABILITIES FEATURES */}
            <div id="features" style={{ maxWidth: '1400px', margin: '6rem auto 10rem', padding: '0 2.5rem', position: 'relative', zIndex: 3 }}>
                <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
                    <h2 style={{ fontSize: '2.5rem', fontWeight: '800', fontFamily: 'var(--font-heading)', color: 'var(--text-primary)' }}>
                        {t.modality_title}
                    </h2>
                    <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '1rem auto 0', fontSize: '1.1rem' }}>
                        {t.modality_desc}
                    </p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
                    <FeatureCard
                        icon={Zap}
                        title={t.feat_1_title}
                        desc={t.feat_1_desc}
                    />
                    <FeatureCard
                        icon={Binary}
                        title={t.feat_2_title}
                        desc={t.feat_2_desc}
                    />
                    <FeatureCard
                        icon={Lock}
                        title={t.feat_3_title}
                        desc={t.feat_3_desc}
                    />
                </div>
            </div>



            {/* ABOUT SECTION */}
            <section id="about" style={{ maxWidth: '1400px', margin: '0 auto 8rem', padding: '0 2.5rem', position: 'relative', zIndex: 3 }}>
                <div className="about-card">
                    <div className="gold-glow-overlay" />
                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
                        <div style={{
                            background: 'linear-gradient(135deg, rgba(212,175,55,0.1) 0%, transparent 100%)',
                            width: '64px', height: '64px',
                            borderRadius: '16px',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            border: '1px solid rgba(212, 175, 55, 0.25)',
                            boxShadow: '0 8px 20px rgba(212,175,55,0.05)'
                        }}>
                            <ShieldCheck size={30} color="var(--accent-primary)" />
                        </div>
                    </div>
                    <h2 style={{ fontSize: '2.5rem', fontWeight: '800', fontFamily: 'var(--font-heading)', color: 'var(--text-primary)', marginBottom: '1.5rem' }}>
                        {t.about_title}
                    </h2>
                    <p style={{ color: 'var(--text-secondary)', maxWidth: '800px', margin: '0 auto', fontSize: '1.1rem', lineHeight: '1.8' }}>
                        {t.about_desc}
                    </p>
                </div>
            </section>
        </div>
    );
};

export default Home;
