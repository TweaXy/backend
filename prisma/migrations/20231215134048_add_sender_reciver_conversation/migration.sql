
-- AlterTable
ALTER TABLE `DirectMessages` ADD COLUMN `receiverId` VARCHAR(191) NOT NULL,
    ADD COLUMN `senderId` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE INDEX `Conversations_User1ID_idx` ON `Conversations`(`User1ID`);

-- CreateIndex
CREATE INDEX `Conversations_User2ID_idx` ON `Conversations`(`User2ID`);

-- AddForeignKey
ALTER TABLE `DirectMessages` ADD CONSTRAINT `DirectMessages_senderId_fkey` FOREIGN KEY (`senderId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DirectMessages` ADD CONSTRAINT `DirectMessages_receiverId_fkey` FOREIGN KEY (`receiverId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- RenameIndex
ALTER TABLE `DirectMessages` RENAME INDEX `DirectMessages_conversationID_fkey` TO `DirectMessages_conversationID_idx`;
