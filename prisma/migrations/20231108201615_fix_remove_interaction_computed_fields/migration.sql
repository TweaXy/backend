/*
  Warnings:

  - You are about to drop the column `commentsCount` on the `Interactions` table. All the data in the column will be lost.
  - You are about to drop the column `LikesCount` on the `Interactions` table. All the data in the column will be lost.
  - You are about to drop the column `retweetssCount` on the `Interactions` table. All the data in the column will be lost.
  - You are about to drop the column `ViewsCount` on the `Interactions` table. All the data in the column will be lost.
  - You are about to drop the column `unseenConversationsCount` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Interactions` DROP COLUMN `commentsCount`,
    DROP COLUMN `LikesCount`,
    DROP COLUMN `retweetssCount`,
    DROP COLUMN `ViewsCount`;

-- AlterTable
ALTER TABLE `User` DROP COLUMN `unseenConversationsCount`;
