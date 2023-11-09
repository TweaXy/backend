/*
  Warnings:

  - You are about to drop the column `followedByCount` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `followingCount` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `seenNotificationsCount` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `userNotificationsCount` on the `user` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Directmessages` MODIFY `deletedDate` DATETIME(3) NULL;

-- AlterTable
ALTER TABLE `User` DROP COLUMN `followedByCount`,
    DROP COLUMN `followingCount`,
    DROP COLUMN `seenNotificationsCount`,
    DROP COLUMN `userNotificationsCount`;
