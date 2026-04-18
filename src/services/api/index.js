// src/services/api/auth.api.js
import api from './client'

export const authApi = {
  signup:              (data) => api.post('/auth/signup', data),
  login:               (data) => api.post('/auth/login', data),
  logout:              (data) => api.post('/auth/logout', data),
  logoutAll:           ()     => api.post('/auth/logout-all'),
  getMe:               ()     => api.get('/auth/me'),
  verifyEmail:         (token) => api.get(`/auth/verify-email?token=${token}`),
  verifyOTP:           (data) => api.post('/auth/verify-otp', data),
  resendOTP:           (data) => api.post('/auth/resend-otp', data),
  resendVerification:  (data) => api.post('/auth/resend-verification', data),
  forgotPassword:      (data) => api.post('/auth/forgot-password', data),
  resetPassword:       (data) => api.post('/auth/reset-password', data),
  changePassword:      (data) => api.post('/auth/change-password', data),
  refresh:             (data) => api.post('/auth/refresh', data),
}

// src/services/api/user.api.js
export const userApi = {
  getProfile:   ()     => api.get('/users/me'),
  updateProfile:(data) => api.patch('/users/me', data),
  uploadAvatar: (form) => api.post('/users/me/avatar', form, { headers: { 'Content-Type': 'multipart/form-data' } }),
  deleteAvatar: ()     => api.delete('/users/me/avatar'),
  deactivate:   ()     => api.delete('/users/me'),
}

// src/services/api/project.api.js
export const projectApi = {
  list:        (params) => api.get('/projects', { params }),
  categories:  ()       => api.get('/projects/categories'),
  get:         (id)     => api.get(`/projects/${id}`),
  create:      (form)   => api.post('/projects', form, { headers: { 'Content-Type': 'multipart/form-data' } }),
  update:      (id, data) => api.put(`/projects/${id}`, data),
  remove:      (id)     => api.delete(`/projects/${id}`),
  deleteImage: (id, pid) => api.delete(`/projects/${id}/images/${encodeURIComponent(pid)}`),
}

// src/services/api/contact.api.js
export const contactApi = {
  submit: (data) => api.post('/contact', data),
}

// src/services/api/admin.api.js
export const adminApi = {
  dashboard:       ()             => api.get('/admin/dashboard'),
  listUsers:       (params)       => api.get('/admin/users', { params }),
  getUser:         (id)           => api.get(`/admin/users/${id}`),
  updateUser:      (id, data)     => api.patch(`/admin/users/${id}`, data),
  deleteUser:      (id)           => api.delete(`/admin/users/${id}`),
  listContacts:    (params)       => api.get('/admin/contacts', { params }),
  getContact:      (id)           => api.get(`/admin/contacts/${id}`),
  updateContact:   (id, data)     => api.patch(`/admin/contacts/${id}`, data),
  deleteContact:   (id)           => api.delete(`/admin/contacts/${id}`),
}
