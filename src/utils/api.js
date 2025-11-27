import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api'; // Update this with your actual backend URL

export const fetchHotels = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/hotels`);
    return response.data;
  } catch (error) {
    console.error('Error fetching hotels:', error);
    throw error;
  }
};
