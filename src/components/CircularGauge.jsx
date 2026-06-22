import React from 'react';
import { motion } from 'framer-motion';
import '../styles/CircularGauge.css';

const CircularGauge = ({ value = 0 }) => {
    const numericValue = typeof value === 'number' ? value : parseFloat(value) || 0;
    const radius = 80;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (numericValue / 100) * circumference;

    let color = 'var(--neon-green)'; // Human
    if (numericValue > 60) color = 'var(--neon-red)'; // AI
    else if (numericValue > 30) color = 'var(--neon-yellow)'; // Mixed

    return (
        <div className="gauge-container">
            <svg width="200" height="200" className="gauge-svg">
                <circle
                    cx="100"
                    cy="100"
                    r={radius}
                    fill="none"
                    stroke="var(--border-subtle)"
                    strokeWidth="12"
                />
                <motion.circle
                    cx="100"
                    cy="100"
                    r={radius}
                    fill="none"
                    stroke={color}
                    strokeWidth="12"
                    strokeDasharray={circumference}
                    strokeDashoffset={circumference} // Start empty
                    animate={{ strokeDashoffset }}
                    transition={{ duration: 1.5, ease: "easeInOut" }}
                    strokeLinecap="round"
                    transform="rotate(-90 100 100)"
                />
            </svg>
            <div className="gauge-text">
                <span className="gauge-value">{numericValue}%</span>
                <span className="gauge-label">AI Probability</span>
            </div>
        </div>
    );
};

export default CircularGauge;
