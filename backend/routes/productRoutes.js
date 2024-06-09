const express = require('express');
const {getTransactions} = require('../controllers/productControllers.js')

const router = express.Router();

router.get('/', getTransactions);

module.exports = router;
