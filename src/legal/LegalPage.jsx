import React, { useEffect, useState } from "react";
import "./LegalPage.css";

/**
 * Generic Legal Page Renderer
 * Fetches legal content dynamically using apiPath
 */
function LegalPage({ apiPath }) {
  const BASE_URL = import.meta.env.VITE_BASE_URL;

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadPage() {
      try {
        const res = await fetch(`${BASE_URL}${apiPath}`);

        if (!res.ok) {
          throw new Error("Failed to load content");
        }

        const json = await res.json();
        setData(json);
      } catch (err) {
        console.error("LegalPage API error:", err);
        setError("Unable to load content. Please try again later.");
      } finally {
        setLoading(false);
      }
    }

    loadPage();
  }, [apiPath, BASE_URL]);

  if (loading) {
    return <div className="legal-loading">Loading…</div>;
  }

  if (error) {
    return <div className="legal-error">{error}</div>;
  }

  if (!data) {
    return null;
  }

  return (
    <div className="legal-page">
      <h1 className="legal-title">{data.title}</h1>

      {data.lastUpdated && (
        <p className="legal-updated">Last updated: {data.lastUpdated}</p>
      )}

      {data.content.map((section, index) => (
        <div key={index} className="legal-section">
          <h2>{section.heading}</h2>
          <p>{section.body}</p>
        </div>
      ))}
    </div>
  );
}

export default LegalPage;
