/* eslint-disable no-unused-vars */
import { useState, useEffect, useCallback } from "react";

const BASE_URL = "https://fees-management-umber.vercel.app";

// ─── Icons ────────────────────────────────────────────────────────────────────
const FilterIcon = () => (
  <svg
    width="16"
    height="16"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3 4h18M7 10h10M11 16h2"
    />
  </svg>
);
const PlusIcon = () => (
  <svg
    width="16"
    height="16"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    viewBox="0 0 24 24"
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
  </svg>
);
const ReloadIcon = ({ spinning }) => (
  <svg
    width="15"
    height="15"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.2"
    viewBox="0 0 24 24"
    style={{ animation: spinning ? "spin 0.8s linear infinite" : "none" }}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M4.5 12a7.5 7.5 0 0113.5-4.5M19.5 12a7.5 7.5 0 01-13.5 4.5M4.5 7.5V3m0 4.5H9"
    />
  </svg>
);
const EditIcon = () => (
  <svg
    width="15"
    height="15"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M16.862 3.487a2.25 2.25 0 013.182 3.182L7.5 19.213l-4.5 1.5 1.5-4.5 12.362-12.226z"
    />
  </svg>
);
const TrashIcon = () => (
  <svg
    width="15"
    height="15"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M9 7V4h6v3M3 7h18"
    />
  </svg>
);
const CloseIcon = () => (
  <svg
    width="18"
    height="18"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M6 18L18 6M6 6l12 12"
    />
  </svg>
);
const ChevronIcon = ({ open }) => (
  <svg
    width="14"
    height="14"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    viewBox="0 0 24 24"
    style={{
      transform: open ? "rotate(180deg)" : "rotate(0deg)",
      transition: "transform 0.2s",
    }}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
  </svg>
);
const PhoneIcon = () => (
  <svg
    width="14"
    height="14"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"
    />
  </svg>
);

// ─── Avatar colors ────────────────────────────────────────────────────────────
const AVATAR_COLORS = [
  "#FECACA",
  "#FED7AA",
  "#FEF08A",
  "#BBF7D0",
  "#BAE6FD",
  "#DDD6FE",
  "#FBCFE8",
];
const TEXT_COLORS = [
  "#DC2626",
  "#EA580C",
  "#CA8A04",
  "#16A34A",
  "#0284C7",
  "#7C3AED",
  "#DB2777",
];
const avatarColors = (str) => {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = str.charCodeAt(i) + ((h << 5) - h);
  const idx = Math.abs(h) % AVATAR_COLORS.length;
  return { bg: AVATAR_COLORS[idx], text: TEXT_COLORS[idx] };
};

// ─── Role badge ───────────────────────────────────────────────────────────────
const ROLE_STYLES = {
  collector: { bg: "#DCFCE7", text: "#15803D" },
  manager: { bg: "#DBEAFE", text: "#1D4ED8" },
  admin: { bg: "#EDE9FE", text: "#6D28D9" },
};
const RoleBadge = ({ role }) => {
  const s = ROLE_STYLES[role?.toLowerCase()] || {
    bg: "#F3F4F6",
    text: "#374151",
  };
  return (
    <span
      style={{
        fontSize: "12px",
        fontWeight: 600,
        padding: "3px 10px",
        borderRadius: "20px",
        background: s.bg,
        color: s.text,
        textTransform: "capitalize",
      }}
    >
      {role}
    </span>
  );
};

// ─── Modal ────────────────────────────────────────────────────────────────────
function Modal({ title, onClose, children, dark }) {
  const bg = dark ? "#1C2333" : "#fff";
  const border = dark ? "#2A3347" : "#E5E7EB";
  const text = dark ? "#F9FAFB" : "#111827";
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 200,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(0,0,0,0.45)",
        padding: "16px",
      }}
    >
      <div
        style={{
          background: bg,
          border: `1px solid ${border}`,
          borderRadius: "12px",
          width: "100%",
          maxWidth: "440px",
          boxShadow: "0 16px 48px rgba(0,0,0,0.18)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "18px 20px",
            borderBottom: `1px solid ${border}`,
          }}
        >
          <span style={{ fontSize: "16px", fontWeight: 600, color: text }}>
            {title}
          </span>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: dark ? "#9CA3AF" : "#6B7280",
              display: "flex",
            }}
          >
            <CloseIcon />
          </button>
        </div>
        <div style={{ padding: "20px" }}>{children}</div>
      </div>
    </div>
  );
}

