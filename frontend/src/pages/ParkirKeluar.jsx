import { useState, useEffect } from 'react';
import { MdExitToApp, MdRefresh } from 'react-icons/md';
import { getParkirAktif, parkirKeluar } from '../api/api';

export default function ParkirKeluar() {
  const [parkirAktif, setParkirAktif] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);
  const [submitting, setSubmitting] = useState(null);
  const [successData, setSuccessData] = useState(null);

  const fetchParkirAktif = async () => {
    setLoading(true);
    try {
      const res = await getParkirAktif();
      setParkirAktif(res.data);
    } catch (err) {
      showAlert('error', 'Gagal memuat data parkir aktif');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchParkirAktif(); }, []);

  const showAlert = (type, msg) => {
    setAlert({ type, msg });
    setTimeout(() => setAlert(null), 4000);
  };

  const handleKeluar = async (item) => {
    setSubmitting(item.id_parkir);
    setSuccessData(null);
    try {
      const res = await parkirKeluar(item.id_parkir);
      setSuccessData({
        ...res.data,
        plat_nomor: item.plat_nomor,
        nama_pengguna: item.nama_pengguna,
        jenis_kendaraan: item.jenis_kendaraan,
        waktu_masuk: item.waktu_masuk,
      });
      showAlert('success', `Kendaraan ${item.plat_nomor} berhasil dicatat keluar`);
      fetchParkirAktif();
    } catch (err) {
      showAlert('error', err.response?.data?.message || 'Gagal mencatat keluar');
    } finally {
      setSubmitting(null);
    }
  };

  const formatDateTime = (dt) => {
    if (!dt) return '-';
    return new Date(dt).toLocaleString('id-ID', {
      day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  };

  const formatDuration = (masuk, keluar) => {
    if (!masuk || !keluar) return '-';
    const diff = new Date(keluar) - new Date(masuk);
    const h = Math.floor(diff / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    if (h === 0) return `${m} menit`;
    return `${h} jam ${m} menit`;
  };

  const filteredParkir = parkirAktif.filter(item => 
    item.plat_nomor?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    item.nama_pengguna?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      {/* Header */}
      <div className="page-header">
        <div className="page-header-left">
          <h1>Parkir Keluar</h1>
          <p>Catat kendaraan yang keluar dari area parkir. Menampilkan kendaraan yang masih berada di dalam.</p>
        </div>
        <button className="btn btn-outline btn-sm" onClick={fetchParkirAktif} disabled={loading}>
          <MdRefresh size={16} />
          Refresh
        </button>
      </div>

      {/* Alert */}
      {alert && (
        <div className={`alert alert-${alert.type === 'success' ? 'success' : 'error'}`}>
          {alert.type === 'success' ? '✅' : '⚠️'} {alert.msg}
        </div>
      )}

      {/* Summary Card */}
      {!loading && (
        <div style={{ display: 'flex', gap: 16, marginBottom: 20 }}>
          <div style={{
            background: 'linear-gradient(135deg, #d1fae5, #a7f3d0)',
            border: '1.5px solid #6ee7b7',
            borderRadius: 12,
            padding: '14px 20px',
            display: 'flex',
            alignItems: 'center',
            gap: 12,
          }}>
            <span style={{ fontSize: 28 }}>🅿️</span>
            <div>
              <div style={{ fontSize: 24, fontWeight: 800, color: '#065f46' }}>{parkirAktif.length}</div>
              <div style={{ fontSize: 12, color: '#047857' }}>Kendaraan sedang parkir</div>
            </div>
          </div>
        </div>
      )}

      {/* Success Card */}
      {successData && (
        <div className="card" style={{ marginBottom: 20, border: '2px solid #ef4444' }}>
          <div className="card-header" style={{ background: 'linear-gradient(135deg, #fee2e2, #fecaca)', borderBottom: '1px solid #fca5a5' }}>
            <h3 style={{ color: '#991b1b' }}>🚦 Kendaraan Berhasil Dicatat Keluar!</h3>
          </div>
          <div className="card-body">
            <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', alignItems: 'center' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 36 }}>{successData.jenis_kendaraan === 'motor' ? '🏍️' : '🚗'}</div>
                <div style={{
                  fontFamily: 'monospace', fontSize: 20, fontWeight: 900,
                  border: '2px solid #111827', borderRadius: 6, padding: '4px 14px',
                  background: '#fff', marginTop: 6,
                }}>
                  {successData.plat_nomor}
                </div>
              </div>
              <div style={{ flex: 1, lineHeight: 2, fontSize: 13 }}>
                <div>👤 <strong>{successData.nama_pengguna}</strong></div>
                <div>🕐 Masuk: <strong>{formatDateTime(successData.waktu_masuk)}</strong></div>
                <div>🕑 Keluar: <strong>{formatDateTime(successData.waktu_keluar)}</strong></div>
                <div>⏱️ Durasi: <strong style={{ color: '#2563eb' }}>{formatDuration(successData.waktu_masuk, successData.waktu_keluar)}</strong></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Table Kendaraan Aktif */}
      <div className="card">
        <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ margin: 0 }}>🟢 Kendaraan Sedang Parkir ({filteredParkir.length})</h3>
          <input
            type="text"
            className="form-control"
            style={{ width: '250px', padding: '6px 12px', fontSize: '13px' }}
            placeholder="Cari plat atau nama..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {loading ? (
          <div className="spinner-container"><div className="spinner" /></div>
        ) : (
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>No</th>
                  <th>Plat Nomor</th>
                  <th>Nama Pengguna</th>
                  <th>Jenis</th>
                  <th>Merk</th>
                  <th>Waktu Masuk</th>
                  <th>Durasi</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredParkir.length === 0 ? (
                  <tr>
                    <td colSpan="8">
                      <div className="empty-state">
                        <span className="empty-state-icon">✨</span>
                        <p>Tidak ada kendaraan yang sedang parkir saat ini.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredParkir.map((item, idx) => (
                    <tr key={item.id_parkir}>
                      <td className="table-no">{idx + 1}</td>
                      <td>
                        <span style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: 13, background: '#f1f5f9', padding: '2px 8px', borderRadius: 4 }}>
                          {item.plat_nomor}
                        </span>
                      </td>
                      <td style={{ fontWeight: 600 }}>{item.nama_pengguna}</td>
                      <td>
                        <span className={`badge ${item.jenis_kendaraan === 'motor' ? 'badge-warning' : 'badge-primary'}`}>
                          {item.jenis_kendaraan === 'motor' ? '🏍️' : '🚗'} {item.jenis_kendaraan}
                        </span>
                      </td>
                      <td>{item.merk || '-'}</td>
                      <td>{formatDateTime(item.waktu_masuk)}</td>
                      <td>
                        <span style={{ fontSize: 12, color: '#2563eb', fontWeight: 600 }}>
                          {formatDuration(item.waktu_masuk, new Date())}
                        </span>
                      </td>
                      <td>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleKeluar(item)}
                          disabled={submitting === item.id_parkir}
                          id={`btn-keluar-${item.id_parkir}`}
                        >
                          <MdExitToApp size={14} />
                          {submitting === item.id_parkir ? 'Memproses...' : 'Catat Keluar'}
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
