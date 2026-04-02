import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const styles = {
  page: {
    backgroundColor: "#EEF2F7",
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "'Segoe UI', sans-serif",
  },
  card: {
    background: "#fff",
    padding: "40px 36px",
    borderRadius: "16px",
    width: "100%",
    maxWidth: "440px",
    boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
    boxSizing: "border-box",
  },
  title: {
    textAlign: "center",
    fontSize: "26px",
    fontWeight: "700",
    color: "#111",
    marginBottom: "6px",
    marginTop: 0,
  },
  subtitle: {
    textAlign: "center",
    fontSize: "14px",
    color: "#6B7280",
    marginBottom: "28px",
    marginTop: 0,
  },
  fieldGroup: {
    marginBottom: "18px",
  },
  label: {
    display: "block",
    fontSize: "14px",
    fontWeight: "600",
    color: "#111",
    marginBottom: "8px",
  },
  inputWrapper: {
    position: "relative",
    width: "100%",
    boxSizing: "border-box",
  },
  icon: {
    position: "absolute",
    left: "14px",
    top: "50%",
    transform: "translateY(-50%)",
    color: "#9CA3AF",
    display: "flex",
    alignItems: "center",
    pointerEvents: "none",
  },
  input: {
    width: "100%",
    boxSizing: "border-box",
    border: "1px solid #E5E7EB",
    borderRadius: "10px",
    padding: "12px 16px 12px 44px",
    fontSize: "14px",
    color: "#374151",
    outline: "none",
    backgroundColor: "#F9FAFB",
  },
  button: {
    width: "100%",
    padding: "14px",
    background: "#3B4FE4",
    color: "#fff",
    border: "none",
    borderRadius: "10px",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
    marginTop: "8px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    boxSizing: "border-box",
  },
  footer: {
    textAlign: "center",
    marginTop: "20px",
    fontSize: "14px",
    color: "#6B7280",
  },
  link: {
    color: "#3B4FE4",
    fontWeight: "600",
    textDecoration: "none",
    cursor: "pointer",
  },
};

const BuildingIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <path d="M9 3v18M15 3v18M3 9h18M3 15h18" />
  </svg>
);

const EmailIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="M2 7l10 7 10-7" />
  </svg>
);

const LockIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

const ArrowIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

const Register = () => {
  const [form, setForm] = useState({
    institute_name: "",
    email: "",
    pin: "",
    confirmPin: "",
  });
  const navigate = useNavigate();

  // If already logged in, skip register and go straight to dashboard
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/dashboard", { replace: true });
    }
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.pin !== form.confirmPin) {
      alert("PINs do not match");
      return;
    }
    const res = await fetch(
      "https://fees-management-umber.vercel.app/auth/register",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          institute_name: form.institute_name,
          email: form.email,
          pin: form.pin,
        }),
      },
    );
    const data = await res.json();
    alert(data.message);
    if (res.ok) {
      navigate("/", { replace: true }); // replace so back doesn't return here
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2 style={styles.title}>Create Account</h2>
        <p style={styles.subtitle}>Register your institute to get started</p>

        <form onSubmit={handleSubmit}>
          <div style={styles.fieldGroup}>
            <label style={styles.label}>Institute Name</label>
            <div style={styles.inputWrapper}>
              <span style={styles.icon}>
                <BuildingIcon />
              </span>
              <input
                name="institute_name"
                type="text"
                placeholder="Institute Name"
                onChange={handleChange}
                style={styles.input}
                required
              />
            </div>
          </div>

          <div style={styles.fieldGroup}>
            <label style={styles.label}>Email Address</label>
            <div style={styles.inputWrapper}>
              <span style={styles.icon}>
                <EmailIcon />
              </span>
              <input
                name="email"
                type="email"
                placeholder="Email Address"
                onChange={handleChange}
                style={styles.input}
                required
              />
            </div>
          </div>

          <div style={styles.fieldGroup}>
            <label style={styles.label}>PIN</label>
            <div style={styles.inputWrapper}>
              <span style={styles.icon}>
                <LockIcon />
              </span>
              <input
                name="pin"
                type="password"
                placeholder="Enter PIN"
                onChange={handleChange}
                style={styles.input}
                required
              />
            </div>
          </div>

          <div style={styles.fieldGroup}>
            <label style={styles.label}>Confirm PIN</label>
            <div style={styles.inputWrapper}>
              <span style={styles.icon}>
                <LockIcon />
              </span>
              <input
                name="confirmPin"
                type="password"
                placeholder="Confirm PIN"
                onChange={handleChange}
                style={styles.input}
                required
              />
            </div>
          </div>

          <button type="submit" style={styles.button}>
            Create Account <ArrowIcon />
          </button>
        </form>

        <p style={styles.footer}>
          Already have an account?{" "}
          <span
            style={styles.link}
            onClick={() => navigate("/", { replace: true })}
          >
            Sign in
          </span>
        </p>
      </div>
    </div>
  );
};

export default Register;
