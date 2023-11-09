/*
  Warnings:

  - Added the required column `action` to the `Notifications` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userID` to the `Notifications` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Blocks` DROP FOREIGN KEY `Blocks_blockingUserID_fkey`;

-- DropForeignKey
ALTER TABLE `Blocks` DROP FOREIGN KEY `Blocks_userID_fkey`;

-- DropForeignKey
ALTER TABLE `Conversations` DROP FOREIGN KEY `Conversations_user1ID_fkey`;

-- DropForeignKey
ALTER TABLE `Conversations` DROP FOREIGN KEY `Conversations_user2ID_fkey`;

-- DropForeignKey
ALTER TABLE `Directmessages` DROP FOREIGN KEY `DirectMessages_conversationID_fkey`;

-- DropForeignKey
ALTER TABLE `Follow` DROP FOREIGN KEY `Follow_followingUserID_fkey`;

-- DropForeignKey
ALTER TABLE `Follow` DROP FOREIGN KEY `Follow_userID_fkey`;

-- DropForeignKey
ALTER TABLE `Media` DROP FOREIGN KEY `Media_directMessagesId_fkey`;

-- DropForeignKey
ALTER TABLE `Media` DROP FOREIGN KEY `Media_interactionsID_fkey`;

-- DropForeignKey
ALTER TABLE `Mutes` DROP FOREIGN KEY `Mutes_mutingUserID_fkey`;

-- DropForeignKey
ALTER TABLE `Mutes` DROP FOREIGN KEY `Mutes_userID_fkey`;

-- DropForeignKey
ALTER TABLE `Trendsinteractions` DROP FOREIGN KEY `TrendsInteractions_interactionID_fkey`;

-- DropForeignKey
ALTER TABLE `Trendsinteractions` DROP FOREIGN KEY `TrendsInteractions_trendID_fkey`;

-- AlterTable
ALTER TABLE `Directmessages` MODIFY `seen` BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE `Notifications` ADD COLUMN `action` VARCHAR(191) NOT NULL,
    ADD COLUMN `fromUserID` VARCHAR(191) NULL,
    ADD COLUMN `interactionID` VARCHAR(191) NULL,
    ADD COLUMN `seen` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `userID` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `User` ADD COLUMN `seenNotificationsCount` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `userNotificationsCount` INTEGER NOT NULL DEFAULT 0;

-- AddForeignKey
ALTER TABLE `Mutes` ADD CONSTRAINT `Mutes_userID_fkey` FOREIGN KEY (`userID`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Mutes` ADD CONSTRAINT `Mutes_mutingUserID_fkey` FOREIGN KEY (`mutingUserID`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Blocks` ADD CONSTRAINT `Blocks_userID_fkey` FOREIGN KEY (`userID`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Blocks` ADD CONSTRAINT `Blocks_blockingUserID_fkey` FOREIGN KEY (`blockingUserID`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Follow` ADD CONSTRAINT `Follow_userID_fkey` FOREIGN KEY (`userID`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Follow` ADD CONSTRAINT `Follow_followingUserID_fkey` FOREIGN KEY (`followingUserID`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Trendsinteractions` ADD CONSTRAINT `TrendsInteractions_trendID_fkey` FOREIGN KEY (`trendID`) REFERENCES `Trends`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Trendsinteractions` ADD CONSTRAINT `TrendsInteractions_interactionID_fkey` FOREIGN KEY (`interactionID`) REFERENCES `Interactions`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Media` ADD CONSTRAINT `Media_interactionsID_fkey` FOREIGN KEY (`interactionsID`) REFERENCES `Interactions`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Media` ADD CONSTRAINT `Media_directMessagesId_fkey` FOREIGN KEY (`directMessagesId`) REFERENCES `DirectMessages`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Conversations` ADD CONSTRAINT `Conversations_user1ID_fkey` FOREIGN KEY (`user1ID`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Conversations` ADD CONSTRAINT `Conversations_user2ID_fkey` FOREIGN KEY (`user2ID`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Directmessages` ADD CONSTRAINT `DirectMessages_conversationID_fkey` FOREIGN KEY (`conversationID`) REFERENCES `Conversations`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Notifications` ADD CONSTRAINT `Notifications_userID_fkey` FOREIGN KEY (`userID`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Notifications` ADD CONSTRAINT `Notifications_fromUserID_fkey` FOREIGN KEY (`fromUserID`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Notifications` ADD CONSTRAINT `Notifications_interactionID_fkey` FOREIGN KEY (`interactionID`) REFERENCES `Interactions`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
