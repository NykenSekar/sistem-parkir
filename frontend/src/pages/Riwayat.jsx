import { useState, useEffect } from 'react';
import { MdSearch, MdHistory, MdRefresh } from 'react-icons/md';
import { getParkir } from '../api/api';

export default function Riwayat() {
  const [data, setData] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await getParkir();
      setData(res.data);
      setFiltered(res.data);
    } catch (err) {
      console.error('Gagal memuat riwayat:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  useEffect(() => {
    const q = search.toLowerCase();
    setFiltered(
      data.filter(d => {
        const matchSearch =
          d.plat_nomor?.toLowerCase().includes(q) ||
          d.nama_pengguna?.toLowerCase().includes(q) ||
          d.nama_petugas?.toLowerCase().includes(q);
        const matchStatus = filterStatus ? d.status_parkir === filterStatus : true;
        return matchSearch && matchStatus;
      })
    );
  }, [search, filterStatus, data]);

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
    if (diff < 0) return '-';
    const h = Math.floor(diff / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    if (h === 0) return `${m} mnt`;
    return `${h}j ${m}m`;
  };

  return (
    <div>
      {/* Header */}
      <div className="page-header">
        <div className="page-header-left">
          <h1>Riwayat Parkir</h1>
          <p>Lihat seluruh riwayat transaksi parkir kendaraan.</p>
        </div>
        <button className="btn btn-outline btn-sm" onClick={fetchData} disabled={loading}>
          <MdRefresh size={16} />
          Refresh
        </button>
      </div>

      {/* Card */}
      <div className="card">
        <div className="card-header" style={{ flexWrap: 'wrap', gap: 12 }}>
          <h3><MdHistory style={{ verticalAlign: -3, marginRight: 6 }} />Semua Riwayat ({filtered.length})</h3>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            {/* Filter Status */}
            <select
              id="filter-status-riwayat"
              className="form-control"
              style={{ width: 'auto', padding: '7px 30px 7px 10px', fontSize: 13 }}
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="">Semua Status</option>
              <option value="masuk">Sedang Parkir</option>
              <option value="keluar">Sudah Keluar</option>
            </select>
            {/* Search */}
            <div className="search-bar" style={{ width: 240 }}>
              <MdSearch className="search-icon" />
              <input
                id="search-riwayat"
                type="text"
                placeholder="Cari plat, nama, petugas..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </div>

        {loading ? (
          <div className="spinner-container"><div className="spinner" /></div>
        ) : (
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
                  <th>Durasi</th>
                  <th>Petugas</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan="9">
                      <div className="empty-state">
                        <span className="empty-state-icon">📋</span>
                        <p>{search || filterStatus ? 'Data tidak ditemukan' : 'Belum ada riwayat parkir'}</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filtered.map((item, idx) => (
                    <tr key={item.id_parkir}>
                      <td className="table-no">{idx + 1}</td>
                      <td style={{ fontWeight: 600 }}>{item.nama_pengguna}</td>
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
                      <td style={{ fontSize: 12.5 }}>{formatDateTime(item.waktu_masuk)}</td>
                      <td style={{ fontSize: 12.5 }}>{formatDateTime(item.waktu_keluar)}</td>
                      <td>
                        <span style={{ fontSize: 12, fontWeight: 600, color: '#2563eb' }}>
                          {formatDuration(item.waktu_masuk, item.waktu_keluar)}
                        </span>
                      </td>
                      <td style={{ fontSize: 12.5 }}>{item.nama_petugas}</td>
                      <td>
                        <span className={`badge ${item.status_parkir === 'masuk' ? 'badge-success' : 'badge-danger'}`}>
                          {item.status_parkir === 'masuk' ? '🟢 Parkir' : '🔴 Keluar'}
                        </span>
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
