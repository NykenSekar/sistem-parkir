import { useState, useEffect } from 'react';
import api from '../api/api';
import { Search, Plus, Save, X, Trash2, UserCheck, Car, User, ShieldCheck, BadgeCheck } from 'lucide-react';
import '../smart-dashboard.css'; // Import premium styles
export default function MasterData() {
  const [data, setData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Combined form state
  const [formData, setFormData] = useState({
    nama: '',
    status_pengguna: 'mahasiswa',
    no_identitas: '',
    no_hp: '',
    plat_nomor: '',
    jenis_kendaraan: 'motor',
    merk: '',
    warna: ''
  });

  const loadData = async () => {
    try {
      // Endpoint kendaraan mengembalikan join pengguna_parkir dan kendaraan
      const response = await api.get('/kendaraan');
      setData(response.data);
    } catch (error) {
      console.error('Gagal load data', error);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // 1. Simpan Data Pengguna
      const resPengguna = await api.post('/pengguna', {
        nama: formData.nama,
        status_pengguna: formData.status_pengguna,
        no_identitas: formData.no_identitas,
        no_hp: formData.no_hp
      });

      const id_pengguna = resPengguna.data.id;

      // 2. Simpan Data Kendaraan menggunakan id_pengguna
      await api.post('/kendaraan', {
        id_pengguna: id_pengguna,
        plat_nomor: formData.plat_nomor,
        jenis_kendaraan: formData.jenis_kendaraan,
        merk: formData.merk,
        warna: formData.warna
      });

      alert('Registrasi berhasil!');
      setIsModalOpen(false);
      resetForm();
      loadData();
    } catch (error) {
      alert(error.response?.data?.message || 'Terjadi kesalahan saat registrasi');
    }
  };

  const handleDelete = async (id_kendaraan, id_pengguna) => {
    if (window.confirm('Yakin ingin menghapus data ini? (Akan menghapus kendaraan dan pengguna sekaligus jika ini kendaraan satu-satunya)')) {
      try {
        await api.delete(`/kendaraan/${id_kendaraan}`);
        // Jika perlu, hapus pengguna juga: await api.delete(`/pengguna/${id_pengguna}`);
        loadData();
      } catch (error) {
        alert('Gagal menghapus data');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      nama: '', status_pengguna: 'mahasiswa', no_identitas: '', no_hp: '',
      plat_nomor: '', jenis_kendaraan: 'motor', merk: '', warna: ''
    });
  };

  const filteredData = data.filter(item => 
    item.nama?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    item.plat_nomor?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.no_identitas?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bento-container" style={{ maxWidth: '100%', paddingBottom: '30px' }}>
      
      {/* Header Section */}
      <div className="bento-header" style={{ marginBottom: '0', padding: '0 0 20px 0', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div className="smart-greeting">
          <h2 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <BadgeCheck size={26} color="var(--emerald-green)" />
            Registrasi Master
          </h2>
          <p style={{ marginTop: '4px' }}>Kelola data identitas pengguna dan kendaraan kampus terintegrasi.</p>
        </div>
        <button 
          className="btn btn-primary" 
          onClick={() => setIsModalOpen(true)}
          style={{ background: 'var(--navy-teal)', padding: '10px 20px', borderRadius: '10px', boxShadow: '0 4px 15px rgba(13, 59, 102, 0.2)' }}
        >
          <Plus size={18} /> Registrasi Baru
        </button>
      </div>

      {/* Main Table Card */}
      <div className="bento-item" style={{ gridColumn: 'span 12', padding: '0', overflow: 'hidden' }}>
        <div style={{ padding: '20px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8fafc' }}>
          <h3 className="widget-title" style={{ margin: 0 }}>Daftar Pengguna & Kendaraan</h3>
          <div className="search-box" style={{ position: 'relative', width: '300px' }}>
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '10px', color: '#64748b' }} />
            <input 
              type="text" 
              placeholder="Cari nama, NPM/NIDN, atau plat..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="form-control"
              style={{ paddingLeft: '36px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
            />
          </div>
        </div>

        <div className="log-table-container">
          <table className="log-table">
            <thead>
              <tr style={{ background: '#f1f5f9' }}>
                <th>Pemilik</th>
                <th>Status</th>
                <th>Identitas (NPM/NIDN)</th>
                <th>Plat Nomor</th>
                <th>Kendaraan</th>
                <th style={{ textAlign: 'right', paddingRight: '20px' }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item) => (
                <tr key={item.id_kendaraan} style={{ transition: 'all 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.background = '#f8fafc'} onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                  <td>
                    <div className="log-row-avatar">
                      <div className="mini-avatar" style={{ background: 'var(--navy-teal-light)', color: 'var(--navy-teal)' }}>
                        <User size={16} />
                      </div>
                      <span style={{ fontWeight: 600, color: 'var(--navy-teal)' }}>{item.nama_pengguna}</span>
                    </div>
                  </td>
                  <td>
                    <span className="badge" style={{ 
                      background: item.status_pengguna === 'dosen' ? 'linear-gradient(135deg, #4b5563, #1f2937)' : item.status_pengguna === 'mahasiswa' ? 'linear-gradient(135deg, var(--navy-teal), #1a5e9e)' : 'linear-gradient(135deg, var(--emerald-green), #047857)',
                      color: 'white',
                      padding: '4px 12px',
                      textTransform: 'capitalize',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                    }}>
                      {item.status_pengguna}
                    </span>
                  </td>
                  <td style={{ fontFamily: 'monospace', color: '#64748b', fontSize: '14px' }}>{item.no_identitas}</td>
                  <td>
                    <span style={{ 
                      background: '#f1f5f9', 
                      padding: '4px 8px', 
                      borderRadius: '4px', 
                      fontFamily: 'monospace', 
                      fontWeight: 700, 
                      color: 'var(--navy-teal)',
                      border: '1px solid #e2e8f0'
                    }}>
                      {item.plat_nomor}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Car size={16} color="#64748b" />
                      <span>{item.jenis_kendaraan === 'mobil' ? 'Mobil' : 'Motor'} <span style={{ color: '#64748b', fontSize: '12px' }}>({item.merk})</span></span>
                    </div>
                  </td>
                  <td style={{ textAlign: 'right', paddingRight: '20px' }}>
                    <button 
                      onClick={() => handleDelete(item.id_kendaraan, item.id_pengguna)}
                      style={{ 
                        background: 'var(--soft-red-light)', 
                        color: 'var(--soft-red)', 
                        border: 'none', 
                        padding: '6px 10px', 
                        borderRadius: '6px', 
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.2s'
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--soft-red)'; e.currentTarget.style.color = 'white'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--soft-red-light)'; e.currentTarget.style.color = 'var(--soft-red)'; }}
                      title="Hapus Data"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
              {filteredData.length === 0 && (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                      <Search size={32} opacity={0.5} />
                      <p>Tidak ada data ditemukan</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Form Terpadu */}
      {isModalOpen && (
        <div className="modal-overlay" style={{ background: 'rgba(13, 59, 102, 0.4)', backdropFilter: 'blur(4px)' }}>
          <div className="modal" style={{ maxWidth: '850px', borderRadius: '16px', overflow: 'hidden' }}>
            <div className="modal-header" style={{ background: 'var(--navy-teal)', color: 'white', padding: '20px 24px', borderBottom: 'none' }}>
              <h3 style={{ color: 'white', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <UserCheck size={20} />
                Registrasi Terpadu (Pengguna & Kendaraan)
              </h3>
              <button 
                className="modal-close" 
                onClick={() => setIsModalOpen(false)}
                style={{ background: 'rgba(255,255,255,0.1)', color: 'white' }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
              >
                <X size={18} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="modal-body" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', padding: '30px', background: '#f8fafc' }}>
                
                {/* Bagian Data Pengguna */}
                <div style={{ background: 'white', padding: '20px', borderRadius: '12px', border: '1px solid var(--border-color)', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}>
                  <h3 className="widget-title" style={{ fontSize: '15px', borderBottom: '1px solid #f1f5f9', paddingBottom: '12px' }}>
                    <ShieldCheck size={18} color="var(--navy-teal)" />
                    Data Identitas Pemilik
                  </h3>
                  
                  <div className="form-group" style={{ marginTop: '16px' }}>
                    <label className="form-label">Kategori Pengguna <span className="required">*</span></label>
                    <select name="status_pengguna" value={formData.status_pengguna} onChange={handleInputChange} className="form-control" required style={{ background: '#f8fafc' }}>
                      <option value="mahasiswa">👨‍🎓 Mahasiswa</option>
                      <option value="dosen">👨‍🏫 Dosen</option>
                      <option value="umum">👤 Umum / Tamu</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Nama Lengkap <span className="required">*</span></label>
                    <input type="text" name="nama" value={formData.nama} onChange={handleInputChange} className="form-control" placeholder="Masukkan nama lengkap" required />
                  </div>

                  <div className="form-group">
                    <label className="form-label">No Identitas (NPM / NIDN / KTP) <span className="required">*</span></label>
                    <input type="text" name="no_identitas" value={formData.no_identitas} onChange={handleInputChange} className="form-control" placeholder="Contoh: 197530..." required />
                  </div>

                  <div className="form-group">
                    <label className="form-label">No Handphone</label>
                    <input type="text" name="no_hp" value={formData.no_hp} onChange={handleInputChange} className="form-control" placeholder="Opsional" />
                  </div>
                </div>

                {/* Bagian Data Kendaraan */}
                <div style={{ background: 'white', padding: '20px', borderRadius: '12px', border: '1px solid var(--border-color)', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}>
                  <h3 className="widget-title" style={{ fontSize: '15px', borderBottom: '1px solid #f1f5f9', paddingBottom: '12px' }}>
                    <Car size={18} color="var(--emerald-green)" />
                    Data Kendaraan
                  </h3>
                  
                  <div className="form-group" style={{ marginTop: '16px' }}>
                    <label className="form-label">Plat Nomor <span className="required">*</span></label>
                    <input 
                      type="text" 
                      name="plat_nomor" 
                      value={formData.plat_nomor} 
                      onChange={handleInputChange} 
                      className="form-control" 
                      placeholder="Contoh: BE 1234 XY" 
                      required 
                      style={{ textTransform: 'uppercase', fontFamily: 'monospace', fontSize: '16px', letterSpacing: '1px', fontWeight: 'bold', background: '#f8fafc' }} 
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Jenis Kendaraan <span className="required">*</span></label>
                    <select name="jenis_kendaraan" value={formData.jenis_kendaraan} onChange={handleInputChange} className="form-control" required>
                      <option value="motor">🏍️ Motor</option>
                      <option value="mobil">🚗 Mobil</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Merk Kendaraan</label>
                    <input type="text" name="merk" value={formData.merk} onChange={handleInputChange} className="form-control" placeholder="Contoh: Honda Vario" />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Warna</label>
                    <input type="text" name="warna" value={formData.warna} onChange={handleInputChange} className="form-control" placeholder="Contoh: Hitam" />
                  </div>
                </div>

              </div>
              
              <div className="modal-footer" style={{ background: 'white', borderTop: '1px solid #f1f5f9' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)} style={{ background: '#f1f5f9', color: '#64748b', fontWeight: 600 }}>
                  Batal
                </button>
                <button type="submit" className="btn btn-primary" style={{ background: 'var(--emerald-green)', color: 'white', boxShadow: '0 4px 12px rgba(16, 185, 129, 0.2)' }}>
                  <Save size={18} /> Simpan Data Terpadu
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
