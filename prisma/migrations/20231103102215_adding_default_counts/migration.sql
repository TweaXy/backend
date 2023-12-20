-- AlterTable
ALTER TABLE `User` MODIFY `FollowedByCount` INTEGER NOT NULL DEFAULT 0,
    MODIFY `FollowingCount` INTEGER NOT NULL DEFAULT 0,
    MODIFY `unseenConversationsCount` INTEGER NOT NULL DEFAULT 0;
