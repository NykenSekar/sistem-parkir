/**
 * Create Supabase tables via Management REST API
 */
const https = require('https');
require('dotenv').config();

const PROJECT_REF = 'uypketqldcgbppwympcg';
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

const schema = `
CREATE TABLE IF NOT EXISTS public.users (
    id_user SERIAL PRIMARY KEY,
    nama VARCHAR(100) NOT NULL,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'petugas',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.pengguna_parkir (
    id_pengguna SERIAL PRIMARY KEY,
    nama VARCHAR(100) NOT NULL,
    status_pengguna VARCHAR(20) NOT NULL,
    no_identitas VARCHAR(50) NOT NULL UNIQUE,
    no_hp VARCHAR(20),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.kendaraan (
    id_kendaraan SERIAL PRIMARY KEY,
    id_pengguna INT NOT NULL REFERENCES public.pengguna_parkir(id_pengguna) ON DELETE CASCADE,
    plat_nomor VARCHAR(20) NOT NULL UNIQUE,
    jenis_kendaraan VARCHAR(10) NOT NULL,
    merk VARCHAR(50),
    warna VARCHAR(30),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.parkir (
    id_parkir SERIAL PRIMARY KEY,
    id_kendaraan INT NOT NULL REFERENCES public.kendaraan(id_kendaraan) ON DELETE CASCADE,
    id_petugas INT NOT NULL REFERENCES public.users(id_user) ON DELETE CASCADE,
    waktu_masuk TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    waktu_keluar TIMESTAMPTZ NULL,
    status_parkir VARCHAR(10) NOT NULL DEFAULT 'masuk',
    area_parkir VARCHAR(100) NOT NULL DEFAULT 'Gedung Kuliah Bersama (GKB)',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.pengguna_parkir DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.kendaraan DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.parkir DISABLE ROW LEVEL SECURITY;

INSERT INTO public.users (nama, username, password, role) VALUES
('Administrator', 'admin', '$2b$10$LeEYXr/bx0/zR5R4FFlKkuA3rNHdSVFIRnzVXNYM4l1z0TfLf9/wq', 'admin'),
('Petugas Utama', 'petugas1', '$2b$10$LeEYXr/bx0/zR5R4FFlKkuA3rNHdSVFIRnzVXNYM4l1z0TfLf9/wq', 'petugas')
ON CONFLICT (username) DO NOTHING;
`;

function httpPost(hostname, path, headers, body) {
  return new Promise((resolve, reject) => {
    const options = { hostname, path, method: 'POST', headers };
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => resolve({ status: res.statusCode, body: data }));
    });
    req.on('error', reject);
    if (body) req.write(body);
    req.end();
  });
}

async function createSchema() {
  console.log('🔧 Mencoba membuat tabel di Supabase...\n');

  // Try Supabase pg meta API
  const bodyStr = JSON.stringify({ query: schema });
  const result = await httpPost(
    `db.${PROJECT_REF}.supabase.co`,
    '/sql',
    {
      'Content-Type': 'application/json',
      'pg-version': '15',
      'Authorization': `Bearer ${SERVICE_KEY}`,
      'Content-Length': Buffer.byteLength(bodyStr),
    },
    bodyStr
  );

  console.log('Status:', result.status);
  console.log('Response:', result.body.substring(0, 500));
  return result;
}

createSchema().then(r => {
  if (r.status >= 200 && r.status < 300) {
    console.log('\n✅ Schema berhasil dibuat!');
  } else {
    console.log('\n⚠️  Coba metode alternatif via SQL Editor manual');
    console.log('Buka: https://supabase.com/dashboard/project/' + PROJECT_REF + '/sql/new');
  }
  process.exit(0);
}).catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});
