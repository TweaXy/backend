/*
  Warnings:

  - You are about to alter the column `cover` on the `user` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(50)`.
  - You are about to alter the column `avatar` on the `user` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(50)`.

*/
-- AlterTable
ALTER TABLE `trends` ADD COLUMN `deletedDate` DATETIME(3) NULL;

-- AlterTable
ALTER TABLE `user` MODIFY `cover` VARCHAR(50) NULL,
    MODIFY `avatar` VARCHAR(50) NULL;
