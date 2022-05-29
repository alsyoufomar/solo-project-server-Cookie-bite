const express = require('express');
const {
  getEvent,
  getFeatured,
  getThisWeek,
  addToList,
  removeFromList,
  getBookmark,
} = require('../controllers/event');
const { checkToken } = require('../middleware/auth');

const router = express.Router();

router.get('/', checkToken, getEvent);
router.get('/featured', checkToken, getFeatured);
router.get('/thisWeek', checkToken, getThisWeek);
router.get('/bookmark', checkToken, getBookmark);

router.post('/:eventId/save', checkToken, addToList);
router.delete('/unsave/:bookmarkId', checkToken, removeFromList);

module.exports = router;
