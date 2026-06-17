import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";

export default function PaymentAtHotelPage() {
  const navigate = useNavigate();
  const [seconds, setSeconds] = useState(30);
  const { state } = useLocation();
  const amount = state?.amount;
  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds((prev) => prev - 1);
    }, 1000);

    const redirect = setTimeout(() => {
      navigate("/");
    }, 30000);

    return () => {
      clearInterval(timer);
      clearTimeout(redirect);
    };
  }, [navigate]);

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.icon}>✔</div>

        <h2 style={styles.title}>Booking Confirmed</h2>
        <p style={styles.subtitle}>Your stay has been successfully reserved.</p>

        {/* 💰 Pay at Hotel Highlight */}
        <div style={styles.payBox}>
          <p style={styles.payLabel}>Pay at Hotel</p>
          <p style={styles.amount}>₹{amount}</p>
          <p style={styles.payNote}>
            Please pay the above amount at the hotel reception during check-in.
          </p>
        </div>

        {/* 📞 Support */}
        <p style={styles.support}>
          Need help? Reach us at{" "}
          <a href="mailto:info@hotaality.com" style={styles.link}>
            info@hotaality.com
          </a>{" "}
          or call <b>+91 9211283334</b>
        </p>

        <div style={styles.divider} />

        <p style={styles.redirectText}>
          Redirecting to home in <b>{seconds}s</b>
        </p>

        <button style={styles.button} onClick={() => navigate("/")}>
          Go to Home
        </button>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #f8fafc, #e2e8f0)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "Inter, system-ui, sans-serif",
    padding: "16px",
  },

  card: {
    background: "#ffffff",
    padding: "44px",
    borderRadius: "18px",
    width: "100%",
    maxWidth: "460px",
    textAlign: "center",
    boxShadow: "0 25px 50px rgba(0,0,0,0.1)",
  },

  icon: {
    width: "80px",
    height: "80px",
    borderRadius: "50%",
    background: "linear-gradient(135deg, #dcfce7, #bbf7d0)",
    color: "#15803d",
    fontSize: "38px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 24px",
  },

  title: {
    fontSize: "26px",
    fontWeight: "700",
    marginBottom: "6px",
    color: "#0f172a",
  },

  subtitle: {
    fontSize: "15px",
    color: "#64748b",
    marginBottom: "24px",
  },

  payBox: {
    background: "#fefce8",
    border: "1px solid #fde68a",
    borderRadius: "14px",
    padding: "20px",
    marginBottom: "24px",
  },

  payLabel: {
    fontSize: "13px",
    textTransform: "uppercase",
    letterSpacing: "1px",
    color: "#92400e",
    marginBottom: "6px",
    fontWeight: "600",
  },

  amount: {
    fontSize: "32px",
    fontWeight: "800",
    color: "#78350f",
    marginBottom: "6px",
  },

  payNote: {
    fontSize: "14px",
    color: "#92400e",
  },

  support: {
    fontSize: "14px",
    color: "#475569",
    marginBottom: "20px",
    lineHeight: "1.6",
  },

  link: {
    color: "#2563eb",
    textDecoration: "none",
    fontWeight: "500",
  },

  divider: {
    height: "1px",
    background: "#e5e7eb",
    marginBottom: "20px",
  },

  redirectText: {
    fontSize: "13px",
    color: "#475569",
    marginBottom: "20px",
  },

  button: {
    padding: "14px 22px",
    borderRadius: "12px",
    border: "none",
    background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
    color: "#fff",
    fontSize: "15px",
    fontWeight: "600",
    cursor: "pointer",
    width: "100%",
  },
};
