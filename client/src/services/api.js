import axios from 'axios';
import toast from 'react-hot-toast';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.error || 
                   error.response?.data?.message || 
                   'Error de conexión con el servidor';
    
    const is404 = error.response?.status === 404;
    const isGetRequest = error.config?.method === 'get';
    
    if (!(is404 && isGetRequest)) {
      toast.error(message);
    }
    
    return Promise.reject(error);
  }
);

export const apiGet = (url, config = {}) => api.get(url, config);
export const apiPost = (url, data = {}, config = {}) => api.post(url, data, config);
export const apiPut = (url, data = {}, config = {}) => api.put(url, data, config);
export const apiDelete = (url, config = {}) => api.delete(url, config);

export const apiUpload = (url, formData, onProgress = null) => {
  const config = {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  };
  
  if (onProgress) {
    config.onUploadProgress = onProgress;
  }
  
  return api.post(url, formData, config);
};

export const checkHealth = () => api.get('/health');

export default api;
