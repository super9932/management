import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

const client = axios.create({
  baseURL: '/api/counsel',
  headers: { 'Content-Type': 'application/json' },
});

client.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  config.headers['X-Request-Id'] = uuidv4();
  return config;
});

export default client;
