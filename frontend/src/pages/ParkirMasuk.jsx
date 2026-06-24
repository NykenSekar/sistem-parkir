import { useState, useEffect } from 'react';
import { MdLogin, MdDirectionsCar, MdPerson } from 'react-icons/md';
import { FaCar } from 'react-icons/fa';
import { getKendaraan, parkirMasuk } from '../api/api';

const AREA_MAP = {
  'admin_gkb': 'Gedung Kuliah Bersama (GKB)',
  'admin_software': 'Area Gedung Software',
  'admin_lab': 'Gedung Laboratorium Analisis',
  'admin_kantin': 'Kantin Lama'
};

export default function ParkirMasuk() {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const defaultArea = AREA_MAP[user.username] || 'Gedung Kuliah Bersama (GKB)';

  const [kendaraan, setKendaraan] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ id_kendaraan: '', id_petugas: '', area_parkir: defaultArea });
  const [alert, setAlert] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [successData, setSuccessData] = useState(null);

  const fetchKendaraan = async () => {
    setLoading(true);
    try {
      const res = await getKendaraan();
      setKendaraan(res.data);
    } catch (err) {
      showAlert('error', 'Gagal memuat data kendaraan');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKendaraan();
    // Set petugas dari user yang login
    setForm(f => ({ ...f, id_petugas: String(user.id_user || '') }));
  }, []);

  const showAlert = (type, msg) => {
    setAlert({ type, msg });
    setTimeout(() => setAlert(null), 4000);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.id_kendaraan || !form.id_petugas) {
      showAlert('error', 'Kendaraan dan petugas wajib dipilih');
      return;
    }
    setSubmitting(true);
    setSuccessData(null);
    try {
      const res = await parkirMasuk({
        id_kendaraan: parseInt(form.id_kendaraan),
        id_petugas: parseInt(form.id_petugas),
        area_parkir: form.area_parkir
      });
      const selectedKendaraan = kendaraan.find(k => k.id_kendaraan === parseInt(form.id_kendaraan));
      setSuccessData({
        ...res.data,
        plat_nomor: selectedKendaraan?.plat_nomor,
        nama_pengguna: selectedKendaraan?.nama_pengguna,
        jenis_kendaraan: selectedKendaraan?.jenis_kendaraan,
        merk: selectedKendaraan?.merk,
      });
      showAlert('success', res.data.message);
      setForm({ id_kendaraan: '', id_petugas: String(user.id_user || ''), area_parkir: defaultArea });
    } catch (err) {
      showAlert('error', err.response?.data?.message || 'Gagal mencatat kendaraan masuk');
    } finally {
      setSubmitting(false);
    }
  };

  const formatDateTime = (dt) => {
    if (!dt) return '-';
    return new Date(dt).toLocaleString('id-ID', {
      weekday: 'long',
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  const selectedKendaraan = kendaraan.find(k => k.id_kendaraan === parseInt(form.id_kendaraan));

  return (
    <div>
      {/* Header */}
      <div className="page-header">
        <div className="page-header-left">
          <h1>Parkir Masuk</h1>
          <p>Catat kendaraan yang memasuki area parkir Politeknik Negeri Lampung.</p>
        </div>
      </div>

      {/* Alert */}
      {alert && (
        <div className={`alert alert-${alert.type === 'success' ? 'success' : 'error'}`}>
          {alert.type === 'success' ? '✅' : '⚠️'} {alert.msg}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, alignItems: 'start' }}>
        {/* Form Card */}
        <div className="card">
          <div className="card-header">
            <h3><MdLogin style={{ verticalAlign: -3, marginRight: 6 }} />Form Kendaraan Masuk</h3>
          </div>
          <div className="card-body">
            {loading ? (
              <div className="spinner-container"><div className="spinner" /></div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label className="form-label">Pilih Kendaraan <span className="required">*</span></label>
                  <select
                    id="select-kendaraan-masuk"
                    name="id_kendaraan"
                    className="form-control"
                    value={form.id_kendaraan}
                    onChange={handleChange}
                    required
                  >
                    <option value="">-- Pilih Kendaraan --</option>
                    {kendaraan.map(k => (
                      <option key={k.id_kendaraan} value={k.id_kendaraan}>
                        {k.plat_nomor} - {k.nama_pengguna} ({k.jenis_kendaraan})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Arahkan Area Parkir <span className="required">*</span></label>
                  <select
                    id="select-area-parkir"
                    name="area_parkir"
                    className="form-control"
                    value={form.area_parkir}
                    onChange={handleChange}
                    required
                    disabled
                    style={{ background: '#f9fafb', color: '#6b7280', cursor: 'not-allowed' }}
                  >
                    <option value="Gedung Kuliah Bersama (GKB)">Gedung Kuliah Bersama (GKB)</option>
                    <option value="Area Gedung Software">Area Gedung Software</option>
                    <option value="Gedung Laboratorium Analisis">Gedung Laboratorium Analisis</option>
                    <option value="Kantin Lama">Kantin Lama</option>
                  </select>
                </div>

                {/* Preview kendaraan */}
                {selectedKendaraan && (
                  <div style={{
                    background: 'linear-gradient(135deg, #eff6ff, #dbeafe)',
                    border: '1.5px solid #bfdbfe',
                    borderRadius: 10,
                    padding: '14px',
                    marginBottom: 16,
                  }}>
                    <div style={{ fontWeight: 700, fontSize: 13, color: '#1d4ed8', marginBottom: 8 }}>
                      Detail Kendaraan:
                    </div>
                    <div style={{ fontSize: 13, color: '#374151', lineHeight: 1.8 }}>
                      <div>👤 <strong>Pemilik:</strong> {selectedKendaraan.nama_pengguna}</div>
                      <div>🚘 <strong>Plat Nomor:</strong> {selectedKendaraan.plat_nomor}</div>
                      <div>🏷️ <strong>Jenis:</strong> {selectedKendaraan.jenis_kendaraan}</div>
                      {selectedKendaraan.merk && <div>🔧 <strong>Merk:</strong> {selectedKendaraan.merk} ({selectedKendaraan.warna})</div>}
                    </div>
                  </div>
                )}

                <div className="form-group">
                  <label className="form-label">Petugas <span className="required">*</span></label>
                  <input
                    id="input-petugas-masuk"
                    type="text"
                    className="form-control"
                    value={user.nama || 'Petugas'}
                    disabled
                    style={{ background: '#f9fafb', color: '#6b7280' }}
                  />
                  <input type="hidden" name="id_petugas" value={form.id_petugas} />
                </div>

                <div className="form-group">
                  <label className="form-label">Waktu Masuk</label>
                  <input
                    type="text"
                    className="form-control"
                    value={new Date().toLocaleString('id-ID')}
                    disabled
                    style={{ background: '#f9fafb', color: '#6b7280' }}
                  />
                </div>

                <div className="form-actions" style={{ borderTop: 'none', paddingTop: 0, marginTop: 8 }}>
                  <button
                    type="submit"
                    className="btn btn-success"
                    style={{ width: '100%', padding: '11px', fontSize: 15 }}
                    disabled={submitting || !form.id_kendaraan}
                    id="btn-submit-masuk"
                  >
                    {submitting ? (
                      <>⏳ Memproses...</>
                    ) : (
                      <><MdLogin size={18} /> Catat Kendaraan Masuk</>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Success Ticket */}
        <div>
          {successData ? (
            <div className="card" style={{ border: '2px solid #10b981' }}>
              <div className="card-header" style={{ background: 'linear-gradient(135deg, #d1fae5, #a7f3d0)', borderBottom: '1px solid #6ee7b7' }}>
                <h3 style={{ color: '#065f46' }}>✅ Kendaraan Berhasil Dicatat Masuk!</h3>
              </div>
              <div className="card-body">
                <div style={{
                  background: '#f9fafb',
                  borderRadius: 10,
                  padding: '20px',
                  border: '1px dashed #d1d5db',
                  textAlign: 'center',
                }}>
                  <div style={{ fontSize: 40, marginBottom: 8 }}>
                    {successData.jenis_kendaraan === 'motor' ? '🏍️' : '🚗'}
                  </div>
                  <div style={{
                    fontFamily: 'monospace',
                    fontSize: 26,
                    fontWeight: 900,
                    color: '#1f2937',
                    background: '#fff',
                    border: '3px solid #111827',
                    borderRadius: 8,
                    padding: '8px 20px',
                    display: 'inline-block',
                    marginBottom: 12,
                  }}>
                    {successData.plat_nomor}
                  </div>
                  <div style={{ fontSize: 13, color: '#6b7280', lineHeight: 2 }}>
                    <div>👤 <strong style={{ color: '#374151' }}>{successData.nama_pengguna}</strong></div>
                    <div>🚘 {successData.jenis_kendaraan} {successData.merk && `- ${successData.merk}`}</div>
                    <div>🕐 <strong style={{ color: '#374151' }}>{formatDateTime(successData.waktu_masuk)}</strong></div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="card">
              <div className="card-body">
                <div className="empty-state">
                  <span className="empty-state-icon">🅿️</span>
                  <p style={{ fontWeight: 600, color: '#374151', marginBottom: 4 }}>Panduan Parkir Masuk</p>
                  <p>Pilih kendaraan dari dropdown, kemudian klik tombol "Catat Kendaraan Masuk". Tiket masuk akan ditampilkan di sini.</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
