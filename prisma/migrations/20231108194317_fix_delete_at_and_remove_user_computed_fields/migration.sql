/*
  Warnings:

  - You are about to drop the column `FollowedByCount` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `FollowingCount` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `seenNotificationsCount` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `UserNotificationsCount` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `DirectMessages` MODIFY `deletedDate` DATETIME(3) NULL;

-- AlterTable
ALTER TABLE `User` DROP COLUMN `FollowedByCount`,
    DROP COLUMN `FollowingCount`,
    DROP COLUMN `seenNotificationsCount`,
    DROP COLUMN `UserNotificationsCount`;
