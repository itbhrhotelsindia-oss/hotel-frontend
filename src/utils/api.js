import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_BASE_URL;

// 🔹 Central axios instance (for auth & owner APIs)
const api = axios.create({
  baseURL: API_BASE_URL,
});

// 🔹 Attach JWT automatically (owner/admin)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 🔹 Existing public API (kept as-is)
export const fetchHotels = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/hotels`);
    return response.data;
  } catch (error) {
    console.error("Error fetching hotels:", error);
    throw error;
  }
};

export default api;
