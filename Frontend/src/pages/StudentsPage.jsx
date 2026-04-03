/* eslint-disable no-unused-vars */
import { useState, useEffect, useCallback } from "react";
import StudentSidePanel from "../components/Studentsidepanel";

const BASE_URL = "https://fees-management-umber.vercel.app";

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
const avatarColors = (str = "") => {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = str.charCodeAt(i) + ((h << 5) - h);
  const idx = Math.abs(h) % AVATAR_COLORS.length;
  return { bg: AVATAR_COLORS[idx], text: TEXT_COLORS[idx] };
};

function FilterIcon() {
  return (
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
}
function PlusIcon() {
  return (
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
}
function ReloadIcon({ spinning }) {
  return (
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
}
function CloseIcon() {
  return (
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
}
function ChevronIcon({ open }) {
  return (
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
}
function PhoneIcon() {
  return (
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
}

// ─── Balance badge — reads from balanceMap if available, falls back to row.balance ──
function BalanceBadge({ balance }) {
  // balance here is already the resolved number passed in
  const due = balance !== null && balance !== undefined && Number(balance) > 0;
  return (
    <span
      style={{
        fontSize: "12px",
        fontWeight: 600,
        padding: "3px 10px",
        borderRadius: "20px",
        background: due ? "#FEE2E2" : "#DCFCE7",
        color: due ? "#DC2626" : "#15803D",
      }}
    >
      {due ? `₹${Number(balance).toLocaleString()} due` : "Paid"}
    </span>
  );
}

function FilterSelect({ label, value, onChange, options, dark }) {
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
          border: `1px solid ${dark ? "#2A3347" : "#E2E8F0"}`,
          borderRadius: "8px",
          background: dark ? "#1C2333" : "#fff",
          color: dark ? "#F9FAFB" : "#111827",
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
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
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
          background: dark ? "#111827" : "#F9FAFB",
          color: dark ? "#F9FAFB" : "#1C2434",
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

function FormSelect({
  label,
  name,
  value,
  onChange,
  options,
  placeholder,
  dark,
}) {
  const border = dark ? "#2A3347" : "#E2E8F0";
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
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
          background: dark ? "#111827" : "#F9FAFB",
          color: dark ? "#F9FAFB" : "#1C2434",
          outline: "none",
          boxSizing: "border-box",
          width: "100%",
          cursor: "pointer",
        }}
        onFocus={(e) => (e.target.style.borderColor = "#3C50E0")}
        onBlur={(e) => (e.target.style.borderColor = border)}
      >
        <option value="">{placeholder || "Select…"}</option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}

function CreateModal({ admins, sheetUrl, dark, onClose, onAdmissionCreated }) {
  const [form, setForm] = useState({
    student_name: "",
    mobile: "",
    standard_id: "",
    fees_total: "",
    amount_paid: "",
    received_by: "",
  });
  const [saving, setSaving] = useState(false);

  const bg = dark ? "#1C2333" : "#fff";
  const border = dark ? "#2A3347" : "#E5E7EB";
  const text = dark ? "#F9FAFB" : "#111827";

  const handleChange = (e) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const submit = async () => {
    const {
      student_name,
      mobile,
      standard_id,
      fees_total,
      amount_paid,
      received_by,
    } = form;
    if (
      !student_name ||
      !mobile ||
      !standard_id ||
      !fees_total ||
      !amount_paid ||
      !received_by
    ) {
      alert("All fields are required");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch(`${BASE_URL}/api/full-admission`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sheet_url: sheetUrl,
          student_name,
          mobile,
          standard_id,
          fees_total: Number(fees_total),
          amount_paid: Number(amount_paid),
          received_by,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        // Balance for a new admission = total_fees - amount_paid
        const initialBalance = Number(fees_total) - Number(amount_paid);
        onAdmissionCreated(
          {
            admission_id: data.admission_id,
            student_id: data.student_id,
            student_name,
            mobile,
            standard_id,
            standard: standard_id.split("_")[0],
            batch: standard_id.split("_")[1] || "",
            total_fees: Number(fees_total),
            created_at: new Date().toISOString(),
          },
          initialBalance,
        );
        onClose();
      } else alert(data.message || "Error");
    } catch {
      alert("Server error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 7000,
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
          maxWidth: "480px",
          boxShadow: "0 16px 48px rgba(0,0,0,0.2)",
          maxHeight: "90vh",
          overflowY: "auto",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "18px 20px",
            borderBottom: `1px solid ${border}`,
            position: "sticky",
            top: 0,
            background: bg,
          }}
        >
          <span style={{ fontSize: "16px", fontWeight: 600, color: text }}>
            New Admission
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
        <div
          style={{
            padding: "20px",
            display: "flex",
            flexDirection: "column",
            gap: "14px",
          }}
        >
          <FormField
            label="Student Name"
            name="student_name"
            value={form.student_name}
            onChange={handleChange}
            placeholder="e.g. Rahul Sharma"
            dark={dark}
          />
          <FormField
            label="Mobile Number"
            name="mobile"
            value={form.mobile}
            onChange={handleChange}
            placeholder="e.g. 9876543210"
            type="tel"
            dark={dark}
          />
          <FormField
            label="Standard ID"
            name="standard_id"
            value={form.standard_id}
            onChange={handleChange}
            placeholder="e.g. 8th_2024-25"
            dark={dark}
          />
          <FormField
            label="Total Fees (₹)"
            name="fees_total"
            value={form.fees_total}
            onChange={handleChange}
            placeholder="e.g. 20000"
            type="number"
            dark={dark}
          />
          <FormField
            label="Amount Paid (₹)"
            name="amount_paid"
            value={form.amount_paid}
            onChange={handleChange}
            placeholder="e.g. 5000"
            type="number"
            dark={dark}
          />
          <FormSelect
            label="Received By"
            name="received_by"
            value={form.received_by}
            onChange={handleChange}
            options={admins.map((a) => ({
              value: a.admin_id,
              label: `${a.name} (${a.role})`,
            }))}
            placeholder="Select admin"
            dark={dark}
          />
          <button
            onClick={submit}
            disabled={saving}
            style={{
              padding: "11px",
              fontSize: "14px",
              fontWeight: 600,
              border: "none",
              borderRadius: "8px",
              background: saving ? "#7B8FE8" : "#3C50E0",
              color: "#fff",
              cursor: saving ? "not-allowed" : "pointer",
              marginTop: "4px",
            }}
          >
            {saving ? "Creating…" : "Create Admission"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function StudentsPage({ dark }) {
  const [admissions, setAdmissions] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reloading, setReloading] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState("");
  const [filterStd, setFilterStd] = useState("");
  const [filterBatch, setFilterBatch] = useState("");
  const [filterBal, setFilterBal] = useState("");

  // ── balanceMap: { [admission_id]: number }
  // Populated when StudentSidePanel reports a calculated balance.
  // This is the single source of truth for the Balance column.
  const [balanceMap, setBalanceMap] = useState({});

  const sheetUrl = localStorage.getItem("sheet_url") || "";

  const bg = dark ? "#1C2333" : "#fff";
  const pageBg = dark ? "#111827" : "#F1F5F9";
  const border = dark ? "#2A3347" : "#E5E7EB";
  const textMain = dark ? "#F9FAFB" : "#111827";
  const textMuted = dark ? "#9CA3AF" : "#6B7280";
  const headBg = dark ? "#161e2e" : "#F9FAFB";
  const rowHover = dark ? "#1e2a40" : "#F9FAFB";

  const fetchAdmissions = useCallback(
    async (spinner = false) => {
      if (!sheetUrl) {
        setLoading(false);
        return;
      }
      spinner ? setReloading(true) : setLoading(true);
      try {
        const res = await fetch(
          `${BASE_URL}/api/admissions?sheet_url=${encodeURIComponent(sheetUrl)}`,
        );
        const data = await res.json();
        setAdmissions(data.data || []);
        // Clear balanceMap on reload so fresh installment data is used
        setBalanceMap({});
      } catch {
        setAdmissions([]);
      } finally {
        setLoading(false);
        setReloading(false);
      }
    },
    [sheetUrl],
  );

  const fetchAdmins = useCallback(async () => {
    if (!sheetUrl) return;
    try {
      const res = await fetch(
        `${BASE_URL}/api/admins?sheet_url=${encodeURIComponent(sheetUrl)}`,
      );
      const data = await res.json();
      setAdmins(data.admins || []);
    } catch {
      setAdmins([]);
    }
  }, [sheetUrl]);

  useEffect(() => {
    fetchAdmissions();
    fetchAdmins();
  }, [fetchAdmissions, fetchAdmins]);

  // ── New admission: add to list; seed balanceMap with initial balance ──
  const handleAdmissionCreated = (newAdmission, initialBalance) => {
    setAdmissions((prev) => [newAdmission, ...prev]);
    setBalanceMap((prev) => ({
      ...prev,
      [newAdmission.admission_id]: initialBalance,
    }));
  };

  // ── Called by StudentSidePanel whenever it recalculates balance from installments ──
  // newBalance = totalFees - sum(installments)  (computed inside the panel)
  const handleInstallmentAdded = (admissionId, newBalance) => {
    setBalanceMap((prev) => ({ ...prev, [admissionId]: newBalance }));
  };

  // ── Resolve the display balance for a row ──
  // Priority: balanceMap (installment-derived) → row.balance (API fallback)
  const resolveBalance = (row) => {
    if (balanceMap[row.admission_id] !== undefined)
      return balanceMap[row.admission_id];
    return row.balance;
  };

  const allStandards = [...new Set(admissions.map((a) => a.standard))]
    .filter(Boolean)
    .sort();
  const allBatches = [...new Set(admissions.map((a) => a.batch))]
    .filter(Boolean)
    .sort();

  const filtered = admissions.filter((a) => {
    const q = search.toLowerCase();
    const bal = resolveBalance(a);
    return (
      (!q ||
        a.student_name?.toLowerCase().includes(q) ||
        String(a.mobile).includes(q) ||
        a.standard?.toLowerCase().includes(q)) &&
      (!filterStd || a.standard === filterStd) &&
      (!filterBatch || a.batch === filterBatch) &&
      (!filterBal ||
        (filterBal === "paid" &&
          (bal === "" || bal === null || Number(bal) === 0)) ||
        (filterBal === "pending" && Number(bal) > 0))
    );
  });

  const handleRowClick = (e, row) => {
    e.preventDefault();
    e.stopPropagation();
    setSelected((prev) =>
      prev?.admission_id === row.admission_id ? null : row,
    );
  };

  return (
    <>
      <style>{`@keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }`}</style>

      <div style={{ padding: "24px", background: pageBg, minHeight: "100%" }}>
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
            <div>
              <h2
                style={{
                  fontSize: "18px",
                  fontWeight: 700,
                  color: textMain,
                  margin: 0,
                }}
              >
                Students
              </h2>
              <p
                style={{
                  fontSize: "13px",
                  color: textMuted,
                  margin: "3px 0 0",
                }}
              >
                {admissions.length} total admission
                {admissions.length !== 1 ? "s" : ""}
              </p>
            </div>
            <div
              style={{
                display: "flex",
                gap: "10px",
                flexWrap: "wrap",
                alignItems: "center",
              }}
            >
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search name, mobile…"
                style={{
                  padding: "9px 14px",
                  fontSize: "13px",
                  border: `1px solid ${border}`,
                  borderRadius: "8px",
                  background: bg,
                  color: textMain,
                  outline: "none",
                  width: "190px",
                }}
                onFocus={(e) => (e.target.style.borderColor = "#3C50E0")}
                onBlur={(e) => (e.target.style.borderColor = border)}
              />
              <button
                onClick={() => fetchAdmissions(true)}
                disabled={reloading}
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
              <button
                onClick={() => setShowCreate(true)}
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
                <PlusIcon /> New Admission
              </button>
            </div>
          </div>

          {/* Filters */}
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
                options={allStandards}
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
                label="Balance"
                value={filterBal}
                onChange={setFilterBal}
                options={["paid", "pending"]}
                dark={dark}
              />
              {(filterStd || filterBatch || filterBal) && (
                <div style={{ display: "flex", alignItems: "flex-end" }}>
                  <button
                    onClick={() => {
                      setFilterStd("");
                      setFilterBatch("");
                      setFilterBal("");
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

          {/* Table */}
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: headBg }}>
                  {[
                    "Student Name",
                    "Mobile",
                    "Standard",
                    "Batch",
                    "Total Fees",
                    "Balance",
                  ].map((h) => (
                    <th
                      key={h}
                      style={{
                        padding: "13px 20px",
                        fontSize: "12px",
                        fontWeight: 700,
                        color: textMuted,
                        textAlign: h === "Student Name" ? "left" : "center",
                        whiteSpace: "nowrap",
                        borderBottom: `1px solid ${border}`,
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
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
                      colSpan={6}
                      style={{
                        padding: "48px",
                        textAlign: "center",
                        color: textMuted,
                        fontSize: "14px",
                      }}
                    >
                      Loading students…
                    </td>
                  </tr>
                ) : !sheetUrl ? (
                  <tr>
                    <td
                      colSpan={6}
                      style={{
                        padding: "48px",
                        textAlign: "center",
                        color: "#F97316",
                        fontSize: "14px",
                      }}
                    >
                      ⚠️ No Sheet URL linked.
                    </td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      style={{
                        padding: "48px",
                        textAlign: "center",
                        color: textMuted,
                        fontSize: "14px",
                      }}
                    >
                      No admissions found.
                    </td>
                  </tr>
                ) : (
                  filtered.map((row) => {
                    const { bg: avBg, text: avText } = avatarColors(
                      row.student_id,
                    );
                    const initials = row.student_name
                      ?.split(" ")
                      .map((w) => w[0])
                      .join("")
                      .slice(0, 2)
                      .toUpperCase();
                    const isSelected =
                      selected?.admission_id === row.admission_id;
                    const displayBalance = resolveBalance(row);
                    return (
                      <tr
                        key={row.admission_id}
                        onClick={(e) => handleRowClick(e, row)}
                        style={{
                          borderBottom: `1px solid ${border}`,
                          cursor: "pointer",
                          background: isSelected
                            ? dark
                              ? "#1e2a40"
                              : "#EEF2FF"
                            : "transparent",
                          transition: "background 0.15s",
                        }}
                        onMouseEnter={(e) => {
                          if (!isSelected)
                            e.currentTarget.style.background = rowHover;
                        }}
                        onMouseLeave={(e) => {
                          if (!isSelected)
                            e.currentTarget.style.background = "transparent";
                        }}
                      >
                        <td style={{ padding: "14px 20px" }}>
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
                            <div>
                              <p
                                style={{
                                  margin: 0,
                                  fontSize: "14px",
                                  fontWeight: 600,
                                  color: textMain,
                                }}
                              >
                                {row.student_name}
                              </p>
                              <p
                                style={{
                                  margin: "2px 0 0",
                                  fontSize: "11px",
                                  color: textMuted,
                                }}
                              >
                                ID: {row.admission_id?.slice(0, 8)}…
                              </p>
                            </div>
                          </div>
                        </td>
                        <td
                          style={{ padding: "14px 20px", textAlign: "center" }}
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
                            <PhoneIcon />
                            {row.mobile}
                          </div>
                        </td>
                        <td
                          style={{ padding: "14px 20px", textAlign: "center" }}
                        >
                          <span
                            style={{
                              fontSize: "13px",
                              fontWeight: 600,
                              padding: "3px 10px",
                              borderRadius: "20px",
                              background: dark ? "#1e2a40" : "#EEF2FF",
                              color: "#3C50E0",
                            }}
                          >
                            {row.standard}
                          </span>
                        </td>
                        <td
                          style={{
                            padding: "14px 20px",
                            textAlign: "center",
                            fontSize: "14px",
                            color: textMuted,
                          }}
                        >
                          {row.batch}
                        </td>
                        <td
                          style={{
                            padding: "14px 20px",
                            textAlign: "center",
                            fontSize: "14px",
                            fontWeight: 600,
                            color: textMain,
                          }}
                        >
                          ₹{Number(row.total_fees).toLocaleString()}
                        </td>
                        <td
                          style={{ padding: "14px 20px", textAlign: "center" }}
                        >
                          <BalanceBadge balance={displayBalance} />
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
              Showing {filtered.length} of {admissions.length} admission
              {admissions.length !== 1 ? "s" : ""}
            </div>
          )}
        </div>
      </div>

      {selected && (
        <StudentSidePanel
          student={selected}
          admins={admins}
          sheetUrl={sheetUrl}
          dark={dark}
          onClose={() => setSelected(null)}
          onInstallmentAdded={handleInstallmentAdded}
        />
      )}

      {showCreate && (
        <CreateModal
          admins={admins}
          sheetUrl={sheetUrl}
          dark={dark}
          onClose={() => setShowCreate(false)}
          onAdmissionCreated={handleAdmissionCreated}
        />
      )}
    </>
  );
}
