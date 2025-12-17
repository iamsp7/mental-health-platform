import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function TextAnalyzer({ token }) {
  const [text, setText] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const analyze = async () => {
    if (!text.trim()) return;

    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("http://127.0.0.1:8000/analyze_text", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ text })
      });

      const data = await res.json();
      setResult(data);

      // 🔴 IMPORTANT: REDIRECT IF SUPPORT IS NEEDED
      if (data.support_recommended === true) {
        setTimeout(() => {
          navigate("/support");
        }, 1000); // 1s delay so result is visible
      }

    } catch (err) {
      console.error(err);
      setResult({ error: "Request failed" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h3>Analyze Text</h3>

      <textarea
        rows={6}
        style={{ width: "100%", padding: 8 }}
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type or paste how you are feeling..."
      />

      <div style={{ marginTop: 10 }}>
        <button onClick={analyze} disabled={loading}>
          {loading ? "Analyzing…" : "Analyze"}
        </button>
      </div>

      {result && (
        <pre
          style={{
            marginTop: 14,
            background: "#f6f6f6",
            padding: 12,
            borderRadius: 6,
            whiteSpace: "pre-wrap"
          }}
        >
          {JSON.stringify(result, null, 2)}
        </pre>
      )}
    </div>
  );
}
