/*
  Warnings:

  - You are about to alter the column `cover` on the `user` table. The data in that column could be lost. The data in that column will be cast from `LongBlob` to `VarChar(191)`.
  - You are about to alter the column `avatar` on the `user` table. The data in that column could be lost. The data in that column will be cast from `LongBlob` to `VarChar(191)`.

*/
-- AlterTable
ALTER TABLE `User` MODIFY `cover` VARCHAR(191) NULL,
    MODIFY `avatar` VARCHAR(191) NULL;
