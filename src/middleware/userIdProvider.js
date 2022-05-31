const jwt = require('jsonwebtoken');

const key = process.env.KEY;

const getUserId = async (req, res, next) => {
  const authorization = req.headers['authorization'];
  const parts = authorization.split(' ');
  const token = parts[1];
  if (token === 'null' || !token) {
    next();
    return;
  }

  try {
    const payload = jwt.verify(token, key);
    req.userId = payload.id;

    next();
  } catch (e) {
    res.status(401);
    res.json({ error: 'token is not valid:' + e });
    return;
  }
};

module.exports = { getUserId };
