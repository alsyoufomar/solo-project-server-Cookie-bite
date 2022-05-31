const prisma = require('../utils/prisma');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Joi = require('joi');

const key = process.env.KEY;
const saltRounds = 10;

const createUser = async (req, res) => {
  try {
    const schema = Joi.object({
      username: Joi.string().min(3).max(30).required(),
      firstname: Joi.string().min(2).max(15).required(),
      lastname: Joi.string().min(2).max(15).required(),
      email: Joi.string()
        .email({
          minDomainSegments: 2,
          tlds: { allow: ['com', 'net'] },
        })
        .required(),
      password: Joi.string().min(3).max(30).required(),
      confirm_password: Joi.ref('password'),
    });

    const { error, value } = schema.validate(req.body);
    if (error) {
      res.status(400);
      res.json({ error: error.details[0].message });
      return;
    }

    const { username, password, email, firstname, lastname } = value;
    const userByEmail = await prisma.user.findUnique({ where: { email } });
    const userByUsername = await prisma.user.findUnique({
      where: { username },
    });
    if (userByEmail) {
      res.status(406);
      res.json({ error: 'This Email is already exists' });
      return;
    }
    if (userByUsername) {
      res.status(406);
      res.json({ error: 'This Username is already exists' });
      return;
    }
    const hash = await bcrypt.hash(password, saltRounds);
    const createdUser = await prisma.user.create({
      data: {
        email,
        username,
        password: hash,
        profile: {
          create: {
            firstname,
            lastname,
          },
        },
      },
      include: {
        profile: true,
      },
    });
    res.json({ data: createdUser });
  } catch (e) {
    return res.json({ err: e.message });
  }
};

async function loginUser(req, res) {
  try {
    const { username, password } = req.body;
    const user = await prisma.user.findUnique({ where: { username } });
    if (user) {
      const match = await bcrypt.compare(password, user.password);
      if (match) {
        const token = jwt.sign({ id: user.id }, key);
        res.json({ token });
      } else {
        res.status(404);
        res.json({ error: 'username or password is incorrect' });
      }
    } else {
      res.status(404);
      res.json({ error: 'username or password is incorrect' });
    }
  } catch (e) {
    return res.json({ err: e.message });
  }
}

async function getMyProfile(req, res) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: parseInt(req.userId) },
      include: {
        profile: true,
      },
    });
    res.json({ user });
  } catch (e) {
    return res.json({ err: e.message });
  }
}

async function getUser(req, res) {
  const userId = req.params.id;
  try {
    const user = await prisma.user.findUnique({
      where: { id: parseInt(userId) },
      include: {
        profile: true,
      },
    });
    res.json({ user });
  } catch (e) {
    return res.json({ err: e.message });
  }
}

const updateUser = async (req, res) => {
  try {
    const schema = Joi.object({
      username: Joi.string().min(3).max(30).required(),
      email: Joi.string()
        .email({
          minDomainSegments: 2,
          tlds: { allow: ['com', 'net'] },
        })
        .required(),
      id: Joi.number(),
      createdAt: Joi.string(),
      updatedAt: Joi.string(),
      password: Joi.string(),
      profile: Joi.object({
        id: Joi.number(),
        firstname: Joi.string().min(2).max(15).required(),
        lastname: Joi.string().min(2).max(15).required(),
        phone: Joi.string().min(7).max(20),
        bio: Joi.string().min(3).max(150),
        avatarUrl: Joi.string().min(5).max(1000),
        userId: Joi.number(),
        createdAt: Joi.string(),
        updatedAt: Joi.string(),
      }),
    });

    const { error, value } = schema.validate(req.body);
    if (error) {
      res.status(400);
      res.json({ error: error.details[0].message });
      return;
    }
    const { username, email } = value;
    const { firstname, lastname, phone, bio, avatarUrl } = value.profile;

    const updatedUser = await prisma.user.update({
      where: {
        id: parseInt(req.userId),
      },
      data: {
        email,
        username,
        profile: {
          update: {
            firstname,
            lastname,
            phone,
            bio,
            avatarUrl,
          },
        },
      },
      include: {
        profile: true,
      },
    });
    res.json({ data: updatedUser });
  } catch (e) {
    return res.json({ err: e.message });
  }
};

module.exports = { createUser, loginUser, getUser, updateUser, getMyProfile };
