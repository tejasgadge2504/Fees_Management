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

export default function TopNavbar({
  dark,
  setDark,
  sidebarOpen,
  setSidebarOpen,
}) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [localInstituteName, setLocalInstituteName] = useState("");
  const dropRef = useRef(null);
  const navigate = useNavigate();

  const bg = dark ? "#1C2333" : "#fff";
  const border = dark ? "#2A3347" : "#E5E7EB";
  const textPrimary = dark ? "#F9FAFB" : "#111827";
  const textSecondary = dark ? "#9CA3AF" : "#6B7280";
  const hoverBg = dark ? "#2A3347" : "#F3F4F6";
  const iconColor = dark ? "#9CA3AF" : "#6B7280";

  useEffect(() => {
    const storedName = localStorage.getItem("institute_name");
    if (storedName) setLocalInstituteName(storedName);

    const handler = (e) => {
      if (dropRef.current && !dropRef.current.contains(e.target))
        setDropdownOpen(false);
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

        <div ref={dropRef} style={{ position: "relative" }}>
          <button
            onClick={() => setDropdownOpen((p) => !p)}
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
                minWidth: "200px",
                zIndex: 100,
                overflow: "hidden",
              }}
            >
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
