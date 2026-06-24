/**
 * Script setup otomatis schema + data ke Supabase
 * Mengirim SQL melalui Supabase REST API
 */
const { createClient } = require('@supabase/supabase-js');
const https = require('https');
require('dotenv').config();

const SUPABASE_URL = process.env.SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const PROJECT_REF = 'uypketqldcgbppwympcg';

// Execute SQL via Supabase's pg REST endpoint
async function executeSql(sql) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify({ query: sql });
    const url = new URL(`${SUPABASE_URL}/rest/v1/rpc/exec_sql`);
    
    const options = {
      hostname: url.hostname,
      path: url.pathname,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SERVICE_KEY}`,
        'apikey': SERVICE_KEY,
        'Content-Length': Buffer.byteLength(body),
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({ status: res.statusCode, data });
      });
    });

    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

// Use Supabase JS client for seeding
const supabase = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false }
});

const mahasiswaData = [
  { nama: 'Abdur Rouf Hanafi', no_identitas: '24781001', no_hp: '08XX-0000-0001', plat_nomor: 'BE 1001 AH', jenis: 'motor', merk: 'Honda Beat', warna: 'Hitam' },
  { nama: 'Ahmad Rizky Maulana', no_identitas: '24781002', no_hp: '08XX-0000-0002', plat_nomor: 'BE 1002 RM', jenis: 'mobil', merk: 'Toyota Avanza', warna: 'Putih' },
  { nama: 'Alzahra Dwi Febriyan', no_identitas: '24781003', no_hp: '08XX-0000-0003', plat_nomor: 'BE 1003 AF', jenis: 'motor', merk: 'Yamaha Mio', warna: 'Merah' },
  { nama: 'Atta Zaky Ramadhan', no_identitas: '24781004', no_hp: '08XX-0000-0004', plat_nomor: 'BE 1004 AR', jenis: 'motor', merk: 'Honda Vario', warna: 'Abu-abu' },
  { nama: 'Bunga Putri Salsabilla', no_identitas: '24781005', no_hp: '08XX-0000-0005', plat_nomor: 'BE 1005 BS', jenis: 'mobil', merk: 'Honda Brio', warna: 'Kuning' },
  { nama: 'Dafa Anggara Yonata', no_identitas: '24781006', no_hp: '08XX-0000-0006', plat_nomor: 'BE 1006 DY', jenis: 'motor', merk: 'Yamaha NMAX', warna: 'Biru' },
  { nama: 'Deni Prawira', no_identitas: '24781007', no_hp: '08XX-0000-0007', plat_nomor: 'BE 1007 DP', jenis: 'motor', merk: 'Honda Scoopy', warna: 'Cokelat' },
  { nama: 'Dona Virza', no_identitas: '24781008', no_hp: '08XX-0000-0008', plat_nomor: 'BE 1008 DV', jenis: 'mobil', merk: 'Daihatsu Ayla', warna: 'Silver' },
  { nama: 'Fahmi Ghozali', no_identitas: '24781009', no_hp: '08XX-0000-0009', plat_nomor: 'BE 1009 FG', jenis: 'motor', merk: 'Suzuki Nex', warna: 'Hitam' },
  { nama: 'Farhan Habibullah', no_identitas: '24781010', no_hp: '08XX-0000-0010', plat_nomor: 'BE 1010 FH', jenis: 'mobil', merk: 'Toyota Agya', warna: 'Merah' },
  { nama: 'Fitri Amelia Ananti', no_identitas: '24781011', no_hp: '08XX-0000-0011', plat_nomor: 'BE 1011 FA', jenis: 'motor', merk: 'Honda Genio', warna: 'Putih' },
  { nama: 'Heidy Putri Shafira', no_identitas: '24781012', no_hp: '08XX-0000-0012', plat_nomor: 'BE 1012 HS', jenis: 'motor', merk: 'Yamaha Fazzio', warna: 'Hijau' },
  { nama: 'Jesfitrina Sihombing', no_identitas: '24781013', no_hp: '08XX-0000-0013', plat_nomor: 'BE 1013 JS', jenis: 'mobil', merk: 'Honda Jazz', warna: 'Abu-abu' },
  { nama: 'Lia Agustina', no_identitas: '24781014', no_hp: '08XX-0000-0014', plat_nomor: 'BE 1014 LA', jenis: 'motor', merk: 'Honda Beat Street', warna: 'Hitam' },
  { nama: 'M. Rayhan Zulkarnain', no_identitas: '24781015', no_hp: '08XX-0000-0015', plat_nomor: 'BE 1015 RZ', jenis: 'motor', merk: 'Yamaha Aerox', warna: 'Biru' },
  { nama: 'Muhammad Alwan Dzaky', no_identitas: '24781016', no_hp: '08XX-0000-0016', plat_nomor: 'BE 1016 AD', jenis: 'mobil', merk: 'Suzuki Ertiga', warna: 'Putih' },
  { nama: 'Nabila Alfi Nur Khasanah', no_identitas: '24781017', no_hp: '08XX-0000-0017', plat_nomor: 'BE 1017 NK', jenis: 'motor', merk: 'Honda PCX', warna: 'Merah' },
  { nama: 'Nadiya Ghefira El Firsi', no_identitas: '24781018', no_hp: '08XX-0000-0018', plat_nomor: 'BE 1018 NF', jenis: 'motor', merk: 'Yamaha Lexi', warna: 'Silver' },
  { nama: 'Nayla Putri Syafira Arrovi', no_identitas: '24781019', no_hp: '08XX-0000-0019', plat_nomor: 'BE 1019 NA', jenis: 'mobil', merk: 'Daihatsu Sigra', warna: 'Hitam' },
  { nama: 'Nyken Sekar Ayuningtyas', no_identitas: '24781020', no_hp: '08XX-0000-0020', plat_nomor: 'BE 1020 NS', jenis: 'motor', merk: 'Honda Scoopy', warna: 'Pink' },
  { nama: 'Rafi Diandra Ardi Agusta', no_identitas: '24781021', no_hp: '08XX-0000-0021', plat_nomor: 'BE 1021 RA', jenis: 'motor', merk: 'Yamaha Jupiter Z', warna: 'Biru' },
  { nama: 'Rendy Dwi Prayoga', no_identitas: '24781022', no_hp: '08XX-0000-0022', plat_nomor: 'BE 1022 RP', jenis: 'mobil', merk: 'Toyota Calya', warna: 'Silver' },
  { nama: 'Rifki Rangga Saputra', no_identitas: '24781023', no_hp: '08XX-0000-0023', plat_nomor: 'BE 1023 RS', jenis: 'motor', merk: 'Honda Supra X', warna: 'Hitam' },
  { nama: 'Rizki Surohman', no_identitas: '24781024', no_hp: '08XX-0000-0024', plat_nomor: 'BE 1024 RH', jenis: 'motor', merk: 'Suzuki Satria F150', warna: 'Merah' },
  { nama: 'Rubby Ibnu Anantara', no_identitas: '24781025', no_hp: '08XX-0000-0025', plat_nomor: 'BE 1025 RI', jenis: 'mobil', merk: 'Honda Mobilio', warna: 'Putih' },
  { nama: 'Septi Cahyaningtias', no_identitas: '24781026', no_hp: '08XX-0000-0026', plat_nomor: 'BE 1026 SC', jenis: 'motor', merk: 'Yamaha Gear', warna: 'Abu-abu' },
  { nama: 'Sofi Ramadhani', no_identitas: '24781027', no_hp: '08XX-0000-0027', plat_nomor: 'BE 1027 SR', jenis: 'motor', merk: 'Honda Vario 160', warna: 'Biru' },
  { nama: 'Tasya Rismala', no_identitas: '24781028', no_hp: '08XX-0000-0028', plat_nomor: 'BE 1028 TR', jenis: 'mobil', merk: 'Daihatsu Xenia', warna: 'Hitam' },
  { nama: 'Ulfa Setyaningsih', no_identitas: '24781029', no_hp: '08XX-0000-0029', plat_nomor: 'BE 1029 US', jenis: 'motor', merk: 'Yamaha Mio M3', warna: 'Putih' },
  { nama: 'Yoga Ricky Pasaribu', no_identitas: '24781030', no_hp: '08XX-0000-0030', plat_nomor: 'BE 1030 YP', jenis: 'mobil', merk: 'Toyota Rush', warna: 'Silver' },
  { nama: 'Yusuf Al Fikri Jayasena', no_identitas: '24781031', no_hp: '08XX-0000-0031', plat_nomor: 'BE 1031 YJ', jenis: 'motor', merk: 'Honda Beat Deluxe', warna: 'Hitam' }
];

async function seedUsers() {
  console.log('Menyiapkan data admin...');
  const { error } = await supabase.from('users').upsert([
    { nama: 'Administrator', username: 'admin', password: '$2a$10$K5XVtHOl3Jn87/68/flPSOpP2ky5JnDfjBZZ7/gl18Ujt1XVIqnem', role: 'admin' },
    { nama: 'Petugas Utama', username: 'petugas1', password: '$2a$10$K5XVtHOl3Jn87/68/flPSOpP2ky5JnDfjBZZ7/gl18Ujt1XVIqnem', role: 'petugas' },
  ], { onConflict: 'username' });
  
  if (error) console.error('Error seed users:', error.message);
  else console.log('✅ Data admin berhasil disiapkan');
}

async function seedMahasiswa() {
  console.log('\nMemasukkan 31 data mahasiswa...');
  let count = 0;

  for (const item of mahasiswaData) {
    // Insert pengguna
    const { data: pengguna, error: pErr } = await supabase
      .from('pengguna_parkir')
      .insert([{ nama: item.nama, status_pengguna: 'mahasiswa', no_identitas: item.no_identitas, no_hp: item.no_hp }])
      .select()
      .single();

    if (pErr) {
      if (pErr.code === '23505') {
        console.log(`  ⚠️  Skip (sudah ada): ${item.nama}`);
        continue;
      }
      console.error(`  ❌ Error pengguna ${item.nama}:`, pErr.message);
      continue;
    }

    // Insert kendaraan
    const { error: kErr } = await supabase
      .from('kendaraan')
      .insert([{
        id_pengguna: pengguna.id_pengguna,
        plat_nomor: item.plat_nomor,
        jenis_kendaraan: item.jenis,
        merk: item.merk,
        warna: item.warna,
      }]);

    if (kErr) {
      console.error(`  ❌ Error kendaraan ${item.plat_nomor}:`, kErr.message);
    } else {
      count++;
      console.log(`  ✅ ${item.nama} - ${item.plat_nomor}`);
    }
  }

  console.log(`\n✅ Selesai! ${count} dari ${mahasiswaData.length} data berhasil dimasukkan.`);
}

async function main() {
  console.log('🚀 Setup Supabase Database dimulai...\n');
  
  // Test koneksi
  const { error: testError } = await supabase.from('users').select('count').limit(1);
  if (testError && testError.code !== 'PGRST116') {
    console.error('❌ Gagal terhubung ke Supabase. Pastikan tabel sudah dibuat di SQL Editor!');
    console.log('\n📋 Langkah:');
    console.log('1. Buka https://supabase.com/dashboard/project/uypketqldcgbppwympcg/sql');
    console.log('2. Copy & paste isi file database/supabase_schema.sql');
    console.log('3. Klik Run, lalu jalankan script ini lagi');
    process.exit(1);
  }

  await seedUsers();
  await seedMahasiswa();

  console.log('\n🎉 Database Supabase siap digunakan!');
  process.exit(0);
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
