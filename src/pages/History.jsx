import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { detectionService } from '../infrastructure/services/detectionService';
import { useAuthStore } from '../application/store/useAuthStore';
import {
    Loader2,
    History as HistoryIcon,
    FileText,
    Image as ImageIcon,
    Video,
    Music,
    Calendar,
    Search,
    Trash2,
    AlertTriangle,
    RotateCcw,
} from 'lucide-react';
import ScoreCard from '../components/ScoreCard';
import '../styles/History.css';

const UNDO_TIMEOUT_MS = 5000;

const getContentTypeLabel = (type) => {
    switch (type) {
        case 1: return 'TEXT';
        case 2: return 'IMAGE';
        case 3: return 'VIDEO';
        case 4: return 'AUDIO';
        default: return 'UNKNOWN';
    }
};

const getAiPercent = (item) => {
    // Backend nests aiProbability inside results[0]; mock data had it at root level
    const value = item?.aiProbability ?? item?.results?.[0]?.aiProbability ?? 0;
    return value <= 1 ? Math.round(value * 100) : Math.round(value);
};

const filterHistoryItems = (items, query) => {
    const q = query.trim().toLowerCase();
    if (!q) return items;

    return items.filter((item) => {
        const searchable = [
            item.data,
            item.contentId?.toString(),
            getContentTypeLabel(item.contentType),
            String(getAiPercent(item)),
            `${getAiPercent(item)}%`,
        ]
            .filter(Boolean)
            .join(' ')
            .toLowerCase();

        return searchable.includes(q);
    });
};

