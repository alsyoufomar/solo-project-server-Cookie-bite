const express = require('express');
const {
  getEvent,
  getFeatured,
  getThisWeek,
  addToList,
  removeFromList,
} = require('../controllers/event');

const router = express.Router();

router.get('/', getEvent);
router.get('/featured', getFeatured);
router.get('/thisWeek', getThisWeek);

router.post('/:eventId/save', addToList);
router.delete('/unsave/:bookmarkId', removeFromList);

module.exports = router;
