const express = require('express');
const {
  createUser,
  loginUser,
  getUser,
  updateUser,
  getMyProfile,
} = require('../controllers/user.js');
const { checkToken } = require('../middleware/auth');

const router = express.Router();

router.post('/register', createUser);
router.post('/login', loginUser);
router.get('/profile', checkToken, getMyProfile);
router.get('/profile/:id', getUser);
router.patch('/profile', checkToken, updateUser);

module.exports = router;
