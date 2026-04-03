/* eslint-disable no-unused-vars */
import { useState, useEffect, useCallback } from "react";

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

// ─── Form field ───────────────────────────────────────────────────────────────
// Defined OUTSIDE the main component so React never remounts it on re-render,
// which was the cause of the cursor-jumping bug.
function FormField({ label, name, value, onChange, placeholder, dark }) {
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

// ─── Form content ─────────────────────────────────────────────────────────────
// Also outside — same reason. Receives all state as props instead of closing
// over parent state, which prevents remount on every keystroke.
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
        label="Standard"
        name="standard"
        value={form.standard}
        onChange={onFormChange}
        placeholder="e.g. 10th"
        dark={dark}
      />
      <FormField
        label="Batch"
        name="batch"
        value={form.batch}
        onChange={onFormChange}
        placeholder="e.g. 2026-27"
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
export default function StandardPage({ dark }) {
  const [standards, setStandards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [editRow, setEditRow] = useState(null);
  const [filterStd, setFilterStd] = useState("");
  const [filterBatch, setFilterBatch] = useState("");
  const [filterYear, setFilterYear] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [form, setForm] = useState({ standard: "", batch: "" });
  const [submitting, setSubmitting] = useState(false);
  const [reloading, setReloading] = useState(false);

  const sheetUrl = localStorage.getItem("sheet_url") || "";

  // theme
  const bg = dark ? "#1C2333" : "#fff";
  const pageBg = dark ? "#111827" : "#F1F5F9";
  const border = dark ? "#2A3347" : "#E5E7EB";
  const textMain = dark ? "#F9FAFB" : "#111827";
  const textMuted = dark ? "#9CA3AF" : "#6B7280";
  const rowHover = dark ? "#1e2a40" : "#F9FAFB";
  const headBg = dark ? "#161e2e" : "#F9FAFB";

  const fetchStandards = useCallback(
    async (showSpinner = false) => {
      if (!sheetUrl) {
        setLoading(false);
        return;
      }
      if (showSpinner) setReloading(true);
      else setLoading(true);
      try {
        const res = await fetch(
          `https://fees-management-umber.vercel.app/api/standards?sheet_url=${encodeURIComponent(sheetUrl)}`,
        );
        const data = await res.json();
        setStandards(data.standards || []);
      } catch (err) {
        console.error("Failed to fetch standards:", err);
        setStandards([]);
      } finally {
        setLoading(false);
        setReloading(false);
      }
    },
    [sheetUrl],
  );

  useEffect(() => {
    fetchStandards();
  }, [fetchStandards]);

  // derived filter options
  const allStds = [...new Set(standards.map((s) => s.standard))].sort();
  const allBatches = [...new Set(standards.map((s) => s.batch))].sort();
  const allYears = [...new Set(standards.map((s) => s.created_at?.slice(0, 4)))]
    .filter(Boolean)
    .sort();

  const filtered = standards.filter((s) => {
    const yr = s.created_at?.slice(0, 4);
    return (
      (!filterStd || s.standard === filterStd) &&
      (!filterBatch || s.batch === filterBatch) &&
      (!filterYear || yr === filterYear)
    );
  });

  const handleFormChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  // create
  const handleCreate = async () => {
    if (!form.standard.trim() || !form.batch.trim()) {
      alert("All fields required");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch(
        "https://fees-management-umber.vercel.app/api/standards",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sheet_url: sheetUrl,
            standard: form.standard,
            batch: form.batch,
          }),
        },
      );
      const data = await res.json();
      if (res.ok) {
        alert(data.message || "Created");
        setShowCreate(false);
        setForm({ standard: "", batch: "" });
        fetchStandards();
      } else alert(data.message || "Error");
    } catch {
      alert("Server error");
    } finally {
      setSubmitting(false);
    }
  };

  // edit
  const openEdit = (row) => {
    setEditRow(row);
    setForm({ standard: row.standard, batch: row.batch });
    setShowEdit(true);
  };
  const handleEdit = async () => {
    if (!form.standard.trim() || !form.batch.trim()) {
      alert("All fields required");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch(
        `https://fees-management-umber.vercel.app/api/standards/${editRow.standard_id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sheet_url: sheetUrl,
            standard: form.standard,
            batch: form.batch,
          }),
        },
      );
      const data = await res.json();
      if (res.ok) {
        alert(data.message || "Updated");
        setShowEdit(false);
        fetchStandards();
      } else alert(data.message || "Error");
    } catch {
      alert("Server error");
    } finally {
      setSubmitting(false);
    }
  };

  // delete
  const handleDelete = async (row) => {
    if (!window.confirm(`Delete standard "${row.standard_id}"?`)) return;

    try {
      const res = await fetch(
        `https://fees-management-umber.vercel.app/api/standards/${row.standard_id}?sheet_url=${encodeURIComponent(sheetUrl)}`,
        {
          method: "DELETE",
        },
      );

      const data = await res.json();

      if (res.ok) {
        alert(data.message || "Deleted");
        fetchStandards();
      } else {
        alert(data.error || "Error");
      }
    } catch (err) {
      alert("Server error");
    }
  };


  return (
    <>
      {/* spin keyframe */}
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
          {/* Header */}
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
              Standards
            </h2>
            <div
              style={{
                display: "flex",
                gap: "10px",
                flexWrap: "wrap",
                alignItems: "center",
              }}
            >
              {/* Reload button */}
              <button
                onClick={() => fetchStandards(true)}
                disabled={reloading}
                title="Reload"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
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

              {/* Filter toggle */}
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

              {/* Create */}
              <button
                onClick={() => {
                  setForm({ standard: "", batch: "" });
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
                <PlusIcon /> Create Standard
              </button>
            </div>
          </div>

          {/* Filter bar */}
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
                label="Standard"
                value={filterStd}
                onChange={setFilterStd}
                options={allStds}
                dark={dark}
              />
              <FilterSelect
                label="Batch"
                value={filterBatch}
                onChange={setFilterBatch}
                options={allBatches}
                dark={dark}
              />
              <FilterSelect
                label="Year"
                value={filterYear}
                onChange={setFilterYear}
                options={allYears}
                dark={dark}
              />
              {(filterStd || filterBatch || filterYear) && (
                <div style={{ display: "flex", alignItems: "flex-end" }}>
                  <button
                    onClick={() => {
                      setFilterStd("");
                      setFilterBatch("");
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

          {/* Table */}
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: headBg }}>
                  {["Standard", "Batch", "Year", "Action"].map((h) => (
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
                      colSpan={4}
                      style={{
                        padding: "48px",
                        textAlign: "center",
                        color: textMuted,
                        fontSize: "14px",
                      }}
                    >
                      Loading standards…
                    </td>
                  </tr>
                ) : !sheetUrl ? (
                  <tr>
                    <td
                      colSpan={4}
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
                      colSpan={4}
                      style={{
                        padding: "48px",
                        textAlign: "center",
                        color: textMuted,
                        fontSize: "14px",
                      }}
                    >
                      No standards found.
                    </td>
                  </tr>
                ) : (
                  filtered.map((row) => {
                    const { bg: avBg, text: avText } = avatarColors(
                      row.standard_id,
                    );
                    const year = row.created_at?.slice(0, 4) || "—";
                    return (
                      <tr
                        key={row.standard_id}
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
                              {row.standard.slice(0, 2).toUpperCase()}
                            </div>
                            <span
                              style={{
                                fontSize: "14px",
                                fontWeight: 600,
                                color: textMain,
                              }}
                            >
                              {row.standard}
                            </span>
                          </div>
                        </td>
                        <td
                          style={{
                            padding: "16px 20px",
                            fontSize: "14px",
                            color: textMain,
                            textAlign: "center",
                          }}
                        >
                          {row.batch}
                        </td>
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

          {!loading && filtered.length > 0 && (
            <div
              style={{
                padding: "12px 24px",
                borderTop: `1px solid ${border}`,
                fontSize: "13px",
                color: textMuted,
              }}
            >
              Showing {filtered.length} of {standards.length} standard
              {standards.length !== 1 ? "s" : ""}
            </div>
          )}
        </div>

        {/* Create Modal */}
        {showCreate && (
          <Modal
            title="Create Standard"
            onClose={() => setShowCreate(false)}
            dark={dark}
          >
            <FormContent
              form={form}
              onFormChange={handleFormChange}
              onSubmit={handleCreate}
              submitLabel="Create Standard"
              submitting={submitting}
              dark={dark}
            />
          </Modal>
        )}

        {/* Edit Modal */}
        {showEdit && (
          <Modal
            title={`Edit — ${editRow?.standard_id}`}
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
