const express = require('express');
const { getBarCharts } = require('../controllers/productControllers.js');

const router = express.Router();

router.get('/', getBarCharts);

module.exports = router;
