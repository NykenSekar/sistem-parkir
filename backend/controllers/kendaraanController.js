const supabase = require('../supabase');

exports.getAll = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('kendaraan')
      .select(`
        *,
        pengguna_parkir!id_pengguna ( nama, status_pengguna, no_identitas )
      `)
      .order('id_kendaraan', { ascending: false });

    if (error) throw error;

    // Flatten data for frontend compatibility
    const flattened = data.map(k => ({
      id_kendaraan: k.id_kendaraan,
      id_pengguna: k.id_pengguna,
      plat_nomor: k.plat_nomor,
      jenis_kendaraan: k.jenis_kendaraan,
      merk: k.merk,
      warna: k.warna,
      created_at: k.created_at,
      nama_pengguna: k.pengguna_parkir?.nama,
      status_pengguna: k.pengguna_parkir?.status_pengguna,
      no_identitas: k.pengguna_parkir?.no_identitas,
    }));

    res.json(flattened);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Gagal mengambil data kendaraan' });
  }
};

exports.create = async (req, res) => {
  try {
    const { id_pengguna, plat_nomor, jenis_kendaraan, merk, warna } = req.body;

    if (!id_pengguna || !plat_nomor || !jenis_kendaraan) {
      return res.status(400).json({ message: 'id_pengguna, plat_nomor, dan jenis_kendaraan wajib diisi' });
    }

    const { data, error } = await supabase
      .from('kendaraan')
      .insert([{
        id_pengguna,
        plat_nomor: plat_nomor.toUpperCase(),
        jenis_kendaraan,
        merk: merk || null,
        warna: warna || null,
      }])
      .select()
      .single();

    if (error) {
      if (error.code === '23505') {
        return res.status(409).json({ message: 'Plat nomor sudah terdaftar' });
      }
      throw error;
    }

    res.status(201).json({
      message: 'Kendaraan berhasil ditambahkan',
      id: data.id_kendaraan,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Gagal menambahkan kendaraan' });
  }
};

exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const { id_pengguna, plat_nomor, jenis_kendaraan, merk, warna } = req.body;

    if (!id_pengguna || !plat_nomor || !jenis_kendaraan) {
      return res.status(400).json({ message: 'id_pengguna, plat_nomor, dan jenis_kendaraan wajib diisi' });
    }

    const { data, error } = await supabase
      .from('kendaraan')
      .update({
        id_pengguna,
        plat_nomor: plat_nomor.toUpperCase(),
        jenis_kendaraan,
        merk: merk || null,
        warna: warna || null,
      })
      .eq('id_kendaraan', id)
      .select()
      .single();

    if (error) {
      if (error.code === '23505') {
        return res.status(409).json({ message: 'Plat nomor sudah digunakan' });
      }
      throw error;
    }

    if (!data) return res.status(404).json({ message: 'Kendaraan tidak ditemukan' });

    res.json({ message: 'Kendaraan berhasil diperbarui' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Gagal memperbarui kendaraan' });
  }
};

exports.remove = async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from('kendaraan')
      .delete()
      .eq('id_kendaraan', id);

    if (error) throw error;

    res.json({ message: 'Kendaraan berhasil dihapus' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Gagal menghapus kendaraan' });
  }
};
