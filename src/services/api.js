import axios from 'axios';

const api = axios.create({
  //baseURL: process.env.SCRABBLE_UI_API_URL
  baseURL: 'http://localhost:8080/scrabble',
  headers: {
    'Content-Type': 'application/json',
  }
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
    console.log("i need response here ", response)
    return response.data;
  } catch(error) {
    console.error('Error ', error.errorMessage)
    throw error;
  }
}

export const saveScore = async (input) => {
  try {
    const response = await api.post(
      '/scores',
      {word:input}
    );
    console.log('saved score id : ' + response.data);
    return response.data;
  } catch(error) {
    console.error('Error', error.errorMessage)
    throw error;
  }
}

export default api;