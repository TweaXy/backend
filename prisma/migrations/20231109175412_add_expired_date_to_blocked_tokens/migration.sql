/*
  Warnings:

  - Added the required column `expiredDate` to the `BlockedTokens` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `blockedtokens` ADD COLUMN `expiredDate` DATETIME(3) NOT NULL;
