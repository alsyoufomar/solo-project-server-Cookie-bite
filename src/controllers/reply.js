const prisma = require('../utils/prisma');

const createReply = async (req, res) => {
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
};

const getSingleThread = async (req, res) => {
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
};

module.exports = { createReply, getSingleThread };
