const express = require('express');
const router = express.Router();

const urlController = require('../controller/urlController');
const authenticateToken = require('../middleware/auth');

// URL routes with authentication
router.post('/shorten', authenticateToken, urlController.createShortUrl);
router.get('/history', authenticateToken, urlController.getUrlHistory);

module.exports = router;
