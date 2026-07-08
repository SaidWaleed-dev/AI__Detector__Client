import {
  LogIn,
  LayoutDashboard,
  LogOut,
  ChevronRight,
  Sun,
  Moon,
  Globe,
  Menu,
  X,
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuthStore } from "../application/store/useAuthStore";
import { useSettingsStore } from "../application/store/useSettingsStore";
import { translations } from "../application/utils/translations";
import { motion } from "framer-motion";
import { useState } from "react";
import "../styles/Header.css";

const Header = ({ activeSection }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { isAuthenticated, logout } = useAuthStore();
  const { theme, toggleTheme, lang, setLang } = useSettingsStore();
  const location = useLocation();
  const navigate = useNavigate();

  const isHomePage = location.pathname === "/";

  const t = translations[lang];

  const isPathActive = (path) => location.pathname === path;

  const isLinkActive = (sectionId, path = "/") => {
    if (location.pathname !== path) return false;
    if (!activeSection) return path === "/" && isPathActive("/");
    return activeSection === sectionId;
  };

  const handleScrollToSection = (id) => {
    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }, 300);
    } else {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }
    setMenuOpen(false);
  };

  const closeMenu = () => setMenuOpen(false);

  const handleLogout = async () => {
    await logout();
    closeMenu();
    navigate("/");
  };

  const handleNavigate = (path) => {
    navigate(path);
    closeMenu();
  };

  return (
    <motion.header
      className="header"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className="header-container">
        <Link to="/" className="logo">
          <img
            src="/logo.jpg"
            alt="Logo"
            style={{
              width: "34px",
              height: "34px",
              borderRadius: "8px",
              objectFit: "cover",
              filter: "drop-shadow(0 0 8px var(--accent-glow))",
            }}
          />
          <span className="logo-text">
            Sentinel <span className="logo-highlight">AI</span>
          </span>
        </Link>

        <nav className={`nav ${menuOpen ? "mobile-open" : ""}`}>
          {isHomePage ? (
            <>
              <button
                onClick={() => handleScrollToSection("home")}
                className={`nav-link desktop-only ${isLinkActive("home", "/") ? "active" : ""}`}
              >
                {t.home}
              </button>
              <button
                onClick={() => handleScrollToSection("features")}
                className={`nav-link desktop-only ${isLinkActive("features", "/") ? "active" : ""}`}
              >
                {t.features}
              </button>
              <button
                onClick={() => handleScrollToSection("about")}
                className={`nav-link desktop-only ${isLinkActive("about", "/") ? "active" : ""}`}
              >
                {t.about}
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => handleNavigate("/")}
                className="nav-link desktop-only"
              >
                {t.home}
              </button>
              {isAuthenticated && (
                <button
                  onClick={() => handleNavigate("/dashboard")}
                  className="nav-link desktop-only"
                >
                  {t.dashboard}
                </button>
              )}
              {isAuthenticated && (
                <button
                  onClick={() => handleNavigate("/history")}
                  className="nav-link desktop-only"
                >
                  {t.history}
                </button>
              )}
            </>
          )}

          {/* Language Switcher */}
          <button
            onClick={() => {
              setLang(lang === "en" ? "ar" : "en");
              closeMenu();
            }}
            className="nav-link desktop-only"
            style={{
              background: "none",
              border: "none",
              color: "var(--text-secondary)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "0.4rem",
              font: "inherit",
            }}
            title="Toggle Language"
          >
            <Globe size={16} />
            <span>{t.language}</span>
          </button>

          {/* Theme Toggle */}
          <button
            onClick={() => {
              toggleTheme();
              closeMenu();
            }}
            className="nav-link desktop-only"
            style={{
              background: "none",
              border: "none",
              color: "var(--text-secondary)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "0 0.5rem",
            }}
            title="Toggle Theme"
          >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {isAuthenticated && !isHomePage && (
            <button
              onClick={handleLogout}
              className="nav-link desktop-only"
              style={{
                background: "none",
                border: "none",
                color: "var(--text-secondary)",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "0.4rem",
                font: "inherit",
              }}
              title={t.logout}
            >
              <LogOut size={16} />
              <span>{t.logout}</span>
            </button>
          )}

          {isAuthenticated ? (
            <Link
              to="/dashboard"
              className="primary-btn auth-nav-btn"
              onClick={closeMenu}
            >
              <LayoutDashboard size={18} />
              <span>{t.dashboard}</span>
              <ChevronRight
                size={16}
                style={{ transform: lang === "ar" ? "rotate(180deg)" : "none" }}
              />
            </Link>
          ) : (
            <Link
              to="/auth/login"
              className="primary-btn auth-nav-btn"
              onClick={closeMenu}
            >
              <LogIn size={18} />
              <span>{t.login}</span>
              <ChevronRight
                size={16}
                style={{ transform: lang === "ar" ? "rotate(180deg)" : "none" }}
              />
            </Link>
          )}
        </nav>

        <div className="mobile-header-actions">
          <button
            onClick={() => toggleTheme()}
            className="mobile-action-btn"
            title="Toggle Theme"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          <button
            onClick={() => setLang(lang === "en" ? "ar" : "en")}
            className="mobile-action-btn"
            title="Toggle Language"
            aria-label="Toggle language"
          >
            <Globe size={20} />
          </button>

          <button
            className="mobile-menu-toggle"
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;
