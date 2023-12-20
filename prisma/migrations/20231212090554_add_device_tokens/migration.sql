/*
  Warnings:

  - The primary key for the `Blocks` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `UserID` on the `Blocks` table. All the data in the column will be lost.
  - You are about to drop the column `User1ID` on the `Conversations` table. All the data in the column will be lost.
  - You are about to drop the column `User2ID` on the `Conversations` table. All the data in the column will be lost.
  - The primary key for the `Follow` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `FollowingUserID` on the `Follow` table. All the data in the column will be lost.
  - You are about to drop the column `UserID` on the `Follow` table. All the data in the column will be lost.
  - You are about to drop the column `UserID` on the `Interactions` table. All the data in the column will be lost.
  - The primary key for the `Likes` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `UserID` on the `Likes` table. All the data in the column will be lost.
  - You are about to drop the column `DirectMessagesId` on the `Media` table. All the data in the column will be lost.
  - You are about to drop the column `InteractionsID` on the `Media` table. All the data in the column will be lost.
  - The primary key for the `Mentions` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `UserID` on the `Mentions` table. All the data in the column will be lost.
  - The primary key for the `Mutes` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `UserID` on the `Mutes` table. All the data in the column will be lost.
  - You are about to drop the column `UserID` on the `Notifications` table. All the data in the column will be lost.
  - You are about to drop the column `Username` on the `User` table. All the data in the column will be lost.
  - The primary key for the `Views` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `UserID` on the `Views` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[Username]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `UserID` to the `Blocks` table without a default value. This is not possible if the table is not empty.
  - Added the required column `User1ID` to the `Conversations` table without a default value. This is not possible if the table is not empty.
  - Added the required column `User2ID` to the `Conversations` table without a default value. This is not possible if the table is not empty.
  - Added the required column `FollowingUserID` to the `Follow` table without a default value. This is not possible if the table is not empty.
  - Added the required column `UserID` to the `Follow` table without a default value. This is not possible if the table is not empty.
  - Added the required column `UserID` to the `Interactions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `UserID` to the `Likes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `InteractionsID` to the `Media` table without a default value. This is not possible if the table is not empty.
  - Added the required column `UserID` to the `Mentions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `UserID` to the `Mutes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `UserID` to the `Notifications` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Username` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `UserID` to the `Views` table without a default value. This is not possible if the table is not empty.

*/

-- CreateTable
CREATE TABLE `AndoridTokens` (
    `id` VARCHAR(191) NOT NULL,
    `UserID` VARCHAR(191) NOT NULL,
    `token` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `WebTokens` (
    `id` VARCHAR(191) NOT NULL,
    `UserID` VARCHAR(191) NOT NULL,
    `token` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `AndoridTokens` ADD CONSTRAINT `AndoridTokens_UserID_fkey` FOREIGN KEY (`UserID`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `WebTokens` ADD CONSTRAINT `WebTokens_UserID_fkey` FOREIGN KEY (`UserID`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
