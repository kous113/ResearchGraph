
import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8000/api",
});

export const registerUser = async (userData) => {
  const response = await API.post("/register", userData);
  return response.data;
};

export const loginUser = async (credentials) => {
  const response = await API.post("/login", credentials);
  return response.data;
};
