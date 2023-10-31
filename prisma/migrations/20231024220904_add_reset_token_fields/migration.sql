/*
  Warnings:

  - You are about to drop the column `passwordResetcode` on the `user` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `user` DROP COLUMN `passwordResetcode`,
    ADD COLUMN `ResetToken` VARCHAR(191) NULL,
    ADD COLUMN `ResetTokenCreatedAt` DATETIME(3) NULL;