// ─── Filter select ────────────────────────────────────────────────────────────
function FilterSelect({ label, value, onChange, options, dark }) {
  const bg = dark ? "#1C2333" : "#fff";
  const border = dark ? "#2A3347" : "#E2E8F0";
  const text = dark ? "#F9FAFB" : "#111827";
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "4px",
        minWidth: "130px",
      }}
    >
      <label
        style={{
          fontSize: "11px",
          fontWeight: 500,
          color: dark ? "#9CA3AF" : "#6B7280",
          textTransform: "uppercase",
          letterSpacing: "0.05em",
        }}
      >
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          padding: "8px 12px",
          fontSize: "13px",
          border: `1px solid ${border}`,
          borderRadius: "8px",
          background: bg,
          color: text,
          outline: "none",
          cursor: "pointer",
        }}
      >
        <option value="">All</option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </div>
  );
}

// ─── Form field — defined OUTSIDE to prevent cursor-jump bug ─────────────────
function FormField({
  label,
  name,
  value,
  onChange,
  placeholder,
  dark,
  type = "text",
}) {
  const border = dark ? "#2A3347" : "#E2E8F0";
  const bg = dark ? "#111827" : "#F9FAFB";
  const text = dark ? "#F9FAFB" : "#1C2434";
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
      <label
        style={{
          fontSize: "13px",
          fontWeight: 500,
          color: dark ? "#D1D5DB" : "#1C2434",
        }}
      >
        {label}
      </label>
      <input
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        style={{
          padding: "10px 14px",
          fontSize: "14px",
          border: `1px solid ${border}`,
          borderRadius: "8px",
          background: bg,
          color: text,
          outline: "none",
          boxSizing: "border-box",
          width: "100%",
        }}
        onFocus={(e) => (e.target.style.borderColor = "#3C50E0")}
        onBlur={(e) => (e.target.style.borderColor = border)}
      />
    </div>
  );
}

// ─── Form select — also outside ───────────────────────────────────────────────
function FormSelect({ label, name, value, onChange, options, dark }) {
  const border = dark ? "#2A3347" : "#E2E8F0";
  const bg = dark ? "#111827" : "#F9FAFB";
  const text = dark ? "#F9FAFB" : "#1C2434";
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
      <label
        style={{
          fontSize: "13px",
          fontWeight: 500,
          color: dark ? "#D1D5DB" : "#1C2434",
        }}
      >
        {label}
      </label>
      <select
        name={name}
        value={value}
        onChange={onChange}
        style={{
          padding: "10px 14px",
          fontSize: "14px",
          border: `1px solid ${border}`,
          borderRadius: "8px",
          background: bg,
          color: text,
          outline: "none",
          boxSizing: "border-box",
          width: "100%",
          cursor: "pointer",
        }}
        onFocus={(e) => (e.target.style.borderColor = "#3C50E0")}
        onBlur={(e) => (e.target.style.borderColor = border)}
      >
        <option value="">Select role</option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </div>
  );
}

