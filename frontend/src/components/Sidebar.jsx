import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  IdCard,
  ArrowRightToLine,
  ArrowLeftFromLine,
  History,
  FileBarChart,
  LogOut,
  CarFront,
  X
} from 'lucide-react';

const navItems = [
  { to: '/smart-dashboard', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
];

const masterItems = [
  { to: '/master-data', icon: <IdCard size={20} />, label: 'Registrasi Master' },
];

const parkirItems = [
  { to: '/parkir-masuk', icon: <ArrowRightToLine size={20} />, label: 'Parkir Masuk' },
  { to: '/parkir-keluar', icon: <ArrowLeftFromLine size={20} />, label: 'Parkir Keluar' },
];

const laporanItems = [
  { to: '/riwayat', icon: <History size={20} />, label: 'Riwayat Akses' },
  { to: '/laporan', icon: <FileBarChart size={20} />, label: 'Laporan' },
];

export default function Sidebar({ isOpen, onClose }) {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    sessionStorage.removeItem('petugasName');
    navigate('/login');
  };

  const getInitial = (name) => {
    if (!name) return 'U';
    return name.charAt(0).toUpperCase();
  };

  // Saat link diklik di mobile, tutup sidebar otomatis
  const handleNavClick = () => {
    if (onClose) onClose();
  };

  return (
    <aside className={`sidebar${isOpen ? ' open' : ''}`}>
      {/* Brand */}
      <div className="sidebar-brand" style={{ gap: '12px', padding: '24px 20px', position: 'relative' }}>
        <div className="sidebar-brand-icon" style={{ background: 'var(--navy-teal)', color: 'white', padding: '8px', borderRadius: '12px' }}>
          <CarFront size={24} />
        </div>
        <div className="sidebar-brand-text">
          <div className="sidebar-brand-title" style={{ color: 'var(--navy-teal)', fontSize: '20px' }}>SiParkir</div>
          <div className="sidebar-brand-subtitle" style={{ color: '#64748b' }}>Politeknik Negeri Lampung</div>
        </div>
        {/* Tombol tutup hanya di mobile */}
        <button
          className="sidebar-close-btn"
          onClick={onClose}
          aria-label="Tutup menu"
        >
          <X size={20} />
        </button>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={handleNavClick}
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
            style={({ isActive }) => isActive ? { background: 'var(--navy-teal-light)', color: 'var(--navy-teal)', borderRight: '3px solid var(--navy-teal)' } : {}}
          >
            <span className="link-icon">{item.icon}</span>
            {item.label}
          </NavLink>
        ))}

        <div className="sidebar-section-title">Master Data</div>
        {masterItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={handleNavClick}
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
            style={({ isActive }) => isActive ? { background: 'var(--navy-teal-light)', color: 'var(--navy-teal)', borderRight: '3px solid var(--navy-teal)' } : {}}
          >
            <span className="link-icon">{item.icon}</span>
            {item.label}
          </NavLink>
        ))}

        <div className="sidebar-section-title">Transaksi Parkir</div>
        {parkirItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={handleNavClick}
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
            style={({ isActive }) => isActive ? { background: 'var(--navy-teal-light)', color: 'var(--navy-teal)', borderRight: '3px solid var(--navy-teal)' } : {}}
          >
            <span className="link-icon">{item.icon}</span>
            {item.label}
          </NavLink>
        ))}

        <div className="sidebar-section-title">Laporan</div>
        {laporanItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={handleNavClick}
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
            style={({ isActive }) => isActive ? { background: 'var(--navy-teal-light)', color: 'var(--navy-teal)', borderRight: '3px solid var(--navy-teal)' } : {}}
          >
            <span className="link-icon">{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="sidebar-footer" style={{ borderTop: '1px solid #e2e8f0', padding: '20px' }}>
        <div className="sidebar-user" style={{ marginBottom: '16px' }}>
          <div className="sidebar-user-avatar" style={{ background: 'var(--navy-teal)', color: 'white' }}>{getInitial(user.nama)}</div>
          <div className="sidebar-user-info">
            <div className="sidebar-user-name" style={{ color: 'var(--navy-teal)', fontWeight: 700 }}>{user.nama || 'Pengguna'}</div>
            <div className="sidebar-user-role">{user.role || 'petugas'}</div>
          </div>
        </div>
        <button className="btn-logout" onClick={handleLogout} style={{ width: '100%', display: 'flex', justifyContent: 'center', gap: '8px', background: 'var(--soft-red-light)', color: 'var(--soft-red)', padding: '10px', borderRadius: '8px', border: 'none', fontWeight: 600, cursor: 'pointer' }}>
          <LogOut size={18} />
          Keluar Sistem
        </button>
      </div>
    </aside>
  );
}
