import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdPerson, MdLock, MdLogin } from 'react-icons/md';
import { FaCar } from 'react-icons/fa';
import { login } from '../api/api';

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.username || !form.password) {
      setError('Username dan password wajib diisi');
      return;
    }
    setLoading(true);
    try {
      const res = await login(form);
      const userData = res.data.user;

      // Hanya role 'admin' yang diizinkan masuk
      if (userData.role !== 'admin') {
        setError('Akses ditolak. Hanya Admin yang dapat login ke sistem ini.');
        return;
      }

      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(userData));
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login gagal. Periksa username dan password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-bg-shapes" />
      <div className="login-card">
        {/* Logo */}
        <div className="login-logo">
          <div className="login-logo-icon">
            <FaCar color="#fff" />
          </div>
          <h1>SiParkir</h1>
          <p>Sistem Informasi Parkir<br />Politeknik Negeri Lampung</p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="alert alert-error">
            ⚠️ {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Username <span className="required">*</span></label>
            <div className="login-input-icon">
              <MdPerson className="input-icon" />
              <input
                id="username"
                type="text"
                name="username"
                className="form-control"
                placeholder="Masukkan username..."
                value={form.username}
                onChange={handleChange}
                autoComplete="username"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Password <span className="required">*</span></label>
            <div className="login-input-icon">
              <MdLock className="input-icon" />
              <input
                id="password"
                type="password"
                name="password"
                className="form-control"
                placeholder="Masukkan password..."
                value={form.password}
                onChange={handleChange}
                autoComplete="current-password"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="login-submit"
            disabled={loading}
          >
            {loading ? (
              <>
                <div className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }} />
                Memproses...
              </>
            ) : (
              <>
                <MdLogin size={18} />
                Masuk
              </>
            )}
          </button>
        </form>

        {/* Demo credentials */}
        <div className="login-demo" style={{ textAlign: 'left', background: '#f8fafc', padding: '12px 16px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
          <p style={{ fontWeight: 600, color: '#334155', marginBottom: '8px', borderBottom: '1px solid #cbd5e1', paddingBottom: '4px' }}>Akun Demo Admin:</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '12px', color: '#475569' }}>
            <div>
              <strong>Admin GKB</strong><br/>
              U: admin_gkb<br/>
              P: admin GKB 123
            </div>
            <div>
              <strong>Admin Software</strong><br/>
              U: admin_software<br/>
              P: admin software 123
            </div>
            <div>
              <strong>Admin Lab</strong><br/>
              U: admin_lab<br/>
              P: admin lab 123
            </div>
            <div>
              <strong>Admin Kantin</strong><br/>
              U: admin_kantin<br/>
              P: admin kantin 123
            </div>
          </div>
          <p style={{ fontSize: 11, marginTop: 12, color: '#9ca3af', textAlign: 'center' }}>
            * Hanya akun dengan role <strong>Admin</strong> yang dapat mengakses sistem
          </p>
        </div>
      </div>
    </div>
  );
}
