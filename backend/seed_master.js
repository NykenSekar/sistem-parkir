const db = require('./db');

const data = [
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

async function seedData() {
  let count = 0;
  for (const item of data) {
    try {
      // Insert pengguna_parkir
      const [penggunaResult] = await db.query(
        "INSERT INTO pengguna_parkir (nama, status_pengguna, no_identitas, no_hp) VALUES (?, ?, ?, ?)",
        [item.nama, 'mahasiswa', item.no_identitas, item.no_hp]
      );
      
      const id_pengguna = penggunaResult.insertId;

      // Insert kendaraan
      await db.query(
        "INSERT INTO kendaraan (id_pengguna, plat_nomor, jenis_kendaraan, merk, warna) VALUES (?, ?, ?, ?, ?)",
        [id_pengguna, item.plat_nomor, item.jenis, item.merk, item.warna]
      );
      count++;
      console.log(`Inserted: ${item.nama} - ${item.plat_nomor}`);
    } catch (err) {
      console.error(`Gagal insert ${item.nama}:`, err.message);
    }
  }
  console.log(`\nSelesai! Berhasil mengimpor ${count} data.`);
  process.exit(0);
}

seedData();
