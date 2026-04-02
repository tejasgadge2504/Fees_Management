import { HomeIcon, ShieldIcon, UsersIcon } from "./ui/Icons";

const NAV = [
  {
    section: "STUDENTS",
    label: "Students",
    icon: <UsersIcon />,
    page: "students",
  },
  {
    section: "STANDARD",
    label: "Standard",
    icon: <HomeIcon />,
    page: "standard",
  },
  {
    section: "ADMIN",
    label: "Admin",
    icon: <ShieldIcon />,
    page: "admin",
  },
];

export default function Sidebar({ dark, open, activePage, setActivePage }) {
  const bg = dark ? "#1C2333" : "#fff";
  const border = dark ? "#2A3347" : "#E5E7EB";
  const logoText = dark ? "#fff" : "#111827";
  const itemColor = dark ? "#9CA3AF" : "#6B7280";
  const itemHoverBg = dark ? "#2A3347" : "#F3F4F6";
  const activeColor = "#3B4FE4";
  const activeBg = dark ? "rgba(59,79,228,0.15)" : "#EEF2FF";

  const sidebarWidth = open ? "240px" : "80px";

  return (
    <div
      style={{
        width: sidebarWidth,
        minWidth: sidebarWidth,
        height: "100vh",
        background: bg,
        borderRight: `1px solid ${border}`,
        overflowX: "hidden",
        overflowY: "auto",
        transition:
          "width 0.28s cubic-bezier(.4,0,.2,1), min-width 0.28s cubic-bezier(.4,0,.2,1)",
        display: "flex",
        flexDirection: "column",
        position: "sticky",
        top: 0,
        flexShrink: 0,
        zIndex: 30,
      }}
    >
      {/* Logo */}
      <div
        style={{
          padding: open ? "10px 20px" : "10px 0",
          display: "flex",
          alignItems: "center",
          justifyContent: open ? "flex-start" : "center",
          gap: "10px",
          whiteSpace: "nowrap",
          borderBottom: `1px solid ${border}`,
          flexShrink: 0,
          height: "44px",
        }}
      >
        <div
          style={{
            width: "36px",
            height: "36px",
            borderRadius: "10px",
            background: "#3B4FE4",
            display: "flex",
            alignItems: "center",
            justifyContent: "center", // Fixed: Added quotes
            flexShrink: 0,
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
          </svg>
        </div>
        {open && (
          <span
            style={{
              fontSize: "18px",
              fontWeight: "700",
              color: logoText,
              letterSpacing: "-0.3px",
            }}
          >
            FEE MANAGER///
          </span>
        )}
      </div>

      {/* Nav items */}
      <nav style={{ flex: 1, padding: "16px 0" }}>
        {NAV.map(({ section, label, icon, page }) => {
          const isActive = activePage === page;
          return (
            <div key={section} style={{ marginBottom: "4px" }}>
              <button
                onClick={() => setActivePage(page)}
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: open ? "flex-start" : "center",
                  gap: open ? "12px" : "0",
                  padding: open ? "12px 20px" : "12px 0",
                  background: isActive ? activeBg : "none",
                  border: "none",
                  borderLeft:
                    open && isActive
                      ? `3px solid ${activeColor}`
                      : "3px solid transparent",
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                  color: isActive ? activeColor : itemColor,
                  transition: "all 0.15s ease",
                  textAlign: "left",
                }}
                onMouseEnter={(e) => {
                  if (!isActive) e.currentTarget.style.background = itemHoverBg;
                }}
                onMouseLeave={(e) => {
                  if (!isActive) e.currentTarget.style.background = "none";
                }}
              >
                <span
                  style={{
                    color: isActive ? activeColor : itemColor,
                    display: "flex",
                    padding: !open && isActive ? "10px" : "0",
                    background: !open && isActive ? activeBg : "transparent",
                    borderRadius: "12px",
                  }}
                >
                  {icon}
                </span>

                {open && (
                  <span
                    style={{
                      fontSize: "14px",
                      fontWeight: isActive ? "600" : "500",
                    }}
                  >
                    {label}
                  </span>
                )}
              </button>
            </div>
          );
        })}
      </nav>
    </div>
  );
}
