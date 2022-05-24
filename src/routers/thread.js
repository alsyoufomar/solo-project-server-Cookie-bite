const express = require('express');
const { createThread, getThreads } = require('../controllers/thread.js');
const { checkToken } = require('../middleware/auth');

const router = express.Router();

router.post('/', checkToken, createThread);
router.get('/', getThreads);

module.exports = router;
