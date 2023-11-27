/*
  Warnings:

  - You are about to drop the column `UserID` on the `BlockedTokens` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `BlockedTokens` DROP FOREIGN KEY `BlockedTokens_UserID_fkey`;

-- AlterTable
ALTER TABLE `BlockedTokens` DROP COLUMN `UserID`;
