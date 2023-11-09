-- DropForeignKey
ALTER TABLE `Interactions` DROP FOREIGN KEY `Interactions_parentInteractionID_fkey`;

-- AlterTable
ALTER TABLE `Interactions` MODIFY `rank` INTEGER NOT NULL DEFAULT 0,
    MODIFY `parentInteractionID` VARCHAR(191) NULL,
    MODIFY `likesCount` INTEGER NOT NULL DEFAULT 0,
    MODIFY `viewsCount` INTEGER NOT NULL DEFAULT 0,
    MODIFY `commentsCount` INTEGER NOT NULL DEFAULT 0,
    MODIFY `retweetssCount` INTEGER NOT NULL DEFAULT 0;

-- AddForeignKey
ALTER TABLE `Interactions` ADD CONSTRAINT `Interactions_parentInteractionID_fkey` FOREIGN KEY (`parentInteractionID`) REFERENCES `Interactions`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
