const prisma = require('../utils/prisma');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const key = process.env.KEY;
const saltRounds = 10;

const createUser = async (req, res) => {
  const {
    username,
    password,
    email,
    firstname,
    lastname,
    avatarUrl,
    bio,
    phone,
  } = req.body;

  const hash = await bcrypt.hash(password, saltRounds);

  const createdUser = await prisma.user.create({
    data: {
      email,
      username: firstname,
      password: hash,
      profile: {
        create: {
          firstname,
          lastname,
          avatarUrl,
          bio,
          phone,
        },
      },
    },
    include: {
      profile: true,
    },
  });
  res.json({ data: createdUser });
};

async function loginUser(req, res) {
  const { username, password } = req.body;
  const user = await prisma.user.findUnique({ where: { username } });
  if (user) {
    const match = await bcrypt.compare(password, user.password);
    if (match) {
      const token = jwt.sign({ id: user.id }, key);
      res.json({ token });
    } else {
      res.status(404);
      res.json({ error: 'Wrong Password!!' });
    }
  } else {
    res.status(404);
    res.json({ error: 'User Not Found' });
  }
}

async function getUser(req, res) {
  const user = await prisma.user.findUnique({
    where: { id: parseInt(req.userId) },
    include: {
      profile: true,
    },
  });
  res.json({ user });
}

module.exports = { createUser, loginUser, getUser };
