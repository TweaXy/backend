
-- DropForeignKey
ALTER TABLE `Conversations` DROP FOREIGN KEY `Conversations_User1ID_fkey`;

-- DropForeignKey
ALTER TABLE `Conversations` DROP FOREIGN KEY `Conversations_User2ID_fkey`;

-- AlterTable
ALTER TABLE `Conversations` DROP COLUMN `User1ID`,
    DROP COLUMN `User2ID`,
    ADD COLUMN `fromUserID` VARCHAR(191) NOT NULL,
    ADD COLUMN `toUserID` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `Conversations` ADD CONSTRAINT `Conversations_fromUserID_fkey` FOREIGN KEY (`fromUserID`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Conversations` ADD CONSTRAINT `Conversations_toUserID_fkey` FOREIGN KEY (`toUserID`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
