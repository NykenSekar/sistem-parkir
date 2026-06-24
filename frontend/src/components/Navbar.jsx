import { useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { MdNotifications, MdLogout, MdMenu } from 'react-icons/md';

const pageTitles = {
  '/dashboard': 'Dashboard',
  '/smart-dashboard': 'Smart Dashboard',
  '/master-data': 'Registrasi Master',
  '/pengguna': 'Manajemen Pengguna Parkir',
  '/kendaraan': 'Manajemen Kendaraan',
  '/parkir-masuk': 'Catat Kendaraan Masuk',
  '/parkir-keluar': 'Catat Kendaraan Keluar',
  '/riwayat': 'Riwayat Parkir',
  '/laporan': 'Laporan Parkir',
};

export default function Navbar({ onToggleSidebar }) {
  const location = useLocation();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const formatTime = (date) => {
    return date.toLocaleString('id-ID', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  const currentTitle = pageTitles[location.pathname] || 'Dashboard';

  return (
    <header className="navbar">
      <div className="navbar-left">
        {/* Hamburger button — hanya tampil di mobile */}
        <button
          className="hamburger-btn"
          onClick={onToggleSidebar}
          aria-label="Toggle menu"
        >
          <MdMenu size={24} />
        </button>
        <span className="navbar-page-title">{currentTitle}</span>
      </div>

      <div className="navbar-right">
        <span className="navbar-time navbar-time-desktop">{formatTime(time)}</span>
        <div className="navbar-user">
          <span className="navbar-user-name">{user.nama || 'User'}</span>
          <span className="navbar-user-badge">{user.role || 'petugas'}</span>
        </div>
        <button
          onClick={handleLogout}
          className="btn btn-secondary btn-sm"
          title="Logout"
        >
          <MdLogout size={16} />
        </button>
      </div>
    </header>
  );
}
