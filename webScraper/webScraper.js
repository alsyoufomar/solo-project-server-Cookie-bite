const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const cheerio = require('cheerio');
const axios = require('axios');
const schedule = require('node-schedule');
const { cities } = require('./eventInCity');

async function scrapper() {
  const foundBookmarks = await prisma.favourites.findMany({
    select: { eventId: true },
  });
  const bookmarkedEvents = objToArr(foundBookmarks);

  await eventDeleter(bookmarkedEvents);

  for (let city of cities) {
    await Promise.all([
      caller(city.club, 'club'),
      caller(city.gigs, 'gigs'),
      caller(city.festivals, 'festivals'),
      caller(city['comedy theatre arts'], 'comedy theatre arts'),
      caller(city['experiences & attractions'], 'experiences & attractions'),
      caller(city['food & drink'], 'food & drink'),
    ]);
  }
}

async function caller(url, genre) {
  const data = await mainScraper(url, genre);
  await addEvents(data);
}

async function addEvents(data) {
  const createdEvent = await prisma.event.createMany({
    data,
  });
  console.log('created event', createdEvent);
  return createdEvent;
}

async function eventDeleter(arr) {
  await prisma.event.deleteMany({
    where: {
      NOT: {
        id: {
          in: arr,
        },
      },
    },
  });
}

function objToArr(arr) {
  const arrOfEventIds = [];
  for (let n of arr) {
    arrOfEventIds.push(...Object.values(n));
  }
  return arrOfEventIds;
}

async function mainScraper(url, myGenre) {
  const articles = [];
  try {
    const res = await axios(url);
    const html = res.data;
    const $ = cheerio.load(html);

    $('.MuiCardContent-root', html).each(async function (i, el) {
      const image = $(el).find('.parallax-images').attr('src');
      const title = $(el)
        .find('.MuiTypography-root')
        .children('a')
        .children('span')
        .text();
      let url = $(el).children('a:first').attr('href');
      const date = new Date(
        $(el)
          .find('.MuiBox-root')
          .children('p:first')
          .text()
          .replace(/th|rd|nd|st/gm, '') + '22'
      );
      const location = $(el).find('.MuiBox-root').children('p:last').text();
      const featured = featuredGenerate();

      const myObj = {
        title,
        image,
        url,
        location: location + ' Location',
        date,
        genre: myGenre + ' event ' + title.toLowerCase(),
        featured,
      };
      articles.push(myObj);
    });
    return articles;
  } catch (err) {
    console.log(err);
  }
}

function featuredGenerate() {
  let propability = Math.floor(Math.random() * 10 + 1);
  if (propability > 0 && propability < 4) return true;
  else return false;
}

schedule.scheduleJob('* * 13 * *', function () {
  scrapper().catch(async (err) => {
    console.log(err);
    await prisma.$disconnect();
    process.exit(1);
  });
});
