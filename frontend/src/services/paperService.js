
import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8000/api",
});

const USER_ID = 1; // Temporary until authentication is implemented

// Upload PDF, analyse it and save it
export const uploadAndAnalyzePaper = async (file) => {
  const formData = new FormData();

  formData.append("pdf", file);
  formData.append("userId", USER_ID);

  const response = await API.post("/analyze-paper", formData);

  return response.data;
};

// Get all papers
export const getAllPapers = async () => {
  const response = await API.get("/papers", {
    params: { userId: USER_ID },
  });

  return response.data.papers;
};

// Get one paper
export const getPaperById = async (id) => {
  const response = await API.get(`/papers/${id}`, {
    params: { userId: USER_ID },
  });

  return response.data.paper;
};

// Delete a paper
export const deletePaper = async (id) => {
  const response = await API.delete(`/papers/${id}`, {
    params: { userId: USER_ID },
  });

  return response.data;
};

export const getPaperRelationships = async () => {
  const response = await API.get("/paper-relationships", {
    params: { userId: USER_ID },
  });

  return response.data.relationships;
};


export const comparePapers = async (paperIds) => {
  const response = await API.post("/compare-papers", {
    userId: USER_ID,
    paperIds,
  });

  return response.data.comparison;
};
