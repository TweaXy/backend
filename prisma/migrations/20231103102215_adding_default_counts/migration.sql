-- AlterTable
ALTER TABLE `user` MODIFY `followedByCount` INTEGER NOT NULL DEFAULT 0,
    MODIFY `followingCount` INTEGER NOT NULL DEFAULT 0,
    MODIFY `unseenConversationsCount` INTEGER NOT NULL DEFAULT 0;
