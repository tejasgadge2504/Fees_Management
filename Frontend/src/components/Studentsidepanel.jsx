/* eslint-disable no-unused-vars */
import { useState, useEffect, useCallback } from "react";
import ReactDOM from "react-dom";

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

const fmt = (d) => {
  if (!d) return "—";
  try {
    return new Date(d).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return d;
  }
};

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

function PlusIcon() {
  return (
    <svg
      width="14"
      height="14"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      viewBox="0 0 24 24"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
    </svg>
  );
}

function DetailRow({ label, value, dark }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "11px 0",
        borderBottom: `1px solid ${dark ? "#2A3347" : "#E5E7EB"}`,
      }}
    >
      <span style={{ fontSize: "13px", color: dark ? "#9CA3AF" : "#6B7280" }}>
        {label}
      </span>
      <span
        style={{
          fontSize: "13px",
          fontWeight: 600,
          color: dark ? "#F9FAFB" : "#111827",
          maxWidth: "200px",
          textAlign: "right",
          wordBreak: "break-all",
        }}
      >
        {value || "—"}
      </span>
    </div>
  );
}

// ─── Add Installment Modal ────────────────────────────────────────────────────
function AddInstallmentModal({
  student,
  admins,
  sheetUrl,
  dark,
  onClose,
  onInstallmentAdded,
  currentBalance,
}) {
  const [amount, setAmount] = useState("");
  const [receivedBy, setReceivedBy] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const bg = dark ? "#1C2333" : "#fff";
  const border = dark ? "#2A3347" : "#E5E7EB";
  const text = dark ? "#F9FAFB" : "#111827";
  const inputBg = dark ? "#111827" : "#F9FAFB";

  const isFullyPaid = currentBalance <= 0;

  const submit = async () => {
    setError("");
    if (!amount || !receivedBy) {
      setError("All fields are required.");
      return;
    }
    const amt = Number(amount);
    if (amt <= 0) {
      setError("Amount must be greater than 0.");
      return;
    }
    if (amt > currentBalance) {
      setError(
        `Amount cannot exceed balance of ₹${currentBalance.toLocaleString()}.`,
      );
      return;
    }

    setSaving(true);
    try {
      const res = await fetch(`${BASE_URL}/api/installments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sheet_url: sheetUrl,
          admission_id: student.admission_id,
          amount: amt,
          received_by: receivedBy,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        onInstallmentAdded(amt);
        onClose();
      } else {
        setError(data.message || "Something went wrong.");
      }
    } catch {
      setError("Server error. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return ReactDOM.createPortal(
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(0,0,0,0.5)",
        padding: "16px",
      }}
    >
      <div
        style={{
          background: bg,
          border: `1px solid ${border}`,
          borderRadius: "12px",
          width: "100%",
          maxWidth: "400px",
          boxShadow: "0 20px 60px rgba(0,0,0,0.25)",
        }}
      >
        {/* Header */}
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
            Add Installment
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
          {/* Student info chip */}
          <div
            style={{
              padding: "12px",
              borderRadius: "8px",
              background: dark ? "#111827" : "#F1F5F9",
            }}
          >
            <p
              style={{
                margin: 0,
                fontSize: "12px",
                color: dark ? "#9CA3AF" : "#6B7280",
              }}
            >
              Student
            </p>
            <p
              style={{
                margin: "4px 0 0",
                fontSize: "14px",
                fontWeight: 600,
                color: text,
              }}
            >
              {student.student_name}
            </p>
            <p
              style={{
                margin: "2px 0 0",
                fontSize: "12px",
                color: currentBalance <= 0 ? "#16A34A" : "#EF4444",
                fontWeight: 600,
              }}
            >
              {currentBalance <= 0
                ? "✓ Fully paid"
                : `Balance: ₹${currentBalance.toLocaleString()}`}
            </p>
          </div>

          {isFullyPaid ? (
            <div
              style={{
                padding: "14px",
                borderRadius: "8px",
                background: dark ? "#052e16" : "#DCFCE7",
                border: `1px solid ${dark ? "#16A34A" : "#86EFAC"}`,
                textAlign: "center",
              }}
            >
              <p
                style={{
                  margin: 0,
                  fontSize: "14px",
                  fontWeight: 600,
                  color: "#16A34A",
                }}
              >
                ✓ No more installments needed
              </p>
              <p
                style={{
                  margin: "6px 0 0",
                  fontSize: "13px",
                  color: dark ? "#4ADE80" : "#15803D",
                }}
              >
                This student has fully cleared their fees.
              </p>
            </div>
          ) : (
            <>
              <div
                style={{ display: "flex", flexDirection: "column", gap: "6px" }}
              >
                <label
                  style={{ fontSize: "13px", fontWeight: 500, color: text }}
                >
                  Amount (₹)
                </label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder={`Max ₹${currentBalance.toLocaleString()}`}
                  style={{
                    padding: "10px 14px",
                    fontSize: "14px",
                    border: `1px solid ${border}`,
                    borderRadius: "8px",
                    background: inputBg,
                    color: text,
                    outline: "none",
                    width: "100%",
                    boxSizing: "border-box",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "#3C50E0")}
                  onBlur={(e) => (e.target.style.borderColor = border)}
                />
              </div>

              <div
                style={{ display: "flex", flexDirection: "column", gap: "6px" }}
              >
                <label
                  style={{ fontSize: "13px", fontWeight: 500, color: text }}
                >
                  Received By
                </label>
                <select
                  value={receivedBy}
                  onChange={(e) => setReceivedBy(e.target.value)}
                  style={{
                    padding: "10px 14px",
                    fontSize: "14px",
                    border: `1px solid ${border}`,
                    borderRadius: "8px",
                    background: inputBg,
                    color: text,
                    outline: "none",
                    width: "100%",
                    boxSizing: "border-box",
                    cursor: "pointer",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "#3C50E0")}
                  onBlur={(e) => (e.target.style.borderColor = border)}
                >
                  <option value="">Select admin</option>
                  {admins.map((a) => (
                    <option key={a.admin_id} value={a.admin_id}>
                      {a.name} ({a.role})
                    </option>
                  ))}
                </select>
              </div>

              {error && (
                <div
                  style={{
                    padding: "10px 14px",
                    borderRadius: "8px",
                    background: dark ? "#450a0a" : "#FEF2F2",
                    border: `1px solid ${dark ? "#EF4444" : "#FCA5A5"}`,
                  }}
                >
                  <p
                    style={{
                      margin: 0,
                      fontSize: "13px",
                      color: "#EF4444",
                      fontWeight: 500,
                    }}
                  >
                    ⚠ {error}
                  </p>
                </div>
              )}

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
                }}
              >
                {saving ? "Saving…" : "Add Installment"}
              </button>
            </>
          )}
        </div>
      </div>
    </div>,
    document.body,
  );
}

// ─── Main Side Panel ──────────────────────────────────────────────────────────
export default function StudentSidePanel({
  student,
  admins,
  sheetUrl,
  dark,
  onClose,
  onInstallmentAdded,
}) {
  const [tab, setTab] = useState("overview");
  const [installments, setInstallments] = useState([]);
  const [loadingInst, setLoadingInst] = useState(true); // true on mount — fetch immediately
  const [showAdd, setShowAdd] = useState(false);

  const bg = dark ? "#1C2333" : "#fff";
  const panelBg = dark ? "#111827" : "#F8FAFC";
  const border = dark ? "#2A3347" : "#E5E7EB";
  const textMain = dark ? "#F9FAFB" : "#111827";
  const textMuted = dark ? "#9CA3AF" : "#6B7280";

  const { bg: avBg, text: avText } = avatarColors(student.student_id);
  const initials = student.student_name
    ?.split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const totalFees = Number(student.total_fees) || 0;

  // ── Derived from installments (single source of truth) ──
  const paid = installments.reduce((sum, inst) => sum + Number(inst.amount), 0);
  const balance = totalFees - paid;
  const paidPct =
    totalFees > 0 ? Math.min(100, Math.round((paid / totalFees) * 100)) : 0;

  const adminName = (id) =>
    admins.find((a) => a.admin_id === id)?.name ||
    (id ? id.slice(0, 8) + "…" : "—");

  // ── Fetch installments on mount and whenever admission_id changes ──
  const fetchInstallments = useCallback(async () => {
    setLoadingInst(true);
    try {
      const res = await fetch(
        `${BASE_URL}/api/installments/${student.admission_id}?sheet_url=${encodeURIComponent(sheetUrl)}`,
      );
      const data = await res.json();
      setInstallments(data.installments || []);
    } catch {
      setInstallments([]);
    } finally {
      setLoadingInst(false);
    }
  }, [student.admission_id, sheetUrl]);

  useEffect(() => {
    fetchInstallments();
  }, [fetchInstallments]);

  // ── After a new installment is saved, append it locally and notify parent ──
  const handleInstallmentSuccess = (addedAmount) => {
    // Re-fetch to get the real record (id, date, etc.) from server
    fetchInstallments();
    // Tell parent the new balance so the table row updates instantly
    onInstallmentAdded(student.admission_id, balance - addedAmount);
  };

  const panel = (
    <>
      <style>{`@keyframes slideInRight { from { transform: translateX(100%); } to { transform: translateX(0); } }`}</style>

      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 8000,
          background: "rgba(0,0,0,0.3)",
        }}
      />

      {/* Panel */}
      <div
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          bottom: 0,
          zIndex: 8001,
          width: "420px",
          maxWidth: "100vw",
          background: bg,
          borderLeft: `1px solid ${border}`,
          display: "flex",
          flexDirection: "column",
          boxShadow: "-8px 0 40px rgba(0,0,0,0.15)",
          animation: "slideInRight 0.22s ease",
        }}
      >
        {/* Panel Header */}
        <div
          style={{
            background: bg,
            borderBottom: `1px solid ${border}`,
            flexShrink: 0,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              padding: "16px 16px 0",
            }}
          >
            <button
              onClick={onClose}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: textMuted,
                display: "flex",
                padding: "6px",
                borderRadius: "6px",
              }}
            >
              <CloseIcon />
            </button>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "14px",
              padding: "8px 20px 16px",
            }}
          >
            <div
              style={{
                width: "50px",
                height: "50px",
                borderRadius: "50%",
                background: avBg,
                color: avText,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "17px",
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
                  fontSize: "17px",
                  fontWeight: 700,
                  color: textMain,
                }}
              >
                {student.student_name}
              </p>
              <p
                style={{
                  margin: "3px 0 0",
                  fontSize: "13px",
                  color: textMuted,
                }}
              >
                {student.standard} · {student.batch}
              </p>
            </div>
          </div>

          {/* Tabs */}
          <div style={{ display: "flex" }}>
            {["overview", "history"].map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                style={{
                  flex: 1,
                  padding: "10px 0",
                  fontSize: "14px",
                  fontWeight: 600,
                  border: "none",
                  background: "none",
                  cursor: "pointer",
                  color: tab === t ? "#3C50E0" : textMuted,
                  borderBottom:
                    tab === t ? "2px solid #3C50E0" : "2px solid transparent",
                  textTransform: "capitalize",
                  transition: "color 0.15s",
                }}
              >
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Panel Body */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "20px",
            background: panelBg,
            display: "flex",
            flexDirection: "column",
            gap: "14px",
          }}
        >
          {/* ── OVERVIEW ── */}
          {tab === "overview" && (
            <>
              {/* Fee Summary card */}
              <div
                style={{
                  background: bg,
                  border: `1px solid ${border}`,
                  borderRadius: "10px",
                  padding: "16px",
                }}
              >
                <p
                  style={{
                    margin: "0 0 12px",
                    fontSize: "11px",
                    fontWeight: 700,
                    color: textMuted,
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                  }}
                >
                  Fee Summary
                </p>

                {loadingInst ? (
                  <p style={{ margin: 0, fontSize: "13px", color: textMuted }}>
                    Calculating…
                  </p>
                ) : (
                  <>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: "8px",
                      }}
                    >
                      <span style={{ fontSize: "13px", color: textMuted }}>
                        Total Fees
                      </span>
                      <span
                        style={{
                          fontSize: "13px",
                          fontWeight: 700,
                          color: textMain,
                        }}
                      >
                        ₹{totalFees.toLocaleString()}
                      </span>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: "8px",
                      }}
                    >
                      <span style={{ fontSize: "13px", color: textMuted }}>
                        Paid
                      </span>
                      <span
                        style={{
                          fontSize: "13px",
                          fontWeight: 700,
                          color: "#16A34A",
                        }}
                      >
                        ₹{paid.toLocaleString()}
                      </span>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: "14px",
                      }}
                    >
                      <span style={{ fontSize: "13px", color: textMuted }}>
                        Balance
                      </span>
                      <span
                        style={{
                          fontSize: "13px",
                          fontWeight: 700,
                          color: balance > 0 ? "#EF4444" : "#16A34A",
                        }}
                      >
                        ₹{balance.toLocaleString()}
                      </span>
                    </div>

                    {/* Progress bar */}
                    <div
                      style={{
                        height: "6px",
                        background: dark ? "#2A3347" : "#E5E7EB",
                        borderRadius: "99px",
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          height: "100%",
                          width: `${paidPct}%`,
                          background: paidPct === 100 ? "#16A34A" : "#3C50E0",
                          borderRadius: "99px",
                          transition: "width 0.4s ease",
                        }}
                      />
                    </div>
                    <p
                      style={{
                        margin: "6px 0 0",
                        fontSize: "12px",
                        color: textMuted,
                        textAlign: "right",
                      }}
                    >
                      {paidPct}% paid
                    </p>
                  </>
                )}
              </div>

              {/* Student Details card */}
              <div
                style={{
                  background: bg,
                  border: `1px solid ${border}`,
                  borderRadius: "10px",
                  padding: "16px",
                }}
              >
                <p
                  style={{
                    margin: "0 0 4px",
                    fontSize: "11px",
                    fontWeight: 700,
                    color: textMuted,
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                  }}
                >
                  Student Details
                </p>
                <DetailRow
                  label="Name"
                  value={student.student_name}
                  dark={dark}
                />
                <DetailRow label="Mobile" value={student.mobile} dark={dark} />
                <DetailRow
                  label="Standard"
                  value={student.standard}
                  dark={dark}
                />
                <DetailRow label="Batch" value={student.batch} dark={dark} />
                <DetailRow
                  label="Standard ID"
                  value={student.standard_id}
                  dark={dark}
                />
              </div>

              {/* System Info card */}
              <div
                style={{
                  background: bg,
                  border: `1px solid ${border}`,
                  borderRadius: "10px",
                  padding: "16px",
                }}
              >
                <p
                  style={{
                    margin: "0 0 4px",
                    fontSize: "11px",
                    fontWeight: 700,
                    color: textMuted,
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                  }}
                >
                  System Info
                </p>
                <DetailRow
                  label="Admission ID"
                  value={student.admission_id?.slice(0, 18) + "…"}
                  dark={dark}
                />
                <DetailRow
                  label="Student ID"
                  value={student.student_id?.slice(0, 18) + "…"}
                  dark={dark}
                />
                <DetailRow
                  label="Admitted On"
                  value={fmt(student.created_at)}
                  dark={dark}
                />
              </div>
            </>
          )}

          {/* ── HISTORY ── */}
          {tab === "history" && (
            <>
              {/* Add Installment button */}
              <button
                onClick={() => {
                  if (balance <= 0) return;
                  setShowAdd(true);
                }}
                disabled={balance <= 0 || loadingInst}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "7px",
                  padding: "10px",
                  fontSize: "14px",
                  fontWeight: 600,
                  border: "none",
                  borderRadius: "8px",
                  background:
                    balance <= 0 || loadingInst
                      ? dark
                        ? "#2A3347"
                        : "#E5E7EB"
                      : "#3C50E0",
                  color: balance <= 0 || loadingInst ? textMuted : "#fff",
                  cursor:
                    balance <= 0 || loadingInst ? "not-allowed" : "pointer",
                }}
              >
                <PlusIcon />
                {loadingInst
                  ? "Loading…"
                  : balance <= 0
                    ? "Fees Fully Paid"
                    : "Add Installment"}
              </button>

              {/* Balance chip */}
              {!loadingInst && (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "10px 14px",
                    borderRadius: "8px",
                    background:
                      balance <= 0
                        ? dark
                          ? "#052e16"
                          : "#DCFCE7"
                        : dark
                          ? "#1C2333"
                          : "#EEF2FF",
                    border: `1px solid ${balance <= 0 ? (dark ? "#16A34A" : "#86EFAC") : dark ? "#2A3347" : "#C7D2FE"}`,
                  }}
                >
                  <span style={{ fontSize: "13px", color: textMuted }}>
                    {balance <= 0 ? "Status" : "Remaining Balance"}
                  </span>
                  <span
                    style={{
                      fontSize: "13px",
                      fontWeight: 700,
                      color: balance <= 0 ? "#16A34A" : "#EF4444",
                    }}
                  >
                    {balance <= 0
                      ? "✓ Fully Paid"
                      : `₹${balance.toLocaleString()}`}
                  </span>
                </div>
              )}

              {/* Installment timeline */}
              {loadingInst ? (
                <p
                  style={{
                    textAlign: "center",
                    color: textMuted,
                    fontSize: "14px",
                    padding: "32px 0",
                  }}
                >
                  Loading…
                </p>
              ) : installments.length === 0 ? (
                <p
                  style={{
                    textAlign: "center",
                    color: textMuted,
                    fontSize: "14px",
                    padding: "32px 0",
                  }}
                >
                  No installments yet.
                </p>
              ) : (
                <div style={{ position: "relative", paddingLeft: "28px" }}>
                  <div
                    style={{
                      position: "absolute",
                      left: "10px",
                      top: "16px",
                      bottom: "16px",
                      width: "2px",
                      background: dark ? "#2A3347" : "#E5E7EB",
                    }}
                  />
                  {installments.map((inst, idx) => (
                    <div
                      key={inst.installment_id || idx}
                      style={{ position: "relative", marginBottom: "16px" }}
                    >
                      <div
                        style={{
                          position: "absolute",
                          left: "-22px",
                          top: "16px",
                          width: "14px",
                          height: "14px",
                          borderRadius: "50%",
                          background: idx === 0 ? "#3C50E0" : "#16A34A",
                          border: `2px solid ${panelBg}`,
                          zIndex: 1,
                        }}
                      />
                      <div
                        style={{
                          background: bg,
                          border: `1px solid ${border}`,
                          borderRadius: "10px",
                          padding: "14px",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "flex-start",
                          }}
                        >
                          <div>
                            <p
                              style={{
                                margin: 0,
                                fontSize: "15px",
                                fontWeight: 700,
                                color: "#16A34A",
                              }}
                            >
                              ₹{Number(inst.amount).toLocaleString()}
                            </p>
                            <p
                              style={{
                                margin: "4px 0 0",
                                fontSize: "12px",
                                color: textMuted,
                              }}
                            >
                              Received by {adminName(inst.received_by)}
                            </p>
                          </div>
                          <span
                            style={{
                              fontSize: "11px",
                              padding: "3px 8px",
                              borderRadius: "20px",
                              background: dark ? "#2A3347" : "#F3F4F6",
                              color: textMuted,
                            }}
                          >
                            #{idx + 1}
                          </span>
                        </div>
                        <p
                          style={{
                            margin: "8px 0 0",
                            fontSize: "12px",
                            color: textMuted,
                          }}
                        >
                          {fmt(inst.payment_date)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {showAdd && (
        <AddInstallmentModal
          student={student}
          admins={admins}
          sheetUrl={sheetUrl}
          dark={dark}
          onClose={() => setShowAdd(false)}
          onInstallmentAdded={handleInstallmentSuccess}
          currentBalance={balance}
        />
      )}
    </>
  );

  return ReactDOM.createPortal(panel, document.body);
}
