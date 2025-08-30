const express = require('express');
const router = express.Router();

const urlController = require('../controller/urlController');
const authenticateToken = require('../middleware/auth');

router.post('/shorten', authenticateToken, urlController.createShortUrl);
router.get('/:short', urlController.redirectShortUrl);

module.exports = router;
