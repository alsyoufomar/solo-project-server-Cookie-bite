const prisma = require('../utils/prisma');

const getTent = async (req, res) => {
  const where = {}
  const foundTent = await prisma.tent.findMany({
    where
  })
  console.log(foundTent)
  res.json({ tents: foundTent });
}


module.exports = { getTent }