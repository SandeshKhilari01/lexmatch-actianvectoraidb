import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

export const searchClauses = async (params) => {
  const response = await api.post('/search', params);
  return response.data;
};

export const getClauseTypes = async () => {
  const response = await api.get('/clause-types');
  return response.data;
};

export const getStats = async () => {
  const response = await api.get('/stats');
  return response.data;
};

export const checkHealth = async () => {
  const response = await api.get('/health');
  return response.data;
};
