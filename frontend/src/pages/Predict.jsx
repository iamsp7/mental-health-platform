// src/pages/Predict.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const ML_API = "http://127.0.0.1:8000";

export default function Predict({ token }) {
  const [text, setText] = useState("");
  const [resp, setResp] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setResp(null);
    setLoading(true);

    try {
      const res = await fetch(`${ML_API}/analyze_text`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ text })
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json?.detail || "Request failed");

      setResp(json);

      // 🔑 REDIRECT IF SUPPORT IS RECOMMENDED
      if (json.support_recommended) {
        setTimeout(() => {
          navigate("/support");
        }, 1200); // short delay so user sees result
      }

    } catch (err) {
      setResp({ error: err.message || String(err) });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="card">
      <h3>Mental Health Check</h3>
      <p className="muted">
        Share how you are feeling. This is not a diagnosis, just a supportive check.
      </p>

      <form className="form" onSubmit={handleSubmit}>
        <textarea
          className="input"
          rows={4}
          placeholder="Type how you are feeling..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        <button
          className="btn"
          type="submit"
          disabled={loading || !text.trim()}
        >
          {loading ? "Analyzing..." : "Analyze"}
        </button>
      </form>

      <div className="result" style={{ marginTop: 16 }}>
        <h4>Result</h4>
        <pre style={{ whiteSpace: "pre-wrap" }}>
          {resp ? JSON.stringify(resp, null, 2) : "No response yet"}
        </pre>
      </div>
    </div>
  );
}
