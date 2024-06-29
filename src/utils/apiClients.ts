import axios from 'axios';

const apiSquare = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL_SQUARE as string,
  headers: {
    Authorization: `Bearer ${import.meta.env.VITE_API_KEY_SQUARE}`,
  },
});


export { apiSquare };
