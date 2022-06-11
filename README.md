# Cookie bite API

## API Description

In few lines we will talk in general about the main functionality of the server.

First of all, This RestfulAPI consists of 15 routers, to handle 4 main resources (event, user, thread and reply) each of which is responsible for either POST, GET, PATCH or DELETE (the main HTTP variables).

Some of these routers will authenticate the user using "checkToken" middleware, this functionality uses jsonwebtoken package to generate and verify tokens.

The routers that don't authenticate the user, such as some of the event's routers, is to give the user the ability to brows without the need to sign up or sign in.

The API code is structured using the MVC approach, to make the code more modular, reusable and easier to maintain.

Finally, the events get sraped automatically from actual live websites, the scrapers runs every month, It deletes all events from the event table only, leaving the favourites table (to not lose the users bookmarked events) and it will feed back the event table with around 1000 new events.

## Setup instructions

1. Fork this repository or just clone it, it is up to you!
2. Rename `.env.template` to `.env`
3. Edit the `DATABASE_URL` variable in `.env`, swapping `YOUR_DATABASE_URL` for the URL of the database you just created. Leave `?schema=prisma` at the end.
4. Edit the `SHADOW_DATABASE_URL` variable in `.env`, swapping `YOUR_SHADOW_DATABASE_URL` for the URL of a shadow database you created in an earlier exercise. Leave `?schema=shadow` at the end.
5. Run `npm ci` to install the project dependencies.
6. Run `npx prisma migrate reset` to execute the database migrations. Press `y` when it asks if you're sure.

## Links

- [Cookie bite](https://cookie-bite.netlify.app/)
- [The client repo](https://github.com/alsyoufomar/solo-project-client-Cookie-bite)
