import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import MasterData from './pages/MasterData';
import ParkirMasuk from './pages/ParkirMasuk';
import ParkirKeluar from './pages/ParkirKeluar';
import Riwayat from './pages/Riwayat';
import Laporan from './pages/Laporan';
import SmartDashboard from './pages/SmartDashboard';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';

// Guard untuk protected routes
function ProtectedLayout() {
  const token = localStorage.getItem('token');
  if (!token) return <Navigate to="/login" replace />;

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  // Auto Logout setelah 5 menit (300000 ms)
  useEffect(() => {
    let timeoutId;

    const resetTimer = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        // Logout user
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        sessionStorage.removeItem('petugasName');
        alert('Sesi Anda telah berakhir karena tidak ada aktivitas selama 5 menit. Silakan login kembali.');
        navigate('/login', { replace: true });
      }, 300000); // 5 menit
    };

    // Pasang listener untuk aktivitas
    const events = ['mousemove', 'keydown', 'click', 'scroll'];
    events.forEach(event => window.addEventListener(event, resetTimer));

    // Mulai timer pertama kali
    resetTimer();

    return () => {
      clearTimeout(timeoutId);
      events.forEach(event => window.removeEventListener(event, resetTimer));
    };
  }, [navigate]);

  const toggleSidebar = () => setSidebarOpen(prev => !prev);
  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="app-layout">
      {/* Overlay gelap saat sidebar terbuka di mobile */}
      {sidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={closeSidebar}
        />
      )}
      <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />
      <div className="main-content">
        <Navbar onToggleSidebar={toggleSidebar} />
        <main className="page-content">
          <Routes>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/smart-dashboard" element={<SmartDashboard />} />
            <Route path="/master-data" element={<MasterData />} />
            <Route path="/parkir-masuk" element={<ParkirMasuk />} />
            <Route path="/parkir-keluar" element={<ParkirKeluar />} />
            <Route path="/riwayat" element={<Riwayat />} />
            <Route path="/laporan" element={<Laporan />} />
            <Route path="*" element={<Navigate to="/smart-dashboard" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/*" element={<ProtectedLayout />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
