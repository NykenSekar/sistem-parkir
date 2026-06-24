const { createClient } = require('@supabase/supabase-js');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

const admins = [
  { nama: 'Admin GKB', username: 'admin_gkb', raw_password: 'admin GKB 123', role: 'admin' },
  { nama: 'Admin Gedung Software', username: 'admin_software', raw_password: 'admin software 123', role: 'admin' },
  { nama: 'Admin Lab Analisis', username: 'admin_lab', raw_password: 'admin lab 123', role: 'admin' },
  { nama: 'Admin Kantin Lama', username: 'admin_kantin', raw_password: 'admin kantin 123', role: 'admin' },
];

async function seedAdmins() {
  console.log('Menyiapkan akun admin...');
  let successCount = 0;

  for (const admin of admins) {
    const passwordHash = await bcrypt.hash(admin.raw_password, 10);
    const { data, error } = await supabase.from('users').upsert([
      { 
        nama: admin.nama, 
        username: admin.username, 
        password: passwordHash, 
        role: admin.role 
      }
    ], { onConflict: 'username' });

    if (error) {
      console.error(`Gagal insert ${admin.username}:`, error.message);
    } else {
      console.log(`✅ Berhasil insert ${admin.username}`);
      successCount++;
    }
  }

  console.log(`\nSelesai! ${successCount} akun admin berhasil disiapkan.`);
  process.exit(0);
}

seedAdmins();
