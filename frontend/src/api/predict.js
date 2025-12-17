// // src/api/predict.js
// const JAVA_API = "http://localhost:8080/api";

// export async function predictFeatures(features) {
//   const res = await fetch(`${JAVA_API}/predict`, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//       "Authorization": `Bearer ${localStorage.getItem("token") || ""}`
//     },
//     body: JSON.stringify({ features })
//   });
//   if (!res.ok) {
//     const text = await res.text();
//     throw new Error(text || "Predict failed");
//   }
//   return res.json();
// }
