USE sistem_parkir;
UPDATE pengguna_parkir SET status_pengguna='dosen' WHERE status_pengguna='tendik';
UPDATE pengguna_parkir SET status_pengguna='umum' WHERE status_pengguna='tamu';
ALTER TABLE pengguna_parkir MODIFY COLUMN status_pengguna ENUM('mahasiswa', 'dosen', 'umum') NOT NULL;
