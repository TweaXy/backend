/*
  Warnings:

  - You are about to alter the column `cover` on the `User` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(50)`.
  - You are about to alter the column `avatar` on the `User` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(50)`.

*/
-- AlterTable
ALTER TABLE `User` MODIFY `cover` VARCHAR(50) NULL,
    MODIFY `avatar` VARCHAR(50) NULL;
