const isGithubPages =
  window.location.hostname.includes("github.io");

export const IS_DEMO = isGithubPages;

export const API_BASE = isGithubPages
  ? null
  : "https://mindcare-backend.onrender.com/api";

export const ML_API = isGithubPages
  ? null
  : "https://mindcare-ml.onrender.com/analyze_text";
