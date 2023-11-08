/*
  Warnings:

  - You are about to drop the column `commentsCount` on the `interactions` table. All the data in the column will be lost.
  - You are about to drop the column `likesCount` on the `interactions` table. All the data in the column will be lost.
  - You are about to drop the column `retweetssCount` on the `interactions` table. All the data in the column will be lost.
  - You are about to drop the column `viewsCount` on the `interactions` table. All the data in the column will be lost.
  - You are about to drop the column `unseenConversationsCount` on the `user` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `interactions` DROP COLUMN `commentsCount`,
    DROP COLUMN `likesCount`,
    DROP COLUMN `retweetssCount`,
    DROP COLUMN `viewsCount`;

-- AlterTable
ALTER TABLE `user` DROP COLUMN `unseenConversationsCount`;
