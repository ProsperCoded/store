/*
  Warnings:

  - A unique constraint covering the columns `[phone]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "phone" TEXT NOT NULL DEFAULT '+2349155004456';

-- CreateIndex
CREATE UNIQUE INDEX "User_phone_key" ON "User"("phone");
