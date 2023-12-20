
-- DropForeignKey
ALTER TABLE `Interactions` DROP FOREIGN KEY `Interactions_UserID_fkey`;

-- AddForeignKey
ALTER TABLE `Interactions` ADD CONSTRAINT `Interactions_UserID_fkey` FOREIGN KEY (`UserID`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
