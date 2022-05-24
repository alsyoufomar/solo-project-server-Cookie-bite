const express = require('express');
const { createReply, getSingleThread } = require('../controllers/reply.js');
const { checkToken } = require('../middleware/auth');

const router = express.Router();

router.post('/:threadId', checkToken, createReply);
router.get('/:threadId', getSingleThread);

module.exports = router;
