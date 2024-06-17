import axios from 'axios';

const api = axios.create({
  //baseURL: process.env.SCRABBLE_UI_API_URL
  baseURL: 'http://localhost:8080/scrabble'
})

export const fetchLetterPoints = async () => {
  try {
    const response = await api.get('/letterpoints');
    return response.data;
  } catch(error) {
    console.error('Error ', error.getErrorMessage);
    throw error;
  }
}

export const viewTopScores = async () => {
  try {
    const response = await api.get('/scores/top10');
    return response.data;
  } catch(error) {
    console.error('Error ', error.errorMessage)
    throw error;
  }
}

export default api;