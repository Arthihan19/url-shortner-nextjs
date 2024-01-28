/*
  Warnings:

  - Made the column `userId` on table `ShortURL` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "ShortURL" DROP CONSTRAINT "ShortURL_userId_fkey";

-- AlterTable
ALTER TABLE "ShortURL" ALTER COLUMN "userId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "ShortURL" ADD CONSTRAINT "ShortURL_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
