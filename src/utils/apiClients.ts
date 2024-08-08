import axios from 'axios';

const apiSquare = axios.create({
  baseURL: import.meta.env.VITE_API_WEB_BASE_URL as string,
  headers: {
    'x-api-key': import.meta.env.VITE_API_KEY_SQUARE as string,
  },
});


export { apiSquare };
