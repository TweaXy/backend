/*
  Warnings:

  - You are about to drop the column `TrendsId` on the `TrendsInteractions` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `TrendsInteractions` DROP FOREIGN KEY `TrendsInteractions_TrendsId_fkey`;

-- AlterTable
ALTER TABLE `TrendsInteractions` DROP COLUMN `TrendsId`;

-- AddForeignKey
ALTER TABLE `TrendsInteractions` ADD CONSTRAINT `TrendsInteractions_trendID_fkey` FOREIGN KEY (`trendID`) REFERENCES `Trends`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
