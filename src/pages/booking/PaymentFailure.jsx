import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function PaymentFailure() {
  const navigate = useNavigate();
  const [seconds, setSeconds] = useState(15);

  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds((prev) => prev - 1);
    }, 1000);

    const redirect = setTimeout(() => {
      navigate("/");
    }, 15000);

    return () => {
      clearInterval(timer);
      clearTimeout(redirect);
    };
  }, [navigate]);

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.icon}>✕</div>

        <h2 style={styles.title}>Payment Failed</h2>
        <p style={styles.subtitle}>
          Your booking was cancelled and inventory has been released.
        </p>

        <div style={styles.divider} />

        <p style={styles.redirectText}>
          Redirecting to home in <b>{seconds}s</b>
        </p>

        <button style={styles.retryButton} onClick={() => navigate("/")}>
          Try Booking Again
        </button>
      </div>
    </div>
  );
}
const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #fff1f2, #ffe4e6)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "Inter, system-ui, sans-serif",
  },
  card: {
    background: "#fff",
    padding: "48px",
    borderRadius: "16px",
    width: "100%",
    maxWidth: "420px",
    textAlign: "center",
    boxShadow: "0 20px 40px rgba(0,0,0,0.08)",
  },
  icon: {
    width: "72px",
    height: "72px",
    borderRadius: "50%",
    background: "#fee2e2",
    color: "#ef4444",
    fontSize: "36px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 24px",
  },
  title: {
    fontSize: "24px",
    fontWeight: "700",
    marginBottom: "8px",
    color: "#111827",
  },
  subtitle: {
    fontSize: "15px",
    color: "#6b7280",
    marginBottom: "24px",
  },
  divider: {
    height: "1px",
    background: "#e5e7eb",
    marginBottom: "20px",
  },
  redirectText: {
    fontSize: "14px",
    color: "#374151",
    marginBottom: "24px",
  },
  retryButton: {
    padding: "12px 20px",
    borderRadius: "10px",
    border: "none",
    background: "#ef4444",
    color: "#fff",
    fontSize: "15px",
    fontWeight: "600",
    cursor: "pointer",
  },
};
