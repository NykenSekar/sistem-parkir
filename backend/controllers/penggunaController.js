const supabase = require('../supabase');

exports.getAll = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('pengguna_parkir')
      .select('*')
      .order('id_pengguna', { ascending: false });

    if (error) throw error;
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Gagal mengambil data pengguna' });
  }
};

exports.create = async (req, res) => {
  try {
    const { nama, status_pengguna, no_identitas, no_hp } = req.body;

    if (!nama || !status_pengguna || !no_identitas) {
      return res.status(400).json({ message: 'Nama, status pengguna, dan no identitas wajib diisi' });
    }

    const { data, error } = await supabase
      .from('pengguna_parkir')
      .insert([{ nama, status_pengguna, no_identitas, no_hp: no_hp || null }])
      .select()
      .single();

    if (error) {
      if (error.code === '23505') {
        return res.status(409).json({ message: 'No identitas sudah terdaftar' });
      }
      throw error;
    }

    res.status(201).json({
      message: 'Pengguna berhasil ditambahkan',
      id: data.id_pengguna,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Gagal menambahkan pengguna' });
  }
};

exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const { nama, status_pengguna, no_identitas, no_hp } = req.body;

    if (!nama || !status_pengguna || !no_identitas) {
      return res.status(400).json({ message: 'Nama, status pengguna, dan no identitas wajib diisi' });
    }

    const { data, error } = await supabase
      .from('pengguna_parkir')
      .update({ nama, status_pengguna, no_identitas, no_hp: no_hp || null })
      .eq('id_pengguna', id)
      .select()
      .single();

    if (error) {
      if (error.code === '23505') {
        return res.status(409).json({ message: 'No identitas sudah digunakan' });
      }
      throw error;
    }

    if (!data) return res.status(404).json({ message: 'Pengguna tidak ditemukan' });

    res.json({ message: 'Pengguna berhasil diperbarui' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Gagal memperbarui pengguna' });
  }
};

exports.remove = async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from('pengguna_parkir')
      .delete()
      .eq('id_pengguna', id);

    if (error) throw error;

    res.json({ message: 'Pengguna berhasil dihapus' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Gagal menghapus pengguna' });
  }
};
