import { useState, useEffect } from 'react';
import { MdPeople, MdDirectionsCar, MdLogin, MdExitToApp, MdRefresh } from 'react-icons/md';
import { FaMotorcycle, FaCar } from 'react-icons/fa';
import { getPengguna, getKendaraan, getParkir } from '../api/api';

export default function Dashboard() {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalPengguna: 0,
    totalKendaraan: 0,
    totalMasuk: 0,
    totalKeluar: 0,
    motorCount: 0,
    mobilCount: 0,
  });
  const [recentParkir, setRecentParkir] = useState([]);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const [pengguna, kendaraan, parkir] = await Promise.all([
        getPengguna(),
        getKendaraan(),
        getParkir(),
      ]);

      const parkirData = parkir.data;
      const kendaraanData = kendaraan.data;

      setStats({
        totalPengguna: pengguna.data.length,
        totalKendaraan: kendaraanData.length,
        totalMasuk: parkirData.filter(p => p.status_parkir === 'masuk').length,
        totalKeluar: parkirData.filter(p => p.status_parkir === 'keluar').length,
        motorCount: kendaraanData.filter(k => k.jenis_kendaraan === 'motor').length,
        mobilCount: kendaraanData.filter(k => k.jenis_kendaraan === 'mobil').length,
      });

      setRecentParkir(parkirData.slice(0, 5));
    } catch (err) {
      console.error('Error fetching stats:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const formatDateTime = (dt) => {
    if (!dt) return '-';
    return new Date(dt).toLocaleString('id-ID', {
      day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  };

  return (
    <div>
      {/* Page Header */}
      <div className="page-header">
        <div className="page-header-left">
          <h1>Dashboard</h1>
          <p>Selamat datang, <strong>{user.nama}</strong>! Berikut ringkasan data parkir hari ini.</p>
        </div>
        <button className="btn btn-outline btn-sm" onClick={fetchStats} disabled={loading}>
          <MdRefresh size={16} />
          Refresh
        </button>
      </div>

      {loading ? (
        <div className="spinner-container">
          <div className="spinner" />
        </div>
      ) : (
        <>
          {/* Stat Cards */}
          <div className="stats-grid">
            <div className="stat-card blue">
              <div className="stat-icon blue"><MdPeople /></div>
              <div className="stat-content">
                <div className="stat-number">{stats.totalPengguna}</div>
                <div className="stat-label">Total Pengguna Parkir</div>
              </div>
            </div>

            <div className="stat-card purple">
              <div className="stat-icon purple"><MdDirectionsCar /></div>
              <div className="stat-content">
                <div className="stat-number">{stats.totalKendaraan}</div>
                <div className="stat-label">Total Kendaraan Terdaftar</div>
              </div>
            </div>

            <div className="stat-card green">
              <div className="stat-icon green"><MdLogin /></div>
              <div className="stat-content">
                <div className="stat-number">{stats.totalMasuk}</div>
                <div className="stat-label">Kendaraan Sedang Parkir</div>
              </div>
            </div>

            <div className="stat-card red">
              <div className="stat-icon red"><MdExitToApp /></div>
              <div className="stat-content">
                <div className="stat-number">{stats.totalKeluar}</div>
                <div className="stat-label">Kendaraan Sudah Keluar</div>
              </div>
            </div>
          </div>

          {/* Vehicle Type Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
            <div className="stat-card yellow">
              <div className="stat-icon yellow"><FaMotorcycle /></div>
              <div className="stat-content">
                <div className="stat-number">{stats.motorCount}</div>
                <div className="stat-label">Total Motor Terdaftar</div>
              </div>
            </div>
            <div className="stat-card blue">
              <div className="stat-icon blue"><FaCar /></div>
              <div className="stat-content">
                <div className="stat-number">{stats.mobilCount}</div>
                <div className="stat-label">Total Mobil Terdaftar</div>
              </div>
            </div>
          </div>

          {/* Recent Parkir */}
          <div className="card">
            <div className="card-header">
              <h3>🕐 Aktivitas Parkir Terbaru</h3>
            </div>
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>No</th>
                    <th>Nama Pengguna</th>
                    <th>Plat Nomor</th>
                    <th>Jenis</th>
                    <th>Waktu Masuk</th>
                    <th>Waktu Keluar</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentParkir.length === 0 ? (
                    <tr>
                      <td colSpan="7" style={{ textAlign: 'center', padding: 32, color: '#9ca3af' }}>
                        Belum ada data parkir
                      </td>
                    </tr>
                  ) : (
                    recentParkir.map((item, idx) => (
                      <tr key={item.id_parkir}>
                        <td className="table-no">{idx + 1}</td>
                        <td style={{ fontWeight: 500 }}>{item.nama_pengguna}</td>
                        <td>
                          <span style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: 13, background: '#f1f5f9', padding: '2px 8px', borderRadius: 4 }}>
                            {item.plat_nomor}
                          </span>
                        </td>
                        <td>
                          <span className={`badge ${item.jenis_kendaraan === 'motor' ? 'badge-warning' : 'badge-primary'}`}>
                            {item.jenis_kendaraan === 'motor' ? '🏍️ Motor' : '🚗 Mobil'}
                          </span>
                        </td>
                        <td>{formatDateTime(item.waktu_masuk)}</td>
                        <td>{formatDateTime(item.waktu_keluar)}</td>
                        <td>
                          <span className={`badge ${item.status_parkir === 'masuk' ? 'badge-success' : 'badge-danger'}`}>
                            {item.status_parkir === 'masuk' ? '🟢 Masuk' : '🔴 Keluar'}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
