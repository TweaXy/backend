/*
  Warnings:

  - You are about to drop the column `rank` on the `interactions` table. All the data in the column will be lost.
  - You are about to drop the column `rank` on the `trends` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `interactions` DROP COLUMN `rank`;

-- AlterTable
ALTER TABLE `trends` DROP COLUMN `rank`;
