const prisma = require('../utils/prisma');

const getEvent = async (req, res) => {
  try {
    const { location, genre, startDate, endDate, page, perPage } = req.query;

    const skip = parseInt(page);
    const take = parseInt(perPage);
    const where = {};
    // if (location) where.location.contains = location;
    // if (genre) where.genre = genre;
    // console.log(new Date(endDate.substring(4, 15)));
    where.date = {};

    let foundEvent = await prisma.$transaction([
      prisma.event.count({ where }),
      prisma.event.findMany({
        where: {
          date: {
            gte: new Date(startDate.substring(4, 15)),
            lt: new Date(endDate.substring(4, 15)),
          },
          location: {
            contains: location,
          },
          genre: {
            contains: genre,
          },
        },
        take,
        skip: skip * take,
      }),
    ]);
    if (req.userId) {
      const foundBookmarks = await prisma.favourites.findMany({
        where: {
          userId: parseInt(req.userId),
        },
      });
      const finalBookmark = bookmarkFlag(foundEvent[1], foundBookmarks);
      foundEvent = finalBookmark;
    }

    res.json({ events: foundEvent });
  } catch (e) {
    return res.json({ err: e.message });
  }
};

function bookmarkFlag(arr, bookmarks) {
  for (let n of arr) {
    if (bookmarks.some((x) => x.eventId === n.id)) {
      n.isBookmarked = true;
      n.bookmarkId = bookmarks.find((x) => x.eventId === n.id).id;
    } else {
      n.isBookmarked = false;
    }
  }
  return arr;
}

const getFeatured = async (req, res) => {
  try {
    let featured = await prisma.event.findMany({
      where: {
        featured: true,
      },
    });
    if (req.userId) {
      const foundBookmarks = await prisma.favourites.findMany({
        where: {
          userId: parseInt(req.userId),
        },
      });
      const finalFeatured = bookmarkFlag(featured, foundBookmarks);
      featured = finalFeatured;
    }

    res.json({ events: featured });
  } catch (e) {
    return res.json({ err: e.message });
  }
};

const getThisWeek = async (req, res) => {
  try {
    const { page, perPage } = req.query;

    const skip = parseInt(page);
    const take = parseInt(perPage);
    const where = {};

    const today = new Date();
    const week = 7;
    const result = today.setDate(today.getDate() + week);
    const nextWeek = new Date(result);
    where.date = {};
    let thisWeek = await prisma.event.findMany({
      where: {
        date: {
          gte: new Date(),
          lt: nextWeek,
        },
      },
      take,
      skip: skip * take,
    });
    if (req.userId) {
      const foundBookmarks = await prisma.favourites.findMany({
        where: {
          userId: parseInt(req.userId),
        },
      });
      const finalThisWeek = bookmarkFlag(thisWeek, foundBookmarks);
      thisWeek = finalThisWeek;
    }

    res.json({ events: thisWeek });
  } catch (e) {
    return res.json({ err: e.message });
  }
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
  try {
    const foundBookmarks = await prisma.favourites.findMany({
      where: {
        userId: parseInt(req.userId),
      },
      include: {
        event: true,
      },
    });

    for (let n of foundBookmarks) {
      n.event.isBookmarked = true;
      n.event.bookmarkId = n.id;
    }

    res.json({ foundBookmarks });
  } catch (e) {
    return res.json({ err: e.message });
  }
};

module.exports = {
  getEvent,
  getFeatured,
  getThisWeek,
  addToList,
  removeFromList,
  getBookmark,
};
