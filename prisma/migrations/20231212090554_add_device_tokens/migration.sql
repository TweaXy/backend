/*
  Warnings:

  - The primary key for the `blocks` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `UserID` on the `blocks` table. All the data in the column will be lost.
  - You are about to drop the column `User1ID` on the `conversations` table. All the data in the column will be lost.
  - You are about to drop the column `User2ID` on the `conversations` table. All the data in the column will be lost.
  - The primary key for the `follow` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `FollowingUserID` on the `follow` table. All the data in the column will be lost.
  - You are about to drop the column `UserID` on the `follow` table. All the data in the column will be lost.
  - You are about to drop the column `UserID` on the `interactions` table. All the data in the column will be lost.
  - The primary key for the `likes` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `UserID` on the `likes` table. All the data in the column will be lost.
  - You are about to drop the column `DirectMessagesId` on the `media` table. All the data in the column will be lost.
  - You are about to drop the column `InteractionsID` on the `media` table. All the data in the column will be lost.
  - The primary key for the `mentions` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `UserID` on the `mentions` table. All the data in the column will be lost.
  - The primary key for the `mutes` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `UserID` on the `mutes` table. All the data in the column will be lost.
  - You are about to drop the column `UserID` on the `notifications` table. All the data in the column will be lost.
  - You are about to drop the column `Username` on the `user` table. All the data in the column will be lost.
  - The primary key for the `views` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `UserID` on the `views` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[username]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userID` to the `Blocks` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user1ID` to the `Conversations` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user2ID` to the `Conversations` table without a default value. This is not possible if the table is not empty.
  - Added the required column `followingUserID` to the `Follow` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userID` to the `Follow` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userID` to the `Interactions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userID` to the `Likes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `interactionsID` to the `Media` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userID` to the `Mentions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userID` to the `Mutes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userID` to the `Notifications` table without a default value. This is not possible if the table is not empty.
  - Added the required column `username` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userID` to the `Views` table without a default value. This is not possible if the table is not empty.

*/

-- CreateTable
CREATE TABLE `AndoridTokens` (
    `id` VARCHAR(191) NOT NULL,
    `userID` VARCHAR(191) NOT NULL,
    `token` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `WebTokens` (
    `id` VARCHAR(191) NOT NULL,
    `userID` VARCHAR(191) NOT NULL,
    `token` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `AndoridTokens` ADD CONSTRAINT `AndoridTokens_userID_fkey` FOREIGN KEY (`userID`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `WebTokens` ADD CONSTRAINT `WebTokens_userID_fkey` FOREIGN KEY (`userID`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
