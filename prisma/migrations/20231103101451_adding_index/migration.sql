/*
  Warnings:

  - You are about to drop the `_blocks` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_mutes` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_userfollows` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[createdDate]` on the table `Interactions` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE `_blocks` DROP FOREIGN KEY `_Blocks_A_fkey`;

-- DropForeignKey
ALTER TABLE `_blocks` DROP FOREIGN KEY `_Blocks_B_fkey`;

-- DropForeignKey
ALTER TABLE `_mutes` DROP FOREIGN KEY `_Mutes_A_fkey`;

-- DropForeignKey
ALTER TABLE `_mutes` DROP FOREIGN KEY `_Mutes_B_fkey`;

-- DropForeignKey
ALTER TABLE `_userfollows` DROP FOREIGN KEY `_UserFollows_A_fkey`;

-- DropForeignKey
ALTER TABLE `_userfollows` DROP FOREIGN KEY `_UserFollows_B_fkey`;

-- DropTable
DROP TABLE `_blocks`;

-- DropTable
DROP TABLE `_mutes`;

-- DropTable
DROP TABLE `_userfollows`;

-- CreateTable
CREATE TABLE `Mutes` (
    `userID` VARCHAR(191) NOT NULL,
    `mutingUserID` VARCHAR(191) NOT NULL,

    INDEX `Mutes_userID_idx`(`userID`),
    INDEX `Mutes_mutingUserID_idx`(`mutingUserID`),
    PRIMARY KEY (`userID`, `mutingUserID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Blocks` (
    `userID` VARCHAR(191) NOT NULL,
    `blockingUserID` VARCHAR(191) NOT NULL,

    INDEX `Blocks_userID_idx`(`userID`),
    INDEX `Blocks_blockingUserID_idx`(`blockingUserID`),
    PRIMARY KEY (`userID`, `blockingUserID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Follow` (
    `userID` VARCHAR(191) NOT NULL,
    `followingUserID` VARCHAR(191) NOT NULL,

    INDEX `Follow_userID_idx`(`userID`),
    INDEX `Follow_followingUserID_idx`(`followingUserID`),
    PRIMARY KEY (`userID`, `followingUserID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `Interactions_createdDate_key` ON `Interactions`(`createdDate` DESC);

-- CreateIndex
CREATE INDEX `User_id_idx` ON `User`(`id`);

-- CreateIndex
CREATE INDEX `User_username_idx` ON `User`(`username`);

-- CreateIndex
CREATE INDEX `User_name_idx` ON `User`(`name`);

-- CreateIndex
CREATE INDEX `User_email_idx` ON `User`(`email`);

-- AddForeignKey
ALTER TABLE `Mutes` ADD CONSTRAINT `Mutes_userID_fkey` FOREIGN KEY (`userID`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Mutes` ADD CONSTRAINT `Mutes_mutingUserID_fkey` FOREIGN KEY (`mutingUserID`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Blocks` ADD CONSTRAINT `Blocks_userID_fkey` FOREIGN KEY (`userID`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Blocks` ADD CONSTRAINT `Blocks_blockingUserID_fkey` FOREIGN KEY (`blockingUserID`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Follow` ADD CONSTRAINT `Follow_userID_fkey` FOREIGN KEY (`userID`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Follow` ADD CONSTRAINT `Follow_followingUserID_fkey` FOREIGN KEY (`followingUserID`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
