/*
  Warnings:

  - A unique constraint covering the columns `[userId,eventId]` on the table `Favourites` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Favourites_userId_eventId_key" ON "Favourites"("userId", "eventId");
