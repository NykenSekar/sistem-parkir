const { createClient } = require('@supabase/supabase-js');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

async function fixPassword() {
  // Generate hash baru untuk password 'password'
  const newHash = await bcrypt.hash('password', 10);
  console.log('Hash baru:', newHash);

  // Verifikasi hash
  const ok = await bcrypt.compare('password', newHash);
  console.log('Verifikasi hash:', ok);

  // Update di Supabase
  const { data, error } = await supabase
    .from('users')
    .update({ password: newHash })
    .eq('username', 'admin')
    .select('id_user, nama, username, role');

  if (error) {
    console.error('Error update:', error.message);
  } else {
    console.log('✅ Password admin berhasil diupdate:', JSON.stringify(data));
  }

  process.exit(0);
}

fixPassword();
