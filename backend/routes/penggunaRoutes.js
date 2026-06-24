const express = require('express');
const router = express.Router();
const penggunaController = require('../controllers/penggunaController');

router.get('/', penggunaController.getAll);
router.post('/', penggunaController.create);
router.put('/:id', penggunaController.update);
router.delete('/:id', penggunaController.remove);

module.exports = router;
