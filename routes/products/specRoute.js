const express = require('express');
const specController = require('../../controllers/products/specController');

const router = express.Router();

router.post('/:productId', specController.createProductSpec);
router.patch('/:productId', specController.updateProductSpec);
// router.delete('/:productId', specController.deletetProductSpec);

module.exports = router;
