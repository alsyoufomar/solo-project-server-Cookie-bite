const prisma = require('../utils/prisma');
const Joi = require('joi');

const createReply = async (req, res) => {
  try {
    const schema = Joi.object({
      content: Joi.string().min(1).max(150),
    });

    const { error, value } = schema.validate(req.body);
    if (error) {
      res.status(400);
      res.json({ error: error.details[0].message });
      return;
    }
    const { content } = value;
    const { threadId } = req.params;

    const createdReply = await prisma.reply.create({
      data: {
        content,
        thread: {
          connect: {
            id: parseInt(threadId),
          },
        },
        user: {
          connect: {
            id: parseInt(req.userId),
          },
        },
      },
      include: {
        user: true,
        thread: true,
      },
    });
    res.json({ createdReply });
  } catch (e) {
    return res.json({ err: e.message });
  }
};

const getSingleThread = async (req, res) => {
  try {
    const { threadId } = req.params;
    const where = { id: parseInt(threadId) };
    const foundThread = await prisma.thread.findUnique({
      where,
      include: {
        reply: {
          include: {
            user: true,
          },
        },
      },
    });
    res.json({ foundThread });
  } catch (e) {
    return res.json({ err: e.message });
  }
};

module.exports = { createReply, getSingleThread };
