const express = require('express');
const router = express.Router();
const parkirController = require('../controllers/parkirController');

router.get('/', parkirController.getAll);
router.get('/dashboard-stats', parkirController.getDashboardStats);
router.get('/aktif', parkirController.getAktif);
router.get('/laporan', parkirController.getLaporan);
router.post('/masuk', parkirController.masuk);
router.put('/keluar/:id', parkirController.keluar);

module.exports = router;
