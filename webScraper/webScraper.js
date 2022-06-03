const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const cheerio = require('cheerio');
const axios = require('axios');
const fs = require('fs');
const schedule = require('node-schedule');
const {
  londonEvents,
  manchesterEvents,
  liverpoolEvents,
  edinburghEvents,
  birminghamEvents,
  cardiffEvents,
} = require('./eventInCity');

async function scrapper() {
  const foundBookmarks = await prisma.favourites.findMany({
    select: { eventId: true },
  });
  const bookmarkEvents = objToArr(foundBookmarks);
  await prisma.event.deleteMany({
    where: {
      NOT: {
        id: {
          in: bookmarkEvents,
        },
      },
    },
  });

  await caller(londonEvents.club, 'club');
  await caller(londonEvents.gigs, 'gigs');
  await caller(londonEvents.festivals, 'festivals');
  await caller(londonEvents['Comedy Theatre Arts'], 'Comedy Theatre Arts');
  await caller(
    londonEvents['Experiences & Attractions'],
    'Experiences & Attractions'
  );
  await caller(londonEvents['Food & Drink'], 'Food & Drink');

  await caller(manchesterEvents.club, 'club');
  await caller(manchesterEvents.gigs, 'gigs');
  await caller(manchesterEvents.festivals, 'festivals');
  await caller(manchesterEvents['Comedy Theatre Arts'], 'Comedy Theatre Arts');
  await caller(
    manchesterEvents['Experiences & Attractions'],
    'Experiences & Attractions'
  );
  await caller(manchesterEvents['Food & Drink'], 'Food & Drink');

  await caller(liverpoolEvents.club, 'club');
  await caller(liverpoolEvents.gigs, 'gigs');
  await caller(liverpoolEvents.festivals, 'festivals');
  await caller(liverpoolEvents['Comedy Theatre Arts'], 'Comedy Theatre Arts');
  await caller(
    liverpoolEvents['Experiences & Attractions'],
    'Experiences & Attractions'
  );
  await caller(liverpoolEvents['Food & Drink'], 'Food & Drink');

  await caller(edinburghEvents.club, 'club');
  await caller(edinburghEvents.gigs, 'gigs');
  await caller(edinburghEvents.festivals, 'festivals');
  await caller(edinburghEvents['Comedy Theatre Arts'], 'Comedy Theatre Arts');
  await caller(
    edinburghEvents['Experiences & Attractions'],
    'Experiences & Attractions'
  );
  await caller(edinburghEvents['Food & Drink'], 'Food & Drink');

  await caller(birminghamEvents.club, 'club');
  await caller(birminghamEvents.gigs, 'gigs');
  await caller(birminghamEvents.festivals, 'festivals');
  await caller(birminghamEvents['Comedy Theatre Arts'], 'Comedy Theatre Arts');
  await caller(
    birminghamEvents['Experiences & Attractions'],
    'Experiences & Attractions'
  );
  await caller(birminghamEvents['Food & Drink'], 'Food & Drink');

  await caller(cardiffEvents.club, 'club');
  await caller(cardiffEvents.gigs, 'gigs');
  await caller(cardiffEvents.festivals, 'festivals');
  await caller(cardiffEvents['Comedy Theatre Arts'], 'Comedy Theatre Arts');
  await caller(
    cardiffEvents['Experiences & Attractions'],
    'Experiences & Attractions'
  );
  await caller(cardiffEvents['Food & Drink'], 'Food & Drink');
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

async function deleter(arr) {
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

const url =
  'https://www.skiddle.com/festivals/cities/London/?from_date=25%20May%202022';
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
        location,
        date,
        genre: myGenre + ' ' + title.toLowerCase(),
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
  let test = Math.floor(Math.random() * 10 + 1);
  if (test > 0 && test < 4) return true;
  else return false;
}

// schedule.scheduleJob('15 * * * *', function () {
//   scrapper().catch(async (err) => {
//     console.log(err);
//     await prisma.$disconnect();
//     process.exit(1);
//   });
// });

scrapper().catch(async (err) => {
  console.log(err);
  await prisma.$disconnect();
  process.exit(1);
});
