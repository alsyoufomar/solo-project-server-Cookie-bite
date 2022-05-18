const prisma = require('../utils/prisma');

const getEvent = async (req, res) => {
  const { location, genre, startDate, endDate, cursorId, perPage } = req.query;

  const skip = 1;
  const take = parseInt(perPage);
  const where = {};
  const cursor = {};
  if (location) where.location = location;
  if (genre) where.genre = genre;
  if (startDate || endDate) {
    where.createdAt = {
      gte: new Date('18 Apr 2022'),
      lt: new Date('28 Apr 2022'),
    };
  }
  let test = 1;

  if (cursorId != 0) {
    test = parseInt(cursorId);
  }

  console.log(cursorId);

  const foundEvent = await prisma.$transaction([
    prisma.event.count({ where }),
    prisma.event.findMany({
      where,
      skip,
      take,
      cursor: {
        id: test,
      },
    }),
  ]);

  res.json({ events: foundEvent });
};

module.exports = { getEvent };
