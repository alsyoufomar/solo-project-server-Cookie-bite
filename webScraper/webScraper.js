const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const cheerio = require('cheerio');
const axios = require('axios');
const fs = require('fs');
const schedule = require('node-schedule');

async function scrapper() {
  await caller(londonEvents.club, 'club');
  await caller(londonEvents.gigs, 'gigs');
  await caller(londonEvents.festivals, 'festivals');
  await caller(londonEvents['Comedy Theatre Arts'], 'Comedy Theatre Arts');
  await caller(
    londonEvents['Experiences & Attractions'],
    'Experiences & Attractions'
  );
  await caller(londonEvents['Food & Drink'], 'Food & Drink');
}

const londonEvents = {
  club: 'https://www.skiddle.com/clubs/London/',
  gigs: 'https://www.skiddle.com/gigs/London/',
  festivals:
    'https://www.skiddle.com/festivals/cities/London/?from_date=25%20May%202022',
  'Comedy Theatre Arts':
    'https://www.skiddle.com/whats-on/events/London/?eventcodes%5B%5D=12&eventcodes%5B%5D=10&eventcodes%5B%5D=24&eventcodes%5B%5D=42&eventcodes%5B%5D=44',
  'Experiences & Attractions':
    'https://www.skiddle.com/whats-on/events/London/?eventcodes%5B%5D=49&eventcodes%5B%5D=50&eventcodes%5B%5D=16&eventcodes%5B%5D=14',
  'Food & Drink':
    'https://www.skiddle.com/whats-on/events/London/?eventcodes%5B%5D=34&eventcodes%5B%5D=18',
};

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

// const date = new Date(

schedule.scheduleJob('15 * * * *', function () {
  scrapper().catch(async (err) => {
    console.log(err);
    await prisma.$disconnect();
    process.exit(1);
  });
});

//club , gigs , festivals, ComedyTheatreArts , ExperiencesAttractions , FoodDrink
