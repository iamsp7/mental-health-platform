import React, { useState } from "react";

export default function PdfUploader({ token }) {
  const [fileName, setFileName] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const uploadPdf = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setFileName(file.name);
    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("http://127.0.0.1:8000/analyze_pdf", {
        method: "POST",
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        body: formData,
      });
      const data = await res.json();
      setResult(data);
    } catch (err) {
      console.error("Upload error", err);
      setResult({ error: "Upload failed" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h3>Upload PDF</h3>
      <input type="file" accept="application/pdf" onChange={uploadPdf} />
      {loading && <p>Processing PDF…</p>}
      {fileName && <p>File: {fileName}</p>}
      {result && (
        <pre style={{ whiteSpace: "pre-wrap", background: "#f6f6f6", padding: 12 }}>
          {JSON.stringify(result, null, 2)}
        </pre>
      )}
    </div>
  );
}
