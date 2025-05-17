/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `subscriptionplans` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "subscriptionplans_name_key" ON "subscriptionplans"("name");
