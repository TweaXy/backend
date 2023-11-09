/*
  Warnings:

  - You are about to drop the column `trendsId` on the `trendsinteractions` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `Trendsinteractions` DROP FOREIGN KEY `TrendsInteractions_trendsId_fkey`;

-- AlterTable
ALTER TABLE `Trendsinteractions` DROP COLUMN `trendsId`;

-- AddForeignKey
ALTER TABLE `Trendsinteractions` ADD CONSTRAINT `TrendsInteractions_trendID_fkey` FOREIGN KEY (`trendID`) REFERENCES `Trends`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
