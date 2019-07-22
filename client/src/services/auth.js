import axios from 'axios';

const BASE_URL = 'http://localhost:3000';

export const api = axios.create({
  baseURL: BASE_URL,
});

const storeToken = (token) => {
  localStorage.setItem('authToken', token);
  api.defaults.headers.common.authorization = `Bearer ${token}`;
}

export const createUser = async (userData) => {
  const resp = await api.post('/users', userData);
  const { user, token } = resp.data;
  storeToken(token);
  return user;
};

