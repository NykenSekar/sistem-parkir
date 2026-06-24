-- =============================================
-- SISTEM INFORMASI PARKIR
-- Politeknik Negeri Lampung
-- =============================================

CREATE DATABASE IF NOT EXISTS sistem_parkir;
USE sistem_parkir;

-- Tabel users (admin/petugas)
CREATE TABLE IF NOT EXISTS users (
    id_user INT AUTO_INCREMENT PRIMARY KEY,
    nama VARCHAR(100) NOT NULL,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'petugas') NOT NULL DEFAULT 'petugas',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabel pengguna_parkir (mahasiswa, dosen, tendik, tamu)
CREATE TABLE IF NOT EXISTS pengguna_parkir (
    id_pengguna INT AUTO_INCREMENT PRIMARY KEY,
    nama VARCHAR(100) NOT NULL,
    status_pengguna ENUM('mahasiswa', 'dosen', 'umum') NOT NULL,
    no_identitas VARCHAR(50) NOT NULL UNIQUE,
    no_hp VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabel kendaraan
CREATE TABLE IF NOT EXISTS kendaraan (
    id_kendaraan INT AUTO_INCREMENT PRIMARY KEY,
    id_pengguna INT NOT NULL,
    plat_nomor VARCHAR(20) NOT NULL UNIQUE,
    jenis_kendaraan ENUM('motor', 'mobil') NOT NULL,
    merk VARCHAR(50),
    warna VARCHAR(30),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_pengguna) REFERENCES pengguna_parkir(id_pengguna) ON DELETE CASCADE
);

-- Tabel parkir
CREATE TABLE IF NOT EXISTS parkir (
    id_parkir INT AUTO_INCREMENT PRIMARY KEY,
    id_kendaraan INT NOT NULL,
    id_petugas INT NOT NULL,
    waktu_masuk DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    waktu_keluar DATETIME NULL,
    status_parkir ENUM('masuk', 'keluar') NOT NULL DEFAULT 'masuk',
    FOREIGN KEY (id_kendaraan) REFERENCES kendaraan(id_kendaraan) ON DELETE CASCADE,
    FOREIGN KEY (id_petugas) REFERENCES users(id_user) ON DELETE CASCADE
);

-- =============================================
-- DATA AWAL (SEED)
-- =============================================

-- Password: admin123 (bcrypt hash)
INSERT INTO users (nama, username, password, role) VALUES
('Administrator', 'admin', '$2b$10$LeEYXr/bx0/zR5R4FFlKkuA3rNHdSVFIRnzVXNYM4l1z0TfLf9/wq', 'admin'),
('Petugas Utama', 'petugas1', '$2b$10$LeEYXr/bx0/zR5R4FFlKkuA3rNHdSVFIRnzVXNYM4l1z0TfLf9/wq', 'petugas');

-- Data pengguna parkir contoh
INSERT INTO pengguna_parkir (nama, status_pengguna, no_identitas, no_hp) VALUES
('Budi Santoso', 'mahasiswa', '20754011001', '081234567890'),
('Dr. Siti Rahayu', 'dosen', 'NIP1234567890', '082345678901'),
('Ahmad Fauzi', 'dosen', 'NIP0987654321', '083456789012'),
('Joko Purnomo', 'umum', 'KTP1234567890', '084567890123');

-- Data kendaraan contoh
INSERT INTO kendaraan (id_pengguna, plat_nomor, jenis_kendaraan, merk, warna) VALUES
(1, 'BE 1234 AB', 'motor', 'Honda', 'Merah'),
(2, 'BE 5678 CD', 'mobil', 'Toyota', 'Putih'),
(3, 'BE 9012 EF', 'motor', 'Yamaha', 'Hitam'),
(4, 'BE 3456 GH', 'mobil', 'Suzuki', 'Silver');
