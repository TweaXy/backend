
-- DropForeignKey
ALTER TABLE `Media` DROP FOREIGN KEY `Media_DirectMessagesId_fkey`;

-- DropForeignKey
ALTER TABLE `Media` DROP FOREIGN KEY `Media_InteractionsID_fkey`;

-- AlterTable
ALTER TABLE `Media` DROP COLUMN `DirectMessagesId`,
    DROP COLUMN `InteractionsID`,
    ADD COLUMN `DirectMessagesId` VARCHAR(191) NULL,
    ADD COLUMN `InteractionsID` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `Media` ADD CONSTRAINT `Media_InteractionsID_fkey` FOREIGN KEY (`InteractionsID`) REFERENCES `Interactions`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Media` ADD CONSTRAINT `Media_DirectMessagesId_fkey` FOREIGN KEY (`DirectMessagesId`) REFERENCES `DirectMessages`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
