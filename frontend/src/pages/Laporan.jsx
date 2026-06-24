import { useState } from 'react';
import { MdAssessment, MdSearch, MdLogin, MdExitToApp } from 'react-icons/md';
import { getLaporanParkir } from '../api/api';

export default function Laporan() {
  const [data, setData] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetched, setFetched] = useState(false);
  const [filter, setFilter] = useState({ tanggal_awal: '', tanggal_akhir: '', area_parkir: '' });
  const [alert, setAlert] = useState(null);

  const today = new Date().toISOString().split('T')[0];

  const handleChange = (e) => {
    setFilter({ ...filter, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (filter.tanggal_awal && filter.tanggal_akhir && filter.tanggal_awal > filter.tanggal_akhir) {
      setAlert({ type: 'error', msg: 'Tanggal awal tidak boleh lebih besar dari tanggal akhir' });
      return;
    }
    setLoading(true);
    setAlert(null);
    try {
      const params = {};
      if (filter.tanggal_awal) params.tanggal_awal = filter.tanggal_awal;
      if (filter.tanggal_akhir) params.tanggal_akhir = filter.tanggal_akhir;
      if (filter.area_parkir) params.area_parkir = filter.area_parkir;

      const res = await getLaporanParkir(params);
      setData(res.data.data);
      setSummary(res.data.summary);
      setFetched(true);
    } catch (err) {
      setAlert({ type: 'error', msg: 'Gagal memuat laporan' });
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFilter({ tanggal_awal: '', tanggal_akhir: '', area_parkir: '' });
    setData([]);
    setSummary(null);
    setFetched(false);
    setAlert(null);
  };

  const formatDateTime = (dt) => {
    if (!dt) return '-';
    return new Date(dt).toLocaleString('id-ID', {
      day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  };

  const formatDate = (d) => {
    if (!d) return '-';
    return new Date(d + 'T00:00:00').toLocaleDateString('id-ID', {
      day: 'numeric', month: 'long', year: 'numeric',
    });
  };

  return (
    <div>
      {/* Header */}
      <div className="page-header">
        <div className="page-header-left">
          <h1>Laporan Parkir</h1>
          <p>Generate laporan parkir berdasarkan rentang periode waktu.</p>
        </div>
      </div>

      {/* Alert */}
      {alert && (
        <div className={`alert alert-${alert.type === 'success' ? 'success' : 'error'}`}>
          {alert.type === 'success' ? '✅' : '⚠️'} {alert.msg}
        </div>
      )}

      {/* Filter Card */}
      <div className="card" style={{ marginBottom: 20 }}>
        <div className="card-header">
          <h3>🔍 Filter Laporan</h3>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'flex-end' }}>
              <div className="form-group" style={{ flex: 1, minWidth: 180, marginBottom: 0 }}>
                <label className="form-label">Tanggal Awal</label>
                <input
                  id="input-tanggal-awal"
                  type="date"
                  name="tanggal_awal"
                  className="form-control"
                  value={filter.tanggal_awal}
                  onChange={handleChange}
                  max={today}
                />
              </div>
              <div className="form-group" style={{ flex: 1, minWidth: 180, marginBottom: 0 }}>
                <label className="form-label">Tanggal Akhir</label>
                <input
                  id="input-tanggal-akhir"
                  type="date"
                  name="tanggal_akhir"
                  className="form-control"
                  value={filter.tanggal_akhir}
                  onChange={handleChange}
                  max={today}
                />
              </div>
              <div className="form-group" style={{ flex: 1, minWidth: 180, marginBottom: 0 }}>
                <label className="form-label">Area Parkir</label>
                <select
                  name="area_parkir"
                  className="form-control"
                  value={filter.area_parkir}
                  onChange={handleChange}
                >
                  <option value="">Semua Area</option>
                  <option value="Gedung Kuliah Bersama (GKB)">Gedung Kuliah Bersama (GKB)</option>
                  <option value="Area Gedung Software">Area Gedung Software</option>
                  <option value="Gedung Laboratorium Analisis">Gedung Laboratorium Analisis</option>
                  <option value="Kantin Lama">Kantin Lama</option>
                </select>
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                <button type="submit" className="btn btn-primary" disabled={loading} id="btn-cari-laporan">
                  {loading ? '⏳ Memuat...' : <><MdSearch size={16} /> Tampilkan</>}
                </button>
                <button type="button" className="btn btn-secondary" onClick={handleReset} disabled={loading}>
                  Reset
                </button>
              </div>
            </div>
            {!filter.tanggal_awal && !filter.tanggal_akhir && (
              <p style={{ fontSize: 12, color: '#9ca3af', marginTop: 10 }}>
                ℹ️ Biarkan kosong untuk menampilkan seluruh data parkir.
              </p>
            )}
          </form>
        </div>
      </div>

      {/* Summary Cards */}
      {summary && (
        <>
          {/* Periode Info */}
          {(filter.tanggal_awal || filter.tanggal_akhir) && (
            <div className="alert alert-warning" style={{ marginBottom: 16 }}>
              📅 Periode: {filter.tanggal_awal ? formatDate(filter.tanggal_awal) : 'Awal'} —{' '}
              {filter.tanggal_akhir ? formatDate(filter.tanggal_akhir) : 'Sekarang'}
              {filter.area_parkir && ` | 📍 Area: ${filter.area_parkir}`}
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 20 }}>
            <div className="stat-card blue">
              <div className="stat-icon blue"><MdAssessment /></div>
              <div className="stat-content">
                <div className="stat-number">{summary.total}</div>
                <div className="stat-label">Total Transaksi</div>
              </div>
            </div>
            <div className="stat-card green">
              <div className="stat-icon green"><MdLogin /></div>
              <div className="stat-content">
                <div className="stat-number">{summary.masuk}</div>
                <div className="stat-label">Kendaraan Sedang Parkir</div>
              </div>
            </div>
            <div className="stat-card red">
              <div className="stat-icon red"><MdExitToApp /></div>
              <div className="stat-content">
                <div className="stat-number">{summary.keluar}</div>
                <div className="stat-label">Kendaraan Sudah Keluar</div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Table */}
      {fetched && (
        <div className="card">
          <div className="card-header">
            <h3>📊 Data Laporan ({data.length} transaksi)</h3>
            {data.length > 0 && (
              <span style={{ fontSize: 12, color: '#6b7280' }}>
                Menampilkan {data.length} data
              </span>
            )}
          </div>

          {data.length === 0 ? (
            <div className="card-body">
              <div className="empty-state">
                <span className="empty-state-icon">📭</span>
                <p>Tidak ada data parkir untuk periode yang dipilih</p>
              </div>
            </div>
          ) : (
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>No</th>
                    <th>Nama Pengguna</th>
                    <th>Status</th>
                    <th>Plat Nomor</th>
                    <th>Jenis</th>
                    <th>Area Parkir</th>
                    <th>Waktu Masuk</th>
                    <th>Waktu Keluar</th>
                    <th>Petugas</th>
                    <th>Status Parkir</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((item, idx) => (
                    <tr key={item.id_parkir}>
                      <td className="table-no">{idx + 1}</td>
                      <td style={{ fontWeight: 600 }}>{item.nama_pengguna}</td>
                      <td>
                        <span className="badge badge-gray" style={{ textTransform: 'capitalize' }}>
                          {item.status_pengguna}
                        </span>
                      </td>
                      <td>
                        <span style={{
                          fontFamily: 'monospace', fontWeight: 700, fontSize: 12.5,
                          background: '#f1f5f9', padding: '2px 8px', borderRadius: 4,
                        }}>
                          {item.plat_nomor}
                        </span>
                      </td>
                      <td>
                        <span className={`badge ${item.jenis_kendaraan === 'motor' ? 'badge-warning' : 'badge-primary'}`}>
                          {item.jenis_kendaraan === 'motor' ? '🏍️' : '🚗'} {item.jenis_kendaraan}
                        </span>
                      </td>
                      <td style={{ fontSize: 12.5, color: '#4b5563', fontWeight: 500 }}>{item.area_parkir}</td>
                      <td style={{ fontSize: 12.5 }}>{formatDateTime(item.waktu_masuk)}</td>
                      <td style={{ fontSize: 12.5 }}>{formatDateTime(item.waktu_keluar)}</td>
                      <td style={{ fontSize: 12.5 }}>{item.nama_petugas}</td>
                      <td>
                        <span className={`badge ${item.status_parkir === 'masuk' ? 'badge-success' : 'badge-danger'}`}>
                          {item.status_parkir === 'masuk' ? '🟢 Parkir' : '🔴 Keluar'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {!fetched && !loading && (
        <div className="card">
          <div className="card-body">
            <div className="empty-state">
              <span className="empty-state-icon">📊</span>
              <p style={{ fontWeight: 600, color: '#374151', marginBottom: 6 }}>Laporan Belum Ditampilkan</p>
              <p>Gunakan filter di atas untuk menampilkan laporan. Biarkan kolom tanggal kosong untuk melihat semua data.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
