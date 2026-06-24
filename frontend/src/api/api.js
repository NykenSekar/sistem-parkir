import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - tambahkan token ke setiap request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - handle 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ===================== AUTH =====================
export const login = (data) => api.post('/auth/login', data);

// ===================== PENGGUNA =====================
export const getPengguna = () => api.get('/pengguna');
export const createPengguna = (data) => api.post('/pengguna', data);
export const updatePengguna = (id, data) => api.put(`/pengguna/${id}`, data);
export const deletePengguna = (id) => api.delete(`/pengguna/${id}`);

// ===================== KENDARAAN =====================
export const getKendaraan = () => api.get('/kendaraan');
export const createKendaraan = (data) => api.post('/kendaraan', data);
export const updateKendaraan = (id, data) => api.put(`/kendaraan/${id}`, data);
export const deleteKendaraan = (id) => api.delete(`/kendaraan/${id}`);

// ===================== PARKIR =====================
export const getParkir = () => api.get('/parkir');
export const getParkirAktif = () => api.get('/parkir/aktif');
export const getDashboardStats = () => api.get('/parkir/dashboard-stats');
export const getLaporanParkir = (params) => api.get('/parkir/laporan', { params });
export const parkirMasuk = (data) => api.post('/parkir/masuk', data);
export const parkirKeluar = (id) => api.put(`/parkir/keluar/${id}`);

export default api;