const History = () => {
    const [historyItems, setHistoryItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [pendingDelete, setPendingDelete] = useState(null);
    const [undoSnapshot, setUndoSnapshot] = useState(null);
    const undoTimeoutRef = useRef(null);
    const { user } = useAuthStore();

    const clearUndoTimer = useCallback(() => {
        if (undoTimeoutRef.current) {
            clearTimeout(undoTimeoutRef.current);
            undoTimeoutRef.current = null;
        }
    }, []);

    const dismissUndo = useCallback(() => {
        clearUndoTimer();
        setUndoSnapshot(null);
    }, [clearUndoTimer]);

    const showUndoBanner = useCallback((snapshot) => {
        clearUndoTimer();
        setUndoSnapshot(snapshot);
        undoTimeoutRef.current = setTimeout(() => {
            setUndoSnapshot(null);
            undoTimeoutRef.current = null;
        }, UNDO_TIMEOUT_MS);
    }, [clearUndoTimer]);

    useEffect(() => {
        const fetchHistory = async () => {
            if (!user?.id) {
                setLoading(false);
                return;
            }
            try {
                const data = await detectionService.getHistory(user.id);
                setHistoryItems(data);
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to load history');
            } finally {
                setLoading(false);
            }
        };

        fetchHistory();
    }, [user?.id]);

    useEffect(() => () => clearUndoTimer(), [clearUndoTimer]);

    const filteredItems = useMemo(
        () => filterHistoryItems(historyItems, searchQuery),
        [historyItems, searchQuery]
    );

    const handleDeleteRequest = (id) => {
        setPendingDelete({ type: 'single', id });
    };

    const handleDeleteAllRequest = () => {
        if (historyItems.length === 0) return;
        setPendingDelete({ type: 'ALL' });
    };

    const handleCancelDelete = () => {
        setPendingDelete(null);
    };

    const handleConfirmDelete = () => {
        if (!pendingDelete) return;

        if (pendingDelete.type === 'single') {
            const deletedItem = historyItems.find((item) => item.contentId === pendingDelete.id);
            if (!deletedItem) {
                setPendingDelete(null);
                return;
            }

            // TODO: Hook up backend DELETE API here — DELETE /api/detection/history/{contentId}
            const previousList = [...historyItems];
            setHistoryItems((prev) => prev.filter((item) => item.contentId !== pendingDelete.id));
            showUndoBanner({
                mode: 'single',
                label: `1 record deleted`,
                previousList,
            });
        } else if (pendingDelete.type === 'ALL') {
            // TODO: Hook up backend DELETE ALL API here — DELETE /api/detection/history/{userId}
            const previousList = [...historyItems];
            setHistoryItems([]);
            showUndoBanner({
                mode: 'all',
                label: `${previousList.length} records deleted`,
                previousList,
            });
        }

        setPendingDelete(null);
    };

    const handleUndo = () => {
        if (!undoSnapshot?.previousList) return;

        // TODO: Hook up backend undo/sync if deletes were persisted server-side
        setHistoryItems(undoSnapshot.previousList);
        dismissUndo();
    };

    const getContentTypeIcon = (type) => {
        switch (type) {
            case 1: return <FileText size={16} />;
            case 2: return <ImageIcon size={16} />;
            case 3: return <Video size={16} />;
            case 4: return <Music size={16} />;
            default: return null;
        }
    };

    const renderContent = (item) => {
        const { contentType, data } = item;

        switch (contentType) {
            case 1:
                return <div className="history-content-text">{data}</div>;
            case 2:
                return (
                    <div className="history-content-image">
                        <img src={data} alt="Analyzed content" />
                    </div>
                );
            case 3:
                return (
                    <div className="history-content-media">
                        <Video size={24} color="var(--accent-primary)" />
                        <span>Video Analysis</span>
                        <a href={data} target="_blank" rel="noopener noreferrer">View Video</a>
                    </div>
                );
            case 4:
                return (
                    <div className="history-content-media">
                        <Music size={24} color="var(--accent-primary)" />
                        <span>Audio Analysis</span>
                        <a href={data} target="_blank" rel="noopener noreferrer">Listen Audio</a>
                    </div>
                );
            default:
                return null;
        }
    };

    const modalMessage = pendingDelete?.type === 'ALL'
        ? `This will permanently remove all ${historyItems.length} detection record${historyItems.length === 1 ? '' : 's'} from your history. This action cannot be undone after the 5-second recovery window.`
        : 'This detection record will be removed from your history. You can undo this action within 5 seconds.';

    const modalTitle = pendingDelete?.type === 'ALL'
        ? 'Delete All History?'
        : 'Delete This Record?';

    if (loading) {
        return (
            <div className="history-loading">
                <Loader2 className="animate-spin" size={48} color="var(--accent-primary)" />
            </div>
        );
    }

    if (error) {
        return <div className="history-error">{error}</div>;
    }

    return (
        <div className="history-page-wrapper">
            <div className="history-page">
                <div className="history-header">
                    <div className="history-header-brand">
                        <div className="history-header-icon">
                            <HistoryIcon size={24} color="white" />
                        </div>
                        <div>
                            <h2 className="history-title">Detection History</h2>
                            <p className="history-subtitle">
                                View, search, and manage your previous analysis results
                            </p>
                        </div>
                    </div>
                </div>

                <div className="history-toolbar">
                    <div className="history-search-wrap">
                        <Search className="history-search-icon" size={18} />
                        <input
                            type="search"
                            className="history-search-input"
                            placeholder="Search by content, type, classification, or AI %..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            aria-label="Search history"
                        />
                    </div>
                    <button
                        type="button"
                        className="history-delete-all-btn"
                        onClick={handleDeleteAllRequest}
                        disabled={historyItems.length === 0}
                    >
                        <Trash2 size={16} />
                        Delete All
                    </button>
                </div>

                {historyItems.length > 0 && (
                    <p className="history-results-meta">
                        Showing {filteredItems.length} of {historyItems.length} record{historyItems.length === 1 ? '' : 's'}
                        {searchQuery.trim() ? ` matching "${searchQuery.trim()}"` : ''}
                    </p>
                )}

                {historyItems.length === 0 ? (
                    <div className="history-empty">
                        <HistoryIcon size={48} opacity={0.3} />
                        <div>
                            <p className="history-empty-title">No history found</p>
                            <p className="history-empty-desc">Your analyzed content will appear here</p>
                        </div>
                    </div>
                ) : filteredItems.length === 0 ? (
                    <div className="history-empty">
                        <Search size={48} opacity={0.3} />
                        <div>
                            <p className="history-empty-title">No matching records</p>
                            <p className="history-empty-desc">Try a different search term or clear the filter</p>
                        </div>
                    </div>
                ) : (
                    <div className="history-list">
                        {filteredItems.map((item) => (
                            <article key={item.contentId} className="history-card">
                                <div className="history-card-main">
                                    <div className="history-card-meta">
                                        <div className="history-card-meta-left">
                                            <span className="history-type-badge">
                                                {getContentTypeIcon(item.contentType)}
                                                {getContentTypeLabel(item.contentType)}
                                            </span>
                                            <span className="history-date">
                                                <Calendar size={14} />
                                                {new Date(item.uploadedAt).toLocaleString()}
                                            </span>
                                            <span className="history-date">
                                                {getAiPercent(item)}% AI
                                            </span>
                                        </div>
                                        <button
                                            type="button"
                                            className="history-delete-btn"
                                            onClick={() => handleDeleteRequest(item.contentId)}
                                            aria-label={`Delete record ${item.contentId}`}
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>

                                    <div>
                                        <h4 className="history-content-label">Analyzed Content</h4>
                                        {renderContent(item)}
                                    </div>
                                </div>

                                <div className="history-card-score">
                                    <ScoreCard result={item} />
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </div>

            {pendingDelete && (
                <div
                    className="history-modal-backdrop"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="history-delete-modal-title"
                    onClick={handleCancelDelete}
                >
                    <div className="history-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="history-modal-icon">
                            <AlertTriangle size={24} />
                        </div>
                        <h3 id="history-delete-modal-title" className="history-modal-title">
                            {modalTitle}
                        </h3>
                        <p className="history-modal-message">{modalMessage}</p>
                        <div className="history-modal-actions">
                            <button type="button" className="history-modal-cancel" onClick={handleCancelDelete}>
                                Cancel
                            </button>
                            <button type="button" className="history-modal-confirm" onClick={handleConfirmDelete}>
                                Confirm Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {undoSnapshot && (
                <div className="history-undo-banner" role="status" aria-live="polite">
                    <p className="history-undo-text">
                        <strong>{undoSnapshot.label}</strong> — Undo available for 5 seconds
                    </p>
                    <button type="button" className="history-undo-btn" onClick={handleUndo}>
                        <RotateCcw size={15} />
                        Undo
                    </button>
                </div>
            )}
        </div>
    );
};

export default History;
