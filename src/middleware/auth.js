const jwt = require('jsonwebtoken');

const key = process.env.KEY;

const checkToken = async (req, res, next) => {
  const authorization = req.headers['authorization'];
  if (!authorization) {
    res.status(401);
    res.json({ error: 'token is not valid, no header' });
    return;
  }

  const parts = authorization.split(' ');
  const token = parts[1];
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

module.exports = { checkToken };
