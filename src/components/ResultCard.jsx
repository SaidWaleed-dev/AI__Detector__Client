import React from 'react';
import { CheckCircle, AlertTriangle, AlertCircle } from 'lucide-react';
import '../styles/ResultCard.css';

const ResultCard = ({ result }) => {
    if (!result) return null;

    const { isAiGenerated, aiProbability, details } = result;

    // Determine status
    let colorClass = 'status-human';
    let Icon = CheckCircle;
    let statusText = 'Human Written';

    if (isAiGenerated) {
        colorClass = 'status-ai';
        Icon = AlertTriangle;
        statusText = 'AI Generated';
    } else if (aiProbability > 0.3 && aiProbability < 0.7) { // Example threshold
        colorClass = 'status-mixed';
        Icon = AlertCircle;
        statusText = 'Mixed / Uncertain';
    }

    const percentage = Math.round(aiProbability * 100);

    return (
        <div className={`result-card ${colorClass} fade-in`}>
            <div className="result-header">
                <Icon size={32} />
                <h3 className="result-title">{statusText}</h3>
            </div>

            <div className="score-container">
                <div className="score-label">AI Probability Score</div>
                <div className="score-bar-bg">
                    <div
                        className="score-bar-fill"
                        style={{ width: `${percentage}%` }}
                    ></div>
                </div>
                <div className="score-value">{percentage}%</div>
            </div>

            {details && (
                <div className="result-details">
                    <h4>Analysis Details:</h4>
                    <pre className="details-json">{JSON.stringify(JSON.parse(details || '{}'), null, 2)}</pre>
                </div>
            )}
        </div>
    );
};

export default ResultCard;
