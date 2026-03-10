import api from './axiosInstance';

export const authApi = {
  /** Register a new user */
  register:       (data) => api.post('/auth/register', data),
  /** Login */
  login:          (data) => api.post('/auth/login', data),
  /** Get current user */
  getMe:          ()     => api.get('/auth/me'),
  /** Update name / preferences */
  updateProfile:  (data) => api.put('/auth/profile', data),
  /** Change password */
  changePassword: (data) => api.put('/auth/password', data),
};