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
const { getUserId } = require('../middleware/userIdProvider');

const router = express.Router();

router.get('/', getUserId, getEvent);
router.get('/featured', getUserId, getFeatured);
router.get('/thisWeek', getUserId, getThisWeek);
router.get('/bookmark', checkToken, getBookmark);

router.post('/:eventId/save', checkToken, addToList);
router.delete('/unsave/:bookmarkId', checkToken, removeFromList);

module.exports = router;
