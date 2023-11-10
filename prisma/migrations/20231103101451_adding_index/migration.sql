/*
  Warnings:

  - You are about to drop the `_Blocks` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_Mutes` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_UserFollows` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[createdDate]` on the table `Interactions` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE `_Blocks` DROP FOREIGN KEY `_Blocks_A_fkey`;

-- DropForeignKey
ALTER TABLE `_Blocks` DROP FOREIGN KEY `_Blocks_B_fkey`;

-- DropForeignKey
ALTER TABLE `_Mutes` DROP FOREIGN KEY `_Mutes_A_fkey`;

-- DropForeignKey
ALTER TABLE `_Mutes` DROP FOREIGN KEY `_Mutes_B_fkey`;

-- DropForeignKey
ALTER TABLE `_UserFollows` DROP FOREIGN KEY `_UserFollows_A_fkey`;

-- DropForeignKey
ALTER TABLE `_UserFollows` DROP FOREIGN KEY `_UserFollows_B_fkey`;

-- DropTable
DROP TABLE `_Blocks`;

-- DropTable
DROP TABLE `_Mutes`;

-- DropTable
DROP TABLE `_UserFollows`;

-- CreateTable
CREATE TABLE `Mutes` (
    `UserID` VARCHAR(191) NOT NULL,
    `mutingUserID` VARCHAR(191) NOT NULL,

    INDEX `Mutes_UserID_idx`(`UserID`),
    INDEX `Mutes_mutingUserID_idx`(`mutingUserID`),
    PRIMARY KEY (`UserID`, `mutingUserID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Blocks` (
    `UserID` VARCHAR(191) NOT NULL,
    `blockingUserID` VARCHAR(191) NOT NULL,

    INDEX `Blocks_UserID_idx`(`UserID`),
    INDEX `Blocks_blockingUserID_idx`(`blockingUserID`),
    PRIMARY KEY (`UserID`, `blockingUserID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Follow` (
    `UserID` VARCHAR(191) NOT NULL,
    `FollowingUserID` VARCHAR(191) NOT NULL,

    INDEX `Follow_UserID_idx`(`UserID`),
    INDEX `Follow_FollowingUserID_idx`(`FollowingUserID`),
    PRIMARY KEY (`UserID`, `FollowingUserID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `Interactions_createdDate_key` ON `Interactions`(`createdDate` DESC);

-- CreateIndex
CREATE INDEX `User_id_idx` ON `User`(`id`);

-- CreateIndex
CREATE INDEX `User_Username_idx` ON `User`(`Username`);

-- CreateIndex
CREATE INDEX `User_name_idx` ON `User`(`name`);

-- CreateIndex
CREATE INDEX `User_email_idx` ON `User`(`email`);

-- AddForeignKey
ALTER TABLE `Mutes` ADD CONSTRAINT `Mutes_UserID_fkey` FOREIGN KEY (`UserID`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Mutes` ADD CONSTRAINT `Mutes_mutingUserID_fkey` FOREIGN KEY (`mutingUserID`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Blocks` ADD CONSTRAINT `Blocks_UserID_fkey` FOREIGN KEY (`UserID`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Blocks` ADD CONSTRAINT `Blocks_blockingUserID_fkey` FOREIGN KEY (`blockingUserID`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Follow` ADD CONSTRAINT `Follow_UserID_fkey` FOREIGN KEY (`UserID`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Follow` ADD CONSTRAINT `Follow_FollowingUserID_fkey` FOREIGN KEY (`FollowingUserID`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
