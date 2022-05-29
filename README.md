# solo-project-server


## Setting up

The full database schema and seed file for this exercise has already been implemented, your focus is on building the API itself.

**Note: Although we need to create a new primary database, we can reuse a shadow database across multiple projects since Prisma resets it after using it.**

1. Create a new database instance in ElephantSQL.
2. Rename the `.env.example` file to `.env`
3. Edit the `DATABASE_URL` variable in `.env`, swapping `YOUR_DATABASE_URL` for the URL of the database you just created. Leave `?schema=prisma` at the end.
4. Edit the `SHADOW_DATABASE_URL` variable in `.env`, swapping `YOUR_SHADOW_DATABASE_URL` for the URL of the shadow database you created in the earlier exercises. Leave `?schema=shadow` at the end.
5. Run `npm ci` to install the project dependencies.
6. Run `npx prisma migrate reset` to execute the existing migrations & data seed. Press `y` when it asks if you're sure.
