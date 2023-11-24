/*
  Warnings:

  - You are about to drop the column `userID` on the `blockedtokens` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `blockedtokens` DROP FOREIGN KEY `BlockedTokens_userID_fkey`;

-- AlterTable
ALTER TABLE `blockedtokens` DROP COLUMN `userID`;
