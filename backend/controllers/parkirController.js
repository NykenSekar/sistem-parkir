const supabase = require('../supabase');

exports.getAll = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('parkir')
      .select(`
        id_parkir, waktu_masuk, waktu_keluar, status_parkir, area_parkir,
        kendaraan!id_kendaraan ( plat_nomor, jenis_kendaraan, merk, warna,
          pengguna_parkir!id_pengguna ( nama, status_pengguna )
        ),
        users!id_petugas ( nama )
      `)
      .order('waktu_masuk', { ascending: false });

    if (error) throw error;

    const flattened = data.map(p => ({
      id_parkir: p.id_parkir,
      id_kendaraan: p.kendaraan?.id_kendaraan,
      id_petugas: p.users?.id_user,
      waktu_masuk: p.waktu_masuk,
      waktu_keluar: p.waktu_keluar,
      status_parkir: p.status_parkir,
      area_parkir: p.area_parkir,
      plat_nomor: p.kendaraan?.plat_nomor,
      jenis_kendaraan: p.kendaraan?.jenis_kendaraan,
      merk: p.kendaraan?.merk,
      warna: p.kendaraan?.warna,
      nama_pengguna: p.kendaraan?.pengguna_parkir?.nama,
      status_pengguna: p.kendaraan?.pengguna_parkir?.status_pengguna,
      nama_petugas: p.users?.nama,
    }));

    res.json(flattened);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Gagal mengambil data parkir' });
  }
};

exports.getAktif = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('parkir')
      .select(`
        id_parkir, waktu_masuk, status_parkir, area_parkir,
        kendaraan!id_kendaraan ( plat_nomor, jenis_kendaraan, merk,
          pengguna_parkir!id_pengguna ( nama )
        )
      `)
      .eq('status_parkir', 'masuk')
      .order('waktu_masuk', { ascending: false });

    if (error) throw error;

    const flattened = data.map(p => ({
      id_parkir: p.id_parkir,
      waktu_masuk: p.waktu_masuk,
      status_parkir: p.status_parkir,
      area_parkir: p.area_parkir,
      plat_nomor: p.kendaraan?.plat_nomor,
      jenis_kendaraan: p.kendaraan?.jenis_kendaraan,
      merk: p.kendaraan?.merk,
      nama_pengguna: p.kendaraan?.pengguna_parkir?.nama,
    }));

    res.json(flattened);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Gagal mengambil data parkir aktif' });
  }
};

