const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ SUPABASE_URL atau SUPABASE_SERVICE_ROLE_KEY tidak ditemukan di .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

// Test connection
supabase.from('users').select('count').limit(1)
  .then(({ error }) => {
    if (error && error.code !== 'PGRST116') {
      console.error('❌ Gagal koneksi ke Supabase:', error.message);
    } else {
      console.log('✅ Berhasil terhubung ke Supabase PostgreSQL');
    }
  });

module.exports = supabase;
