/* eslint-disable no-unused-vars */
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  HamburgerIcon,
  BellIcon,
  SunIcon,
  MoonIcon,
  ChevronDownIcon,
  SignOutIcon,
} from "./ui/Icons";

// ─── Sheet Icon ───────────────────────────────────────────────────────────────
const SheetIcon = () => (
  <svg
    width="16"
    height="16"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9 17H7A2 2 0 015 15V7a2 2 0 012-2h10a2 2 0 012 2v2M9 12h6m-6 4h4m1 5H11a2 2 0 01-2-2v-6a2 2 0 012-2h6a2 2 0 012 2v6a2 2 0 01-2 2z"
    />
  </svg>
);

const CheckIcon = () => (
  <svg
    width="14"
    height="14"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M4.5 12.75l6 6 9-13.5"
    />
  </svg>
);

export default function TopNavbar({
  dark,
  setDark,
  sidebarOpen,
  setSidebarOpen,
}) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [localInstituteName, setLocalInstituteName] = useState("");
  const [sheetPanelOpen, setSheetPanelOpen] = useState(false);
  const [sheetUrl, setSheetUrl] = useState("");
  const [sheetInput, setSheetInput] = useState("");
  const [saved, setSaved] = useState(false);
  const dropRef = useRef(null);
  const navigate = useNavigate();

  const bg = dark ? "#1C2333" : "#fff";
  const border = dark ? "#2A3347" : "#E5E7EB";
  const textPrimary = dark ? "#F9FAFB" : "#111827";
  const textSecondary = dark ? "#9CA3AF" : "#6B7280";
  const hoverBg = dark ? "#2A3347" : "#F3F4F6";
  const iconColor = dark ? "#9CA3AF" : "#6B7280";
  const inputBg = dark ? "#111827" : "#F9FAFB";
  const inputBorder = dark ? "#374151" : "#E2E8F0";

  useEffect(() => {
    const storedName = localStorage.getItem("institute_name");
    if (storedName) setLocalInstituteName(storedName);

    const storedSheet = localStorage.getItem("sheet_url");
    if (storedSheet) {
      setSheetUrl(storedSheet);
      setSheetInput(storedSheet);
    }

    const handler = (e) => {
      if (dropRef.current && !dropRef.current.contains(e.target)) {
        setDropdownOpen(false);
        setSheetPanelOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const initials = localInstituteName
    ? localInstituteName.slice(0, 2).toUpperCase()
    : "IN";

  const handleSignOut = () => {
    localStorage.clear();
    navigate("/", { replace: true });
  };

  const handleSaveSheet = () => {
    const trimmed = sheetInput.trim();
    localStorage.setItem("sheet_url", trimmed);
    setSheetUrl(trimmed);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const iconBtn = {
    background: "none",
    border: "none",
    cursor: "pointer",
    color: iconColor,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "8px",
    borderRadius: "8px",
    transition: "background 0.15s",
  };

  return (
    <div
      style={{
        height: "64px",
        background: bg,
        borderBottom: `1px solid ${border}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 20px",
        position: "sticky",
        top: 0,
        zIndex: 20,
        flexShrink: 0,
      }}
    >
      <button
        style={iconBtn}
        onClick={() => setSidebarOpen((p) => !p)}
        onMouseEnter={(e) => (e.currentTarget.style.background = hoverBg)}
        onMouseLeave={(e) => (e.currentTarget.style.background = "none")}
      >
        <HamburgerIcon />
      </button>

      <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
        <button
          style={iconBtn}
          onClick={() => setDark((p) => !p)}
          onMouseEnter={(e) => (e.currentTarget.style.background = hoverBg)}
          onMouseLeave={(e) => (e.currentTarget.style.background = "none")}
        >
          {dark ? <SunIcon /> : <MoonIcon />}
        </button>

        <button
          style={{ ...iconBtn, position: "relative" }}
          onMouseEnter={(e) => (e.currentTarget.style.background = hoverBg)}
          onMouseLeave={(e) => (e.currentTarget.style.background = "none")}
        >
          <BellIcon />
          <span
            style={{
              position: "absolute",
              top: "6px",
              right: "6px",
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              background: "#F97316",
              border: `2px solid ${bg}`,
            }}
          />
        </button>

        <div
          style={{
            width: "1px",
            height: "28px",
            background: border,
            margin: "0 6px",
          }}
        />

        {/* ── Profile dropdown ── */}
        <div ref={dropRef} style={{ position: "relative" }}>
          <button
            onClick={() => {
              setDropdownOpen((p) => !p);
              setSheetPanelOpen(false);
            }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "4px 8px",
              borderRadius: "10px",
              transition: "background 0.15s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = hoverBg)}
            onMouseLeave={(e) => (e.currentTarget.style.background = "none")}
          >
            <div
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "50%",
                background: "#3B4FE4",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "13px",
                fontWeight: "700",
                color: "#fff",
                flexShrink: 0,
              }}
            >
              {initials}
            </div>
            <span
              style={{
                fontSize: "14px",
                fontWeight: "600",
                color: textPrimary,
                maxWidth: "130px",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {localInstituteName || "Institute"}
            </span>
            <ChevronDownIcon />
          </button>

          {dropdownOpen && (
            <div
              style={{
                position: "absolute",
                right: 0,
                top: "calc(100% + 8px)",
                background: bg,
                border: `1px solid ${border}`,
                borderRadius: "12px",
                boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
                minWidth: "240px",
                zIndex: 100,
                overflow: "hidden",
              }}
            >
              {/* Institute info */}
              <div
                style={{
                  padding: "12px 16px",
                  borderBottom: `1px solid ${border}`,
                }}
              >
                <div
                  style={{
                    fontSize: "14px",
                    fontWeight: "600",
                    color: textPrimary,
                  }}
                >
                  {localInstituteName}
                </div>
                <div style={{ fontSize: "12px", color: textSecondary }}>
                  Administrator
                </div>
              </div>

              {/* ── Sheet ID row ── */}
              <div style={{ borderBottom: `1px solid ${border}` }}>
                <button
                  onClick={() => setSheetPanelOpen((p) => !p)}
                  style={{
                    width: "100%",
                    padding: "11px 16px",
                    background: "none",
                    border: "none",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: "10px",
                    color: textPrimary,
                    cursor: "pointer",
                    textAlign: "left",
                    fontSize: "14px",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = hoverBg)
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = "none")
                  }
                >
                  <span
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                    }}
                  >
                    <span style={{ color: "#10B981" }}>
                      <SheetIcon />
                    </span>
                    Sheet ID
                  </span>
                  <span
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                    }}
                  >
                    {sheetUrl && (
                      <span
                        style={{
                          fontSize: "11px",
                          background: "#DCFCE7",
                          color: "#15803D",
                          padding: "2px 7px",
                          borderRadius: "20px",
                          fontWeight: 600,
                        }}
                      >
                        Linked
                      </span>
                    )}
                    <svg
                      width="14"
                      height="14"
                      fill="none"
                      stroke={textSecondary}
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      style={{
                        transform: sheetPanelOpen
                          ? "rotate(180deg)"
                          : "rotate(0deg)",
                        transition: "transform 0.2s",
                      }}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </span>
                </button>

                {/* Expandable input panel */}
                {sheetPanelOpen && (
                  <div
                    style={{
                      padding: "4px 16px 14px",
                      display: "flex",
                      flexDirection: "column",
                      gap: "8px",
                    }}
                  >
                    <p
                      style={{
                        fontSize: "12px",
                        color: textSecondary,
                        margin: 0,
                      }}
                    >
                      Paste your Google Sheet URL below
                    </p>
                    <input
                      type="url"
                      placeholder="https://docs.google.com/spreadsheets/..."
                      value={sheetInput}
                      onChange={(e) => {
                        setSheetInput(e.target.value);
                        setSaved(false);
                      }}
                      style={{
                        width: "100%",
                        boxSizing: "border-box",
                        padding: "8px 12px",
                        fontSize: "12px",
                        border: `1px solid ${inputBorder}`,
                        borderRadius: "6px",
                        background: inputBg,
                        color: textPrimary,
                        outline: "none",
                      }}
                      onFocus={(e) => (e.target.style.borderColor = "#3C50E0")}
                      onBlur={(e) => (e.target.style.borderColor = inputBorder)}
                    />
                    <button
                      onClick={handleSaveSheet}
                      style={{
                        padding: "7px 12px",
                        fontSize: "12px",
                        fontWeight: 600,
                        border: "none",
                        borderRadius: "6px",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "6px",
                        background: saved ? "#10B981" : "#3C50E0",
                        color: "#fff",
                        transition: "background 0.2s",
                      }}
                    >
                      {saved ? (
                        <>
                          <CheckIcon /> Saved!
                        </>
                      ) : (
                        "Save URL"
                      )}
                    </button>
                  </div>
                )}
              </div>

              {/* Sign out */}
              <button
                onClick={handleSignOut}
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  background: "none",
                  border: "none",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  color: "#EF4444",
                  cursor: "pointer",
                  textAlign: "left",
                  fontSize: "14px",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = hoverBg)
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "none")
                }
              >
                <SignOutIcon /> Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
