const prisma = require('../utils/prisma');

const getEvent = async (req, res) => {
  const { location, genre, startDate, endDate, page, perPage } = req.query;

  const skip = parseInt(page);
  const take = parseInt(perPage);
  console.log('page: ', take, skip);
  const where = {};
  if (location) where.location = location;
  if (genre) where.genre = genre;
  if (startDate || endDate) {
    where.createdAt = {
      gte: new Date(startDate.substring(4, 15)),
      lt: new Date(endDate.substring(4, 15)),
    };
  }

  const foundEvent = await prisma.$transaction([
    prisma.event.count({ where }),
    prisma.event.findMany({
      where,
      take,
      skip: skip * take,
    }),
  ]);
  res.json({ events: foundEvent });
};

const getFeatured = async (req, res) => {
  const featured = await prisma.event.findMany({
    where: {
      location: 'Cardiff',
      genre: 'gigs',
    },
    skip: 13,
    take: 20,
  });

  res.json({ events: featured });
};

const getThisWeek = async (req, res) => {
  const thisWeek = await prisma.event.findMany({
    where: {
      location: 'Cardiff',
      genre: 'club',
    },
    skip: 13,
    take: 8,
  });

  res.json({ events: thisWeek });
};

const addToList = async (req, res) => {
  const { eventId } = req.params;
  try {
    const bookmark = await prisma.favourites.create({
      data: {
        event: {
          connect: {
            id: parseInt(eventId),
          },
        },
        user: {
          connect: {
            id: parseInt(req.userId),
          },
        },
      },
    });
    res.json({ bookmark });
  } catch (e) {
    return res.json({ err: e.message });
  }
};

const removeFromList = async (req, res) => {
  const { bookmarkId } = req.params;

  try {
    const removedFromList = await prisma.favourites.delete({
      where: { id: parseInt(bookmarkId) },
    });
    return res.json({ removedFromList });
  } catch (e) {
    return res.json({ err: e.message });
  }
};

const getBookmark = async (req, res) => {
  const foundBookmarks = await prisma.favourites.findMany({
    where: {
      userId: parseInt(req.userId),
    },
    include: {
      event: true,
    },
  });

  res.json({ foundBookmarks });
};

module.exports = {
  getEvent,
  getFeatured,
  getThisWeek,
  addToList,
  removeFromList,
  getBookmark,
};
