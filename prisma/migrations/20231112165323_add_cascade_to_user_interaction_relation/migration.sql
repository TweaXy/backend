
-- DropForeignKey
ALTER TABLE `interactions` DROP FOREIGN KEY `Interactions_UserID_fkey`;

-- AddForeignKey
ALTER TABLE `Interactions` ADD CONSTRAINT `Interactions_userID_fkey` FOREIGN KEY (`userID`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
