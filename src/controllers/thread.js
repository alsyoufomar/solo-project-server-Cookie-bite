const prisma = require('../utils/prisma');

const createThread = async (req, res) => {
  try {
    const { title, content } = req.body;
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
