/*
  Warnings:

  - Made the column `birthdayDate` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `User` MODIFY `password` VARCHAR(50) NOT NULL,
    MODIFY `birthdayDate` DATE NOT NULL,
    MODIFY `passwordResetcode` VARCHAR(191) NULL;
