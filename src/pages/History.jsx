import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { detectionService } from "../infrastructure/services/detectionService";
import { useAuthStore } from "../application/store/useAuthStore";
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
} from "lucide-react";
import ScoreCard from "../components/ScoreCard";
import "../styles/History.css";

const getContentTypeLabel = (type) => {
  switch (type) {
    case 1:
      return "TEXT";
    case 2:
      return "IMAGE";
    case 3:
      return "VIDEO";
    case 4:
      return "AUDIO";
    default:
      return "UNKNOWN";
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
      .join(" ")
      .toLowerCase();

    return searchable.includes(q);
  });
};

const getMediaUrl = (path) => {
  if (!path) return "";
  if (
    path.startsWith("http://") ||
    path.startsWith("https://") ||
    path.startsWith("data:")
  ) {
    return path;
  }
  const apiBaseUrl = import.meta.env.VITE_API_URL || "http://localhost:5050";
  const cleanPath = path.startsWith("/") ? path.slice(1) : path;
  const cleanBase = apiBaseUrl.endsWith("/") ? apiBaseUrl : `${apiBaseUrl}/`;
  return `${cleanBase}${cleanPath}`;
};

const History = () => {
  const [historyItems, setHistoryItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [pendingDelete, setPendingDelete] = useState(null);
  const { user } = useAuthStore();

  useEffect(() => {
    const fetchHistory = async () => {
      if (!user?.id) {
        setLoading(false);
        return;
      }
      try {
        const data = await detectionService.getHistory(user.id);
        setHistoryItems(data);
        // Debug: log fetched history for troubleshooting missing content
        // (keeps in place while diagnosing — safe to remove later)
        // eslint-disable-next-line no-console
        console.log("[History] fetched items:", data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load history");
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [user?.id]);

  const filteredItems = useMemo(
    () => filterHistoryItems(historyItems, searchQuery),
    [historyItems, searchQuery],
  );

  const handleDeleteRequest = (id) => {
    setPendingDelete({ type: "single", id });
  };

  const handleDeleteAllRequest = () => {
    if (historyItems.length === 0) return;
    setPendingDelete({ type: "ALL" });
  };

  const handleCancelDelete = () => {
    setPendingDelete(null);
  };

  const handleConfirmDelete = async () => {
    if (!pendingDelete) return;

    try {
      if (pendingDelete.type === "single") {
        await detectionService.deleteHistoryItem(pendingDelete.id);
        setHistoryItems((prev) =>
          prev.filter((item) => item.contentId !== pendingDelete.id),
        );
      } else if (pendingDelete.type === "ALL") {
        if (user?.id) {
          await detectionService.clearHistory(user.id);
          setHistoryItems([]);
        }
      }
    } catch (err) {
      console.error("Failed to delete", err);
      alert(
        err.response?.data?.message ||
          "Failed to delete record. Please try again.",
      );
    } finally {
      setPendingDelete(null);
    }
  };

  const getContentTypeIcon = (type) => {
    switch (type) {
      case 1:
        return <FileText size={16} />;
      case 2:
        return <ImageIcon size={16} />;
      case 3:
        return <Video size={16} />;
      case 4:
        return <Music size={16} />;
      default:
        return null;
    }
  };

  const renderContent = (item) => {
    const { contentType, data } = item;

    switch (contentType) {
      case 1:
        return <div className="history-content-text">{data}</div>;
      case 2:
        // If `data` isn't a URL or data URI, show it as text instead of a broken image
        if (
          !data ||
          (!data.startsWith("http://") &&
            !data.startsWith("https://") &&
            !data.startsWith("data:") &&
            !data.startsWith("/"))
        ) {
          return <div className="history-content-text">{String(data)}</div>;
        }

        return (
          <div className="history-content-image">
            <img
              src={getMediaUrl(data)}
              alt="Analyzed content"
              style={{ width: "100%", height: "auto", display: "block" }}
              onError={(e) => {
                // Replace broken image with a visible SVG placeholder so user knows it's unavailable
                // eslint-disable-next-line no-console
                console.warn("[History] image load failed for", e.target.src);
                try {
                  e.target.onerror = null;
                  const svg = encodeURIComponent(
                    `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="200"><rect width="100%" height="100%" fill="#0b0b0b"/><text x="50%" y="50%" fill="#d4af37" font-size="14" text-anchor="middle" dominant-baseline="middle">Image unavailable</text></svg>`,
                  );
                  e.target.src = `data:image/svg+xml;utf8,${svg}`;
                  e.target.style.objectFit = "contain";
                  e.target.style.background = "transparent";
                } catch (ex) {
                  e.target.style.display = "none";
                }
              }}
            />
          </div>
        );
      case 3:
        return (
          <div className="history-content-media">
            <Video size={24} color="var(--accent-primary)" />
            <span>Video Analysis</span>
            <a
              href={getMediaUrl(data)}
              target="_blank"
              rel="noopener noreferrer"
            >
              View Video
            </a>
          </div>
        );
      case 4:
        return (
          <div className="history-content-media">
            <Music size={24} color="var(--accent-primary)" />
            <span>Audio Analysis</span>
            <a
              href={getMediaUrl(data)}
              target="_blank"
              rel="noopener noreferrer"
            >
              Listen Audio
            </a>
          </div>
        );
      default:
        return null;
    }
  };

  const modalMessage =
    pendingDelete?.type === "ALL"
      ? `This will permanently remove all ${historyItems.length} detection record${historyItems.length === 1 ? "" : "s"} from your history. This action cannot be undone.`
      : "This detection record will be permanently removed from your history. This action cannot be undone.";

  const modalTitle =
    pendingDelete?.type === "ALL"
      ? "Delete All History?"
      : "Delete This Record?";

  if (loading) {
    return (
      <div className="history-loading">
        <Loader2
          className="animate-spin"
          size={48}
          color="var(--accent-primary)"
        />
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
            Showing {filteredItems.length} of {historyItems.length} record
            {historyItems.length === 1 ? "" : "s"}
            {searchQuery.trim() ? ` matching "${searchQuery.trim()}"` : ""}
          </p>
        )}

        {historyItems.length === 0 ? (
          <div className="history-empty">
            <HistoryIcon size={48} opacity={0.3} />
            <div>
              <p className="history-empty-title">No history found</p>
              <p className="history-empty-desc">
                Your analyzed content will appear here
              </p>
            </div>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="history-empty">
            <Search size={48} opacity={0.3} />
            <div>
              <p className="history-empty-title">No matching records</p>
              <p className="history-empty-desc">
                Try a different search term or clear the filter
              </p>
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
              <button
                type="button"
                className="history-modal-cancel"
                onClick={handleCancelDelete}
              >
                Cancel
              </button>
              <button
                type="button"
                className="history-modal-confirm"
                onClick={handleConfirmDelete}
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default History;
