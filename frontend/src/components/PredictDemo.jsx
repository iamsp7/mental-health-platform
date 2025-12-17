import React, { useState } from "react";
import { predictFeatures } from "../api/predict";

export default function PredictDemo() {
  const [features, setFeatures] = useState("5.1,3.5,1.4,0.2");
  const [resp, setResp] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setResp(null);
    try {
      const arr = features.split(",").map(s => parseFloat(s.trim()));
      const data = await predictFeatures(arr);
      setResp(data);
    } catch (err) {
      setResp({ error: err.message });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{padding:20}}>
      <h3>Predict Demo</h3>
      <form onSubmit={handleSubmit}>
        <input
          value={features}
          onChange={e => setFeatures(e.target.value)}
          style={{ width: 300 }}
        />
        <button type="submit" disabled={loading} style={{ marginLeft: 8 }}>
          {loading ? "..." : "Predict"}
        </button>
      </form>

      <div style={{ marginTop: 16 }}>
        <strong>Response:</strong>
        <pre style={{ background: "#f6f6f6", padding: 10 }}>
          {resp ? JSON.stringify(resp, null, 2) : "No response yet"}
        </pre>
      </div>
    </div>
  );
}
