
-- AlterTable
ALTER TABLE `Conversations` 
    ADD COLUMN `lastUpdatedMessage` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);
