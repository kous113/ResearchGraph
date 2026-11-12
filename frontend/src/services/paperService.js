
import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api",
});

// Automatically attach the logged-in user's JWT.
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("researchgraph_token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Upload PDF, analyse it and save it.
export const uploadAndAnalyzePaper = async (file) => {
  const formData = new FormData();
  formData.append("pdf", file);

  const response = await API.post("/analyze-paper", formData);

  return response.data;
};

// Get all papers belonging to the logged-in user.
export const getAllPapers = async () => {
  const response = await API.get("/papers");
  return response.data.papers;
};

// Get one paper.
export const getPaperById = async (id) => {
  const response = await API.get(`/papers/${id}`);
  return response.data.paper;
};

// Delete a paper.
export const deletePaper = async (id) => {
  const response = await API.delete(`/papers/${id}`);
  return response.data;
};

// Get paper relationships.
export const getPaperRelationships = async () => {
  const response = await API.get("/paper-relationships");
  return response.data.relationships;
};

// Compare selected papers.
export const comparePapers = async (paperIds) => {
  const response = await API.post("/compare-papers", {
    paperIds,
  });

  return response.data.comparison;
};

// Discover research gaps.
export const discoverResearchGaps = async (forceRefresh = false) => {
  const response = await API.post("/research-gaps", {
    forceRefresh,
  });

  return response.data;
};
