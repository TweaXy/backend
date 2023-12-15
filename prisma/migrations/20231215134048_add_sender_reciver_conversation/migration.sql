
-- AlterTable
ALTER TABLE `directmessages` ADD COLUMN `receiverId` VARCHAR(191) NOT NULL,
    ADD COLUMN `senderId` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE INDEX `Conversations_user1ID_idx` ON `Conversations`(`user1ID`);

-- CreateIndex
CREATE INDEX `Conversations_user2ID_idx` ON `Conversations`(`user2ID`);

-- AddForeignKey
ALTER TABLE `DirectMessages` ADD CONSTRAINT `DirectMessages_senderId_fkey` FOREIGN KEY (`senderId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DirectMessages` ADD CONSTRAINT `DirectMessages_receiverId_fkey` FOREIGN KEY (`receiverId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- RenameIndex
ALTER TABLE `directmessages` RENAME INDEX `DirectMessages_conversationID_fkey` TO `DirectMessages_conversationID_idx`;
