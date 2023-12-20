/*
  Warnings:

  - You are about to drop the column `rank` on the `Interactions` table. All the data in the column will be lost.
  - You are about to drop the column `rank` on the `Trends` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Interactions` DROP COLUMN `rank`;

-- AlterTable
ALTER TABLE `Trends` DROP COLUMN `rank`;
