/*
  Warnings:

  - You are about to drop the `tokens` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `Tokens` DROP FOREIGN KEY `Tokens_UserID_fkey`;

-- DropTable
DROP TABLE `Tokens`;