// ─── Form content — outside to prevent remount on keystroke ──────────────────
function FormContent({
  form,
  onFormChange,
  onSubmit,
  submitLabel,
  submitting,
  dark,
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <FormField
        label="Full Name"
        name="name"
        value={form.name}
        onChange={onFormChange}
        placeholder="e.g. Rahul Patil"
        dark={dark}
      />
      <FormField
        label="Mobile Number"
        name="mobile"
        value={form.mobile}
        onChange={onFormChange}
        placeholder="e.g. 9876543210"
        type="tel"
        dark={dark}
      />
      <FormSelect
        label="Role"
        name="role"
        value={form.role}
        onChange={onFormChange}
        options={["collector", "manager", "admin"]}
        dark={dark}
      />
      <button
        onClick={onSubmit}
        disabled={submitting}
        style={{
          padding: "10px",
          fontSize: "14px",
          fontWeight: 600,
          border: "none",
          borderRadius: "8px",
          background: submitting ? "#7B8FE8" : "#3C50E0",
          color: "#fff",
          cursor: submitting ? "not-allowed" : "pointer",
          marginTop: "4px",
        }}
      >
        {submitting ? "Saving..." : submitLabel}
      </button>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function AdminPage({ dark }) {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reloading, setReloading] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [editRow, setEditRow] = useState(null);
  const [filterRole, setFilterRole] = useState("");
  const [filterYear, setFilterYear] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [form, setForm] = useState({ name: "", mobile: "", role: "" });
  const [submitting, setSubmitting] = useState(false);

  const sheetUrl = localStorage.getItem("sheet_url") || "";

  // theme
  const bg = dark ? "#1C2333" : "#fff";
  const pageBg = dark ? "#111827" : "#F1F5F9";
  const border = dark ? "#2A3347" : "#E5E7EB";
  const textMain = dark ? "#F9FAFB" : "#111827";
  const textMuted = dark ? "#9CA3AF" : "#6B7280";
  const rowHover = dark ? "#1e2a40" : "#F9FAFB";
  const headBg = dark ? "#161e2e" : "#F9FAFB";

  // ── fetch ──────────────────────────────────────────────────────────────────
  const fetchAdmins = useCallback(
    async (showSpinner = false) => {
      if (!sheetUrl) {
        setLoading(false);
        return;
      }
      if (showSpinner) setReloading(true);
      else setLoading(true);
      try {
        const res = await fetch(
          `${BASE_URL}/api/admins?sheet_url=${encodeURIComponent(sheetUrl)}`,
        );
        const data = await res.json();
        setAdmins(data.admins || []);
      } catch (err) {
        console.error("Failed to fetch admins:", err);
        setAdmins([]);
      } finally {
        setLoading(false);
        setReloading(false);
      }
    },
    [sheetUrl],
  );

  useEffect(() => {
    fetchAdmins();
  }, [fetchAdmins]);

  // derived filter options
  const allRoles = [...new Set(admins.map((a) => a.role))]
    .filter(Boolean)
    .sort();
  const allYears = [...new Set(admins.map((a) => a.created_at?.slice(0, 4)))]
    .filter(Boolean)
    .sort();

  const filtered = admins.filter((a) => {
    const yr = a.created_at?.slice(0, 4);
    return (
      (!filterRole || a.role === filterRole) &&
      (!filterYear || yr === filterYear)
    );
  });

  const handleFormChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  // ── create ──
  const handleCreate = async () => {
    if (!form.name.trim() || !form.mobile.trim() || !form.role) {
      alert("All fields required");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch(`${BASE_URL}/api/admins`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sheet_url: sheetUrl,
          name: form.name,
          mobile: form.mobile,
          role: form.role,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        alert(data.message || "Admin created");
        setShowCreate(false);
        setForm({ name: "", mobile: "", role: "" });
        fetchAdmins();
      } else alert(data.message || "Error");
    } catch {
      alert("Server error");
    } finally {
      setSubmitting(false);
    }
  };

  // ── edit ──
  const openEdit = (row) => {
    setEditRow(row);
    setForm({ name: row.name, mobile: String(row.mobile), role: row.role });
    setShowEdit(true);
  };
  const handleEdit = async () => {
    if (!form.name.trim() || !form.mobile.trim() || !form.role) {
      alert("All fields required");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch(`${BASE_URL}/api/admins/${editRow.admin_id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sheet_url: sheetUrl,
          name: form.name,
          mobile: form.mobile,
          role: form.role,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        alert(data.message || "Updated");
        setShowEdit(false);
        fetchAdmins();
      } else alert(data.message || "Error");
    } catch {
      alert("Server error");
    } finally {
      setSubmitting(false);
    }
  };

  // ── delete ──
  const handleDelete = async (row) => {
    if (!window.confirm(`Delete admin "${row.name}"?`)) return;
    try {
      const res = await fetch(`${BASE_URL}/api/admins/${row.admin_id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sheet_url: sheetUrl }),
      });
      const data = await res.json();
      if (res.ok) {
        alert(data.message || "Deleted");
        fetchAdmins();
      } else alert(data.message || "Error");
    } catch {
      alert("Server error");
    }
  };

  return (
    <>
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>

      <div style={{ padding: "24px", background: pageBg }}>
        <div
          style={{
            background: bg,
            border: `1px solid ${border}`,
            borderRadius: "12px",
            overflow: "hidden",
            boxShadow: "0 2px 10px rgba(0,0,0,0.06)",
          }}
        >
          {/* ── Header ── */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "20px 24px",
              flexWrap: "wrap",
              gap: "12px",
            }}
          >
            <h2
              style={{
                fontSize: "18px",
                fontWeight: 700,
                color: textMain,
                margin: 0,
              }}
            >
              Admins
            </h2>
            <div
              style={{
                display: "flex",
                gap: "10px",
                flexWrap: "wrap",
                alignItems: "center",
              }}
            >
              {/* Reload */}
              <button
                onClick={() => fetchAdmins(true)}
                disabled={reloading}
                title="Reload"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "9px 14px",
                  fontSize: "14px",
                  fontWeight: 500,
                  border: `1px solid ${border}`,
                  borderRadius: "8px",
                  background: bg,
                  color: textMain,
                  cursor: reloading ? "not-allowed" : "pointer",
                }}
              >
                <ReloadIcon spinning={reloading} />
                {reloading ? "Reloading…" : "Reload"}
              </button>

              {/* Filter */}
              <button
                onClick={() => setShowFilters((p) => !p)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "7px",
                  padding: "9px 18px",
                  fontSize: "14px",
                  fontWeight: 500,
                  border: `1px solid ${border}`,
                  borderRadius: "8px",
                  background: bg,
                  color: textMain,
                  cursor: "pointer",
                }}
              >
                <FilterIcon /> Filter <ChevronIcon open={showFilters} />
              </button>

              {/* Create Admin */}
              <button
                onClick={() => {
                  setForm({ name: "", mobile: "", role: "" });
                  setShowCreate(true);
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "7px",
                  padding: "9px 18px",
                  fontSize: "14px",
                  fontWeight: 600,
                  border: "none",
                  borderRadius: "8px",
                  background: "#3C50E0",
                  color: "#fff",
                  cursor: "pointer",
                }}
              >
                <PlusIcon /> Create Admin
              </button>
            </div>
          </div>

          {/* ── Filter bar ── */}
          {showFilters && (
            <div
              style={{
                padding: "0 24px 20px",
                display: "flex",
                gap: "16px",
                flexWrap: "wrap",
                borderBottom: `1px solid ${border}`,
              }}
            >
              <FilterSelect
                label="Role"
                value={filterRole}
                onChange={setFilterRole}
                options={allRoles}
                dark={dark}
              />
              <FilterSelect
                label="Year"
                value={filterYear}
                onChange={setFilterYear}
                options={allYears}
                dark={dark}
              />
              {(filterRole || filterYear) && (
                <div style={{ display: "flex", alignItems: "flex-end" }}>
                  <button
                    onClick={() => {
                      setFilterRole("");
                      setFilterYear("");
                    }}
                    style={{
                      padding: "8px 14px",
                      fontSize: "13px",
                      border: `1px solid ${border}`,
                      borderRadius: "8px",
                      background: bg,
                      color: "#EF4444",
                      cursor: "pointer",
                      fontWeight: 500,
                    }}
                  >
                    Clear
                  </button>
                </div>
              )}
            </div>
          )}

          <div style={{ height: "1px", background: border }} />

          {/* ── Table ── */}
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: headBg }}>
                  {["Name", "Mobile", "Role", "Year", "Action"].map((h) => (
                    <th
                      key={h}
                      style={{
                        padding: "14px 20px",
                        fontSize: "15px",
                        fontWeight: 700,
                        color: textMain,
                        textAlign: "center",
                        whiteSpace: "nowrap",
                        borderBottom: `1px solid ${border}`,
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td
                      colSpan={5}
                      style={{
                        padding: "48px",
                        textAlign: "center",
                        color: textMuted,
                        fontSize: "14px",
                      }}
                    >
                      Loading admins…
                    </td>
                  </tr>
                ) : !sheetUrl ? (
                  <tr>
                    <td
                      colSpan={5}
                      style={{
                        padding: "48px",
                        textAlign: "center",
                        color: "#F97316",
                        fontSize: "14px",
                      }}
                    >
                      ⚠️ No Sheet URL linked. Please add one from the top
                      navbar.
                    </td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      style={{
                        padding: "48px",
                        textAlign: "center",
                        color: textMuted,
                        fontSize: "14px",
                      }}
                    >
                      No admins found.
                    </td>
                  </tr>
                ) : (
                  filtered.map((row) => {
                    const { bg: avBg, text: avText } = avatarColors(
                      row.admin_id,
                    );
                    const initials = row.name
                      .split(" ")
                      .map((w) => w[0])
                      .join("")
                      .slice(0, 2)
                      .toUpperCase();
                    const year = row.created_at?.slice(0, 4) || "—";
                    return (
                      <tr
                        key={row.admin_id}
                        style={{
                          borderBottom: `1px solid ${border}`,
                          transition: "background 0.15s",
                        }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.background = rowHover)
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.background = "transparent")
                        }
                      >
                        {/* Name */}
                        <td style={{ padding: "16px 20px" }}>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "12px",
                            }}
                          >
                            <div
                              style={{
                                width: "36px",
                                height: "36px",
                                borderRadius: "50%",
                                background: avBg,
                                color: avText,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: "13px",
                                fontWeight: 700,
                                flexShrink: 0,
                              }}
                            >
                              {initials}
                            </div>
                            <span
                              style={{
                                fontSize: "14px",
                                fontWeight: 600,
                                color: textMain,
                              }}
                            >
                              {row.name}
                            </span>
                          </div>
                        </td>

                        {/* Mobile */}
                        <td
                          style={{ padding: "16px 20px", textAlign: "center" }}
                        >
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              gap: "6px",
                              fontSize: "14px",
                              color: textMuted,
                            }}
                          >
                            <PhoneIcon /> {row.mobile}
                          </div>
                        </td>

                        {/* Role */}
                        <td
                          style={{ padding: "16px 20px", textAlign: "center" }}
                        >
                          <RoleBadge role={row.role} />
                        </td>

                        {/* Year */}
                        <td
                          style={{
                            padding: "16px 20px",
                            fontSize: "14px",
                            color: textMuted,
                            textAlign: "center",
                          }}
                        >
                          {year}
                        </td>

                        {/* Action */}
                        <td style={{ padding: "16px 20px" }}>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              gap: "8px",
                            }}
                          >
                            <button
                              onClick={() => openEdit(row)}
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "5px",
                                padding: "6px 12px",
                                fontSize: "12px",
                                fontWeight: 500,
                                border: `1px solid ${border}`,
                                borderRadius: "6px",
                                background: bg,
                                color: "#3C50E0",
                                cursor: "pointer",
                              }}
                              onMouseEnter={(e) =>
                                (e.currentTarget.style.background = dark
                                  ? "#2A3347"
                                  : "#EEF2FF")
                              }
                              onMouseLeave={(e) =>
                                (e.currentTarget.style.background = bg)
                              }
                            >
                              <EditIcon /> Edit
                            </button>
                            <button
                              onClick={() => handleDelete(row)}
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "5px",
                                padding: "6px 12px",
                                fontSize: "12px",
                                fontWeight: 500,
                                border: "1px solid #FCA5A5",
                                borderRadius: "6px",
                                background: bg,
                                color: "#EF4444",
                                cursor: "pointer",
                              }}
                              onMouseEnter={(e) =>
                                (e.currentTarget.style.background = dark
                                  ? "#2A3347"
                                  : "#FEF2F2")
                              }
                              onMouseLeave={(e) =>
                                (e.currentTarget.style.background = bg)
                              }
                            >
                              <TrashIcon /> Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Row count */}
          {!loading && filtered.length > 0 && (
            <div
              style={{
                padding: "12px 24px",
                borderTop: `1px solid ${border}`,
                fontSize: "13px",
                color: textMuted,
              }}
            >
              Showing {filtered.length} of {admins.length} admin
              {admins.length !== 1 ? "s" : ""}
            </div>
          )}
        </div>

        {/* ── Create Modal ── */}
        {showCreate && (
          <Modal
            title="Create Admin"
            onClose={() => setShowCreate(false)}
            dark={dark}
          >
            <FormContent
              form={form}
              onFormChange={handleFormChange}
              onSubmit={handleCreate}
              submitLabel="Create Admin"
              submitting={submitting}
              dark={dark}
            />
          </Modal>
        )}

        {/* ── Edit Modal ── */}
        {showEdit && (
          <Modal
            title={`Edit — ${editRow?.name}`}
            onClose={() => setShowEdit(false)}
            dark={dark}
          >
            <FormContent
              form={form}
              onFormChange={handleFormChange}
              onSubmit={handleEdit}
              submitLabel="Save Changes"
              submitting={submitting}
              dark={dark}
            />
          </Modal>
        )}
      </div>
    </>
  );
}
