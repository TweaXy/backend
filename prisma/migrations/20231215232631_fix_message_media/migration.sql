
-- DropForeignKey
ALTER TABLE `media` DROP FOREIGN KEY `Media_DirectMessagesId_fkey`;

-- DropForeignKey
ALTER TABLE `media` DROP FOREIGN KEY `Media_InteractionsID_fkey`;

-- AlterTable
ALTER TABLE `media` DROP COLUMN `DirectMessagesId`,
    DROP COLUMN `InteractionsID`,
    ADD COLUMN `directMessagesId` VARCHAR(191) NULL,
    ADD COLUMN `interactionsID` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `Media` ADD CONSTRAINT `Media_interactionsID_fkey` FOREIGN KEY (`interactionsID`) REFERENCES `Interactions`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Media` ADD CONSTRAINT `Media_directMessagesId_fkey` FOREIGN KEY (`directMessagesId`) REFERENCES `DirectMessages`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
