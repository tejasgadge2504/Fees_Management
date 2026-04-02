import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import Sidebar from "../components/Sidebar";
import TopNavbar from "../components/TopNavbar";
import StandardPage from "./StandardPage";
import AdminPage from "./AdminPage";
import StudentsPage from "./StudentsPage";

export default function Dashboard() {
  const [dark, setDark] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activePage, setActivePage] = useState("standard");
  const navigate = useNavigate();

  const instituteName =
    localStorage.getItem("institute_name") || "My Institute";

  // Auth guard
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) navigate("/", { replace: true });
  }, []);

  const renderPage = () => {
    if (activePage === "admin") return <AdminPage dark={dark} />;
    if (activePage === "students") return <StudentsPage dark={dark} />;
    return <StandardPage dark={dark} />;
  };

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        background: dark ? "#111827" : "#EEF2F7",
        overflow: "hidden",
        fontFamily: "'Segoe UI', sans-serif",
      }}
    >
      {/* Sidebar */}
      <Sidebar
        dark={dark}
        open={sidebarOpen}
        activePage={activePage}
        setActivePage={setActivePage}
      />

      {/* Main column */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          minWidth: 0,
        }}
      >
        <TopNavbar
          dark={dark}
          setDark={setDark}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          instituteName={instituteName}
        />

        {/* Page content */}
        <main style={{ flex: 1, overflowY: "auto", padding: "24px" }}>
          {renderPage()}
        </main>
      </div>
    </div>
  );
}
