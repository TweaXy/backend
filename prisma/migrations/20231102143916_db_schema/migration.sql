/*
  Warnings:

  - The primary key for the `Likes` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `tweetID` on the `Likes` table. All the data in the column will be lost.
  - You are about to drop the `tweets` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `interactionID` to the `Likes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `FollowedByCount` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `FollowingCount` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `unseenConversationsCount` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Likes` DROP FOREIGN KEY `Likes_tweetID_fkey`;

-- DropForeignKey
ALTER TABLE `Tweets` DROP FOREIGN KEY `Tweets_UserID_fkey`;

-- AlterTable
ALTER TABLE `Likes` DROP PRIMARY KEY,
    DROP COLUMN `tweetID`,
    ADD COLUMN `interactionID` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`UserID`, `interactionID`);

-- AlterTable
ALTER TABLE `User` ADD COLUMN `deletedDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `FollowedByCount` INTEGER NOT NULL,
    ADD COLUMN `FollowingCount` INTEGER NOT NULL,
    ADD COLUMN `unseenConversationsCount` INTEGER NOT NULL;

-- DropTable
DROP TABLE `Tweets`;

-- CreateTable
CREATE TABLE `Trends` (
    `id` VARCHAR(191) NOT NULL,
    `text` VARCHAR(191) NOT NULL,
    `rank` INTEGER NOT NULL,

    UNIQUE INDEX `Trends_text_key`(`text`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Interactions` (
    `id` VARCHAR(191) NOT NULL,
    `type` VARCHAR(1) NOT NULL,
    `text` VARCHAR(191) NOT NULL,
    `createdDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `deletedDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `rank` INTEGER NOT NULL,
    `parentInteractionID` VARCHAR(191) NOT NULL,
    `UserID` VARCHAR(191) NOT NULL,
    `LikesCount` INTEGER NOT NULL,
    `ViewsCount` INTEGER NOT NULL,
    `commentsCount` INTEGER NOT NULL,
    `retweetssCount` INTEGER NOT NULL,

    UNIQUE INDEX `Interactions_text_key`(`text`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TrendsInteractions` (
    `trendID` VARCHAR(191) NOT NULL,
    `interactionID` VARCHAR(191) NOT NULL,
    `TrendsId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`trendID`, `interactionID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Media` (
    `fileName` VARCHAR(191) NOT NULL,
    `InteractionsID` VARCHAR(191) NOT NULL,
    `DirectMessagesId` VARCHAR(191) NULL,

    PRIMARY KEY (`fileName`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Conversations` (
    `id` VARCHAR(191) NOT NULL,
    `User1ID` VARCHAR(191) NOT NULL,
    `User2ID` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `DirectMessages` (
    `id` VARCHAR(191) NOT NULL,
    `conversationID` VARCHAR(191) NOT NULL,
    `text` VARCHAR(191) NOT NULL,
    `seen` BOOLEAN NOT NULL,
    `createdDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `deletedDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Notifications` (
    `id` VARCHAR(191) NOT NULL,
    `createdDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Mentions` (
    `interactionID` VARCHAR(191) NOT NULL,
    `UserID` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`UserID`, `interactionID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Views` (
    `interactionID` VARCHAR(191) NOT NULL,
    `UserID` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`UserID`, `interactionID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Interactions` ADD CONSTRAINT `Interactions_parentInteractionID_fkey` FOREIGN KEY (`parentInteractionID`) REFERENCES `Interactions`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Interactions` ADD CONSTRAINT `Interactions_UserID_fkey` FOREIGN KEY (`UserID`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TrendsInteractions` ADD CONSTRAINT `TrendsInteractions_TrendsId_fkey` FOREIGN KEY (`TrendsId`) REFERENCES `Trends`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TrendsInteractions` ADD CONSTRAINT `TrendsInteractions_interactionID_fkey` FOREIGN KEY (`interactionID`) REFERENCES `Interactions`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Media` ADD CONSTRAINT `Media_InteractionsID_fkey` FOREIGN KEY (`InteractionsID`) REFERENCES `Interactions`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Media` ADD CONSTRAINT `Media_DirectMessagesId_fkey` FOREIGN KEY (`DirectMessagesId`) REFERENCES `DirectMessages`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Conversations` ADD CONSTRAINT `Conversations_User1ID_fkey` FOREIGN KEY (`User1ID`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Conversations` ADD CONSTRAINT `Conversations_User2ID_fkey` FOREIGN KEY (`User2ID`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DirectMessages` ADD CONSTRAINT `DirectMessages_conversationID_fkey` FOREIGN KEY (`conversationID`) REFERENCES `Conversations`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Likes` ADD CONSTRAINT `Likes_interactionID_fkey` FOREIGN KEY (`interactionID`) REFERENCES `Interactions`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Mentions` ADD CONSTRAINT `Mentions_UserID_fkey` FOREIGN KEY (`UserID`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Mentions` ADD CONSTRAINT `Mentions_interactionID_fkey` FOREIGN KEY (`interactionID`) REFERENCES `Interactions`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Views` ADD CONSTRAINT `Views_UserID_fkey` FOREIGN KEY (`UserID`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Views` ADD CONSTRAINT `Views_interactionID_fkey` FOREIGN KEY (`interactionID`) REFERENCES `Interactions`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
