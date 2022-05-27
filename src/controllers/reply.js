const prisma = require('../utils/prisma');

const createReply = async (req, res) => {
  try {
    const { content } = req.body;
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
