import AsyncStorage from '@react-native-async-storage/async-storage';
import { replace } from '../navigation/NavigationService';
import { API_URL } from '@env';
import axios from 'axios';
import {showLoader, hideLoader} from '../services/LoaderService'
const api = axios.create({
  baseURL: `${API_URL}/`,
  timeout: 10000,
});

// Request interceptor to attach token
api.interceptors.request.use(
  async config => {
    showLoader();
    const refreshToken = await AsyncStorage.getItem('refreshToken');
    // console.log('Attaching refresh token to request:', refreshToken);
    if (refreshToken) {
      config.headers.Authorization = refreshToken;
    }
    return config;
  },
  
  error => {
    hideLoader();
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  response => {
    hideLoader();
    return response;
  },
  async error => {
    hideLoader();
    const originalRequest = error.config;

    // If token expired, request a new one
    if (error.response?.status === 403 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        showLoader();
        const refreshToken = await AsyncStorage.getItem('refreshToken');
        // console.log('Refresh token in API:', refreshToken);
        if (!refreshToken) {
          throw new Error('No refresh token found');
        }
        console.log('Attempting to refresh token with:', refreshToken);
        const response = await api.post(`${API_URL}user/validateRefreshToken`, {
          refreshToken,
        });
        console.log('Response from refresh token:', response);
        const newRefreshToken = response?.data?.token;
        await AsyncStorage.setItem('refreshToken', newRefreshToken);

        // Retry original request with new token
        originalRequest.headers.Authorization = newRefreshToken;
        hideLoader();
        return api(originalRequest);
      } catch (refreshError) {
          hideLoader();
          console.log('Token refresh failed:', refreshError.response.data);
          replace('LoginPage');
          
          return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  },
);

export default api;