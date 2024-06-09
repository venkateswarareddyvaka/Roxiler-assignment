const express = require('express');
const { getStatistics } = require('../controllers/productControllers.js');

const router = express.Router();

router.get('/', getStatistics);

module.exports = router;
