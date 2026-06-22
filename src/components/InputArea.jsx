import React from 'react';
import '../styles/InputArea.css';

const InputArea = ({ value, onChange }) => {
    return (
        <div className="input-area-container">
            <textarea
                className="input-textarea"
                placeholder="Paste your text here to analyze for AI generation..."
                value={value}
                onChange={onChange}
                rows={10}
            />
            <div className="input-footer">
                <span className="char-count">{value.length} characters</span>
                {/* Potentially add clear button here */}
            </div>
        </div>
    );
};

export default InputArea;
