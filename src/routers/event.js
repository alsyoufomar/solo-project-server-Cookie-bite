const express = require('express');
const { getEvent, getFeatured, getThisWeek } = require('../controllers/event');

const router = express.Router();

router.get('/', getEvent);
router.get('/featured', getFeatured);
router.get('/thisWeek', getThisWeek);

module.exports = router;
