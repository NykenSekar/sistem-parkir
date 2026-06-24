-- =============================================
-- SISTEM INFORMASI PARKIR - SUPABASE SCHEMA
-- Politeknik Negeri Lampung
-- Jalankan script ini di Supabase SQL Editor
-- =============================================

-- Tabel users (admin/petugas)
CREATE TABLE IF NOT EXISTS public.users (
    id_user SERIAL PRIMARY KEY,
    nama VARCHAR(100) NOT NULL,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'petugas' CHECK (role IN ('admin', 'petugas')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabel pengguna_parkir (mahasiswa, dosen, umum)
CREATE TABLE IF NOT EXISTS public.pengguna_parkir (
    id_pengguna SERIAL PRIMARY KEY,
    nama VARCHAR(100) NOT NULL,
    status_pengguna VARCHAR(20) NOT NULL CHECK (status_pengguna IN ('mahasiswa', 'dosen', 'umum')),
    no_identitas VARCHAR(50) NOT NULL UNIQUE,
    no_hp VARCHAR(20),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabel kendaraan
CREATE TABLE IF NOT EXISTS public.kendaraan (
    id_kendaraan SERIAL PRIMARY KEY,
    id_pengguna INT NOT NULL REFERENCES public.pengguna_parkir(id_pengguna) ON DELETE CASCADE,
    plat_nomor VARCHAR(20) NOT NULL UNIQUE,
    jenis_kendaraan VARCHAR(10) NOT NULL CHECK (jenis_kendaraan IN ('motor', 'mobil')),
    merk VARCHAR(50),
    warna VARCHAR(30),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabel parkir
CREATE TABLE IF NOT EXISTS public.parkir (
    id_parkir SERIAL PRIMARY KEY,
    id_kendaraan INT NOT NULL REFERENCES public.kendaraan(id_kendaraan) ON DELETE CASCADE,
    id_petugas INT NOT NULL REFERENCES public.users(id_user) ON DELETE CASCADE,
    waktu_masuk TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    waktu_keluar TIMESTAMP WITH TIME ZONE NULL,
    status_parkir VARCHAR(10) NOT NULL DEFAULT 'masuk' CHECK (status_parkir IN ('masuk', 'keluar')),
    area_parkir VARCHAR(100) NOT NULL DEFAULT 'Gedung Kuliah Bersama (GKB)',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Nonaktifkan Row Level Security (untuk service role)
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.pengguna_parkir DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.kendaraan DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.parkir DISABLE ROW LEVEL SECURITY;

-- Data admin awal (password: admin123)
INSERT INTO public.users (nama, username, password, role) VALUES
('Administrator', 'admin', '$2a$10$K5XVtHOl3Jn87/68/flPSOpP2ky5JnDfjBZZ7/gl18Ujt1XVIqnem', 'admin'),
('Petugas Utama', 'petugas1', '$2a$10$K5XVtHOl3Jn87/68/flPSOpP2ky5JnDfjBZZ7/gl18Ujt1XVIqnem', 'petugas')
ON CONFLICT (username) DO NOTHING;
