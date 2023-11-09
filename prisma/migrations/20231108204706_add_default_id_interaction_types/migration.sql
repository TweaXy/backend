/*
  Warnings:

  - You are about to alter the column `type` on the `interactions` table. The data in that column could be lost. The data in that column will be cast from `VarChar(1)` to `Enum(EnumId(0))`.

*/
-- AlterTable
ALTER TABLE `Interactions` MODIFY `type` ENUM('TWEET', 'COMMENT', 'RETWEET') NOT NULL DEFAULT 'TWEET';