exports.getLaporan = async (req, res) => {
  try {
    const { tanggal_awal, tanggal_akhir, area_parkir } = req.query;

    let query = supabase
      .from('parkir')
      .select(`
        id_parkir, waktu_masuk, waktu_keluar, status_parkir, area_parkir,
        kendaraan!id_kendaraan ( plat_nomor, jenis_kendaraan, merk,
          pengguna_parkir!id_pengguna ( nama, status_pengguna )
        ),
        users!id_petugas ( nama )
      `)
      .order('waktu_masuk', { ascending: false });

    if (tanggal_awal) query = query.gte('waktu_masuk', `${tanggal_awal}T00:00:00`);
    if (tanggal_akhir) query = query.lte('waktu_masuk', `${tanggal_akhir}T23:59:59`);
    if (area_parkir) query = query.eq('area_parkir', area_parkir);

    const { data, error } = await query;
    if (error) throw error;

    const flattened = data.map(p => ({
      id_parkir: p.id_parkir,
      waktu_masuk: p.waktu_masuk,
      waktu_keluar: p.waktu_keluar,
      status_parkir: p.status_parkir,
      area_parkir: p.area_parkir,
      plat_nomor: p.kendaraan?.plat_nomor,
      jenis_kendaraan: p.kendaraan?.jenis_kendaraan,
      merk: p.kendaraan?.merk,
      nama_pengguna: p.kendaraan?.pengguna_parkir?.nama,
      status_pengguna: p.kendaraan?.pengguna_parkir?.status_pengguna,
      nama_petugas: p.users?.nama,
    }));

    res.json({
      data: flattened,
      summary: {
        total: flattened.length,
        masuk: flattened.filter(r => r.status_parkir === 'masuk').length,
        keluar: flattened.filter(r => r.status_parkir === 'keluar').length,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Gagal mengambil laporan parkir' });
  }
};

exports.masuk = async (req, res) => {
  try {
    const { id_kendaraan, id_petugas, area_parkir } = req.body;

    if (!id_kendaraan || !id_petugas) {
      return res.status(400).json({ message: 'id_kendaraan dan id_petugas wajib diisi' });
    }

    const assignedArea = area_parkir || 'Gedung Kuliah Bersama (GKB)';

    // Cek apakah kendaraan sudah parkir
    const { data: existing } = await supabase
      .from('parkir')
      .select('id_parkir')
      .eq('id_kendaraan', id_kendaraan)
      .eq('status_parkir', 'masuk')
      .limit(1);

    if (existing && existing.length > 0) {
      return res.status(409).json({ message: 'Kendaraan ini masih berada di area parkir' });
    }

    const waktu_masuk = new Date().toISOString();
    const { data, error } = await supabase
      .from('parkir')
      .insert([{
        id_kendaraan,
        id_petugas,
        waktu_masuk,
        status_parkir: 'masuk',
        area_parkir: assignedArea,
      }])
      .select()
      .single();

    if (error) throw error;

    res.status(201).json({
      message: 'Kendaraan berhasil dicatat masuk di ' + assignedArea,
      id: data.id_parkir,
      waktu_masuk: data.waktu_masuk,
      area_parkir: assignedArea,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Gagal mencatat kendaraan masuk' });
  }
};

exports.keluar = async (req, res) => {
  try {
    const { id } = req.params;

    const { data: existing, error: fetchError } = await supabase
      .from('parkir')
      .select('*')
      .eq('id_parkir', id)
      .single();

    if (fetchError || !existing) {
      return res.status(404).json({ message: 'Data parkir tidak ditemukan' });
    }

    if (existing.status_parkir === 'keluar') {
      return res.status(409).json({ message: 'Kendaraan sudah tercatat keluar' });
    }

    const waktu_keluar = new Date().toISOString();
    const { error } = await supabase
      .from('parkir')
      .update({ waktu_keluar, status_parkir: 'keluar' })
      .eq('id_parkir', id);

    if (error) throw error;

    res.json({
      message: 'Kendaraan berhasil dicatat keluar',
      waktu_keluar,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Gagal mencatat kendaraan keluar' });
  }
};

exports.getDashboardStats = async (req, res) => {
  try {
    // Get zone usage grouped by area
    const { data: zoneUsage, error: zoneError } = await supabase
      .from('parkir')
      .select('area_parkir')
      .eq('status_parkir', 'masuk');

    if (zoneError) throw zoneError;

    // Group by area manually
    const grouped = {};
    zoneUsage.forEach(p => {
      grouped[p.area_parkir] = (grouped[p.area_parkir] || 0) + 1;
    });
    const zoneResult = Object.entries(grouped).map(([area_parkir, used_slots]) => ({
      area_parkir,
      used_slots,
    }));

    // Get 5 recent logs
    const { data: recentLogs, error: logError } = await supabase
      .from('parkir')
      .select(`
        id_parkir, waktu_masuk,
        kendaraan!id_kendaraan ( plat_nomor,
          pengguna_parkir!id_pengguna ( nama, status_pengguna )
        )
      `)
      .order('waktu_masuk', { ascending: false })
      .limit(5);

    if (logError) throw logError;

    const formattedLogs = recentLogs.map(p => ({
      id: p.id_parkir,
      name: p.kendaraan?.pengguna_parkir?.nama,
      identifier: p.kendaraan?.plat_nomor,
      role_key: p.kendaraan?.pengguna_parkir?.status_pengguna,
      time: p.waktu_masuk,
    }));

    res.json({
      zoneUsage: zoneResult,
      recentLogs: formattedLogs,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Gagal mengambil statistik dashboard' });
  }
};
