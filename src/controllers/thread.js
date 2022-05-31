const prisma = require('../utils/prisma');
const Joi = require('joi');

const createThread = async (req, res) => {
  try {
    const schema = Joi.object({
      title: Joi.string().min(3).max(30),
      content: Joi.string().min(1).max(300),
    });

    const { error, value } = schema.validate(req.body);
    if (error) {
      res.status(400);
      res.json({ error: error.details[0].message });
      return;
    }

    const { title, content } = value;
    const createdThread = await prisma.thread.create({
      data: {
        title,
        content,
        user: {
          connect: {
            id: parseInt(req.userId),
          },
        },
      },
      include: {
        user: true,
        reply: true,
      },
    });
    res.json({ data: createdThread });
  } catch (e) {
    return res.json({ err: e.message });
  }
};

const getThreads = async (req, res) => {
  try {
    const where = {};
    const foundThreads = await prisma.thread.findMany({
      where,
      include: {
        reply: true,
        user: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    res.json({ data: foundThreads });
  } catch (e) {
    return res.json({ err: e.message });
  }
};

module.exports = { createThread, getThreads };
