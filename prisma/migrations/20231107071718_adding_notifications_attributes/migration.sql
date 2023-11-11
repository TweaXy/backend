/*
  Warnings:

  - Added the required column `action` to the `Notifications` table without a default value. This is not possible if the table is not empty.
  - Added the required column `UserID` to the `Notifications` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Blocks` DROP FOREIGN KEY `Blocks_blockingUserID_fkey`;

-- DropForeignKey
ALTER TABLE `Blocks` DROP FOREIGN KEY `Blocks_UserID_fkey`;

-- DropForeignKey
ALTER TABLE `Conversations` DROP FOREIGN KEY `Conversations_User1ID_fkey`;

-- DropForeignKey
ALTER TABLE `Conversations` DROP FOREIGN KEY `Conversations_User2ID_fkey`;

-- DropForeignKey
ALTER TABLE `DirectMessages` DROP FOREIGN KEY `DirectMessages_conversationID_fkey`;

-- DropForeignKey
ALTER TABLE `Follow` DROP FOREIGN KEY `Follow_FollowingUserID_fkey`;

-- DropForeignKey
ALTER TABLE `Follow` DROP FOREIGN KEY `Follow_UserID_fkey`;

-- DropForeignKey
ALTER TABLE `Media` DROP FOREIGN KEY `Media_DirectMessagesId_fkey`;

-- DropForeignKey
ALTER TABLE `Media` DROP FOREIGN KEY `Media_InteractionsID_fkey`;

-- DropForeignKey
ALTER TABLE `Mutes` DROP FOREIGN KEY `Mutes_mutingUserID_fkey`;

-- DropForeignKey
ALTER TABLE `Mutes` DROP FOREIGN KEY `Mutes_UserID_fkey`;

-- DropForeignKey
ALTER TABLE `TrendsInteractions` DROP FOREIGN KEY `TrendsInteractions_interactionID_fkey`;

-- DropForeignKey
ALTER TABLE `TrendsInteractions` DROP FOREIGN KEY `TrendsInteractions_trendID_fkey`;

-- AlterTable
ALTER TABLE `DirectMessages` MODIFY `seen` BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE `Notifications` ADD COLUMN `action` VARCHAR(191) NOT NULL,
    ADD COLUMN `fromUserID` VARCHAR(191) NULL,
    ADD COLUMN `interactionID` VARCHAR(191) NULL,
    ADD COLUMN `seen` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `UserID` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `User` ADD COLUMN `seenNotificationsCount` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `UserNotificationsCount` INTEGER NOT NULL DEFAULT 0;

-- AddForeignKey
ALTER TABLE `Mutes` ADD CONSTRAINT `Mutes_UserID_fkey` FOREIGN KEY (`UserID`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Mutes` ADD CONSTRAINT `Mutes_mutingUserID_fkey` FOREIGN KEY (`mutingUserID`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Blocks` ADD CONSTRAINT `Blocks_UserID_fkey` FOREIGN KEY (`UserID`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Blocks` ADD CONSTRAINT `Blocks_blockingUserID_fkey` FOREIGN KEY (`blockingUserID`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Follow` ADD CONSTRAINT `Follow_UserID_fkey` FOREIGN KEY (`UserID`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Follow` ADD CONSTRAINT `Follow_FollowingUserID_fkey` FOREIGN KEY (`FollowingUserID`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TrendsInteractions` ADD CONSTRAINT `TrendsInteractions_trendID_fkey` FOREIGN KEY (`trendID`) REFERENCES `Trends`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TrendsInteractions` ADD CONSTRAINT `TrendsInteractions_interactionID_fkey` FOREIGN KEY (`interactionID`) REFERENCES `Interactions`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Media` ADD CONSTRAINT `Media_InteractionsID_fkey` FOREIGN KEY (`InteractionsID`) REFERENCES `Interactions`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Media` ADD CONSTRAINT `Media_DirectMessagesId_fkey` FOREIGN KEY (`DirectMessagesId`) REFERENCES `DirectMessages`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Conversations` ADD CONSTRAINT `Conversations_User1ID_fkey` FOREIGN KEY (`User1ID`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Conversations` ADD CONSTRAINT `Conversations_User2ID_fkey` FOREIGN KEY (`User2ID`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DirectMessages` ADD CONSTRAINT `DirectMessages_conversationID_fkey` FOREIGN KEY (`conversationID`) REFERENCES `Conversations`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Notifications` ADD CONSTRAINT `Notifications_UserID_fkey` FOREIGN KEY (`UserID`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Notifications` ADD CONSTRAINT `Notifications_fromUserID_fkey` FOREIGN KEY (`fromUserID`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Notifications` ADD CONSTRAINT `Notifications_interactionID_fkey` FOREIGN KEY (`interactionID`) REFERENCES `Interactions`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
